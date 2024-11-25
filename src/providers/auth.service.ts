import {first} from 'rxjs/operators';
import {AppConfig} from '../app/app.config';
import {CookieServiceOwn} from './cookie.service';
import {ErrorService} from './error.service';
import {EventEmitter} from '@angular/core';
import {EventService} from './event.service';
import {FacebookService, LoginOptions, LoginResponse} from 'ngx-facebook';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';

@Injectable()
export class AuthService {

  public facebookAllowed: boolean;

  private tokenLoaded$: EventEmitter<void> = new EventEmitter();
  private readonly tokenCookieName = 'geefTokenData';
  private renewTokenPromise: Promise<any>;
  private tokenData: any = null;
  private tokenLoaded = false;
  private email: string;
  private facebookAccessToken: any;

  public readonly FacebookLoginEvent = 'FacebookLogin';

  constructor(
    private appConfig: AppConfig,
    private cookieService: CookieServiceOwn,
    private errorService: ErrorService,
    private events: EventService,
    private fb: FacebookService,
    private http: HttpClient
  ) {
    this.facebookAllowed = this.cookieService.cookieAllowed('facebook');

    this.events.showFacebookLogin.subscribe((referrer) => {
      if (!this.facebookAllowed) {
        return;
      }

      this.events.toggleLoadingSpinner$.emit(true);

      const options: LoginOptions = {
        scope: 'email',
        return_scopes: true,
        enable_profile_selector: true
      };

      this.fb.login(options)
        .then((loginResponse: LoginResponse) => {
          this.facebookAccessToken = loginResponse.authResponse.accessToken;

          if (loginResponse.status !== 'connected') {
            this.events.toggleLoadingSpinner$.emit(false);

            return;
          }

          this.facebookLogin(loginResponse.authResponse.accessToken).then(() => {
            window.parent.postMessage(this.FacebookLoginEvent, '*');
          }, loginError => {
            console.error(loginError);

            this.errorService.sendEmail.subscribe(errorResponse => {
              this.email = errorResponse;
              this.facebookLogin(this.facebookAccessToken, errorResponse).then(() => {
                // this.afterLogin();
              });
            }, error => {
              console.error(error);

              this.showErrorDialog();
            });
            this.errorService.sendPassword.subscribe(res => {
              this.facebookLogin(this.facebookAccessToken, this.email, res).then(() => {
                // this.afterLogin();
              });
            }, error => {
              console.error(error);

              this.showErrorDialog();
            });
          });
        })
        .catch(loginError => {
          console.error(loginError);

          this.showErrorDialog();
        });
    });
  }

  public get authUri() {
    return window.location.origin.replace(/(:\/\/[a-z0-9-]+\.)/, '://auth.');
  }

  public get user() {
    return (this.tokenData && this.tokenData.user) ? this.tokenData.user : null;
  }

  public get accessToken() {
    return this.tokenData ? this.tokenData.access_token : null;
  }

  public get refreshToken() {
    return this.tokenData ? this.tokenData.refresh_token : null;
  }

  public static unsubscribeEventSubscriptions(subscriptions: Subscription[]) {
    for (const subscription of subscriptions) {
      subscription.unsubscribe();
    }
  }

  private showErrorDialog(title: string = 'GLOBAL.OOPS', message: string = 'GLOBAL.SOMETHING_WENT_WRONG') {
    this.events.showAlertDialog.emit({
      title,
      message,
      translate: true
    });
  }

  public async initialLoad() {
    const tokenData = this.getTokenDataFromCookie();

    if (tokenData !== null && typeof tokenData.refresh_token !== 'undefined') {
      this.tokenData = tokenData;
      await this.renewToken(); // Reload accessToken to make sure it's still valid and load user in memory
    } else {
      await this.getToken();
    }

    this.tokenLoaded$.emit();
  }

  private getTokenDataFromCookie() {
    return this.cookieService.getCookie(this.tokenCookieName);
  }

  public renewToken(): Promise<string> {

    if (!this.renewTokenPromise) {

      const refreshToken = this.refreshToken;

      let postData;

      // Refresh accessToken proberen
      if (refreshToken !== null) {
        postData = {
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        };

        this.renewTokenPromise = new Promise((resolve) => {
          this.getToken(postData).then(tokenData => {
              resolve(tokenData);
            },
            () => {
              // Refresh accessToken niet (meer) geldig; normaal nieuw accessToken ophalen
              this.getToken().then(tokenData => {
                resolve(tokenData);
              });
            });
        });
      } else {
        // Geen refresh accessToken; normaal nieuw accessToken ophalen
        this.renewTokenPromise = this.getToken();
      }

      this.renewTokenPromise.then(() => {
        this.renewTokenPromise = null;
      }, () => {
        this.renewTokenPromise = null;
      });

    }

    return this.renewTokenPromise;
  }

  private getToken(postData = {}) {

    return new Promise((resolve, reject) => {
      const tokenScriptUrl = this.appConfig.get('deploy_url') + 'get-geef-api-token.php?env=' + this.appConfig.get('name');
      this.http.post(tokenScriptUrl, postData).subscribe((tokenData: any) => {
        this.handleTokenResponse(tokenData);
        resolve(tokenData);
      }, err => {
        const errorJson = err.error;
        this.errorService.showErrorPopup(errorJson.error_description);
        reject(errorJson);
      });
    });
  }

  private handleTokenResponse(tokenData, isFromApi = true) {
    this.tokenData = tokenData;

    const tokenDataToSave = {
      ...tokenData
    };
    if (tokenData.user) {
      delete tokenDataToSave.user; // Dont save user in cookie
    }
    this.cookieService.setCookie(this.tokenCookieName, tokenDataToSave);

    if (tokenData.user) {
      this.events.userLogin.emit(tokenData.user);
    } else {
      this.events.userLogout.emit();
    }
  }

  public usernamePasswordLogin(email, password) {
    const postData = {
      grant_type: 'password',
      username: email,
      password
    };
    return this.getToken(postData);
  }

  public facebookLogin(fbAccessToken, email?, password?) {
    const postData: any = {
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      subject_token_type: 'facebook_access_token',
      subject_token: fbAccessToken
    };

    if (email) {
      postData.email = email;
    }
    if (password) {
      postData.password = password;
    }

    return this.getToken(postData);
  }

  public confirmationTokenLogin(confirmationToken) {
    const postData = {
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      subject_token_type: 'confirmation_token',
      subject_token: confirmationToken
    };

    return this.getToken(postData);
  }

  public logout() {
    this.cookieService.removeCookie(this.tokenCookieName);
    return this.getToken(); // Auth-loze accessToken opvragen
  }

  public afterTokenLoad() {
    return new Promise((resolve) => {
      if (!this.tokenLoaded) {
        this.tokenLoaded$.pipe(
          first()
        ).subscribe(() => {
          this.tokenLoaded = true;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

}
