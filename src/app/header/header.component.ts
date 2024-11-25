import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../providers/api.service';
import {AppConfig} from '../app.config';
import {AuthService} from '../../providers/auth.service';
import {CookieServiceOwn} from '../../providers/cookie.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ErrorService} from '../../providers/error.service';
import {EventService} from '../../providers/event.service';
import {MetaService} from '../../providers/meta.service';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../../providers/user.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() public charity;

  authType: string;
  defaults: any = {};
  extraData: any = {};
  loadIframe = false;
  loginForm = {firstName: '', prefix: '', lastName: '', email: '', password: '', newsletterSubscription: false};
  loginFormError: any = false;
  redirectTo: any;

  @HostListener('window:message', ['$event']) onPostMessage(event) {
    if (event.data === this.authService.FacebookLoginEvent) {
      $('#loginModal').modal('hide');
      $('#registerModal').modal('hide');
      this.authService.initialLoad();
    }
  }

  constructor(
    public authService: AuthService,
    public user: UserService,
    private apiService: ApiService,
    private cookieService: CookieServiceOwn,
    private sanitizer: DomSanitizer,
    private errorService: ErrorService,
    private metaService: MetaService,
    private events: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private appConfig: AppConfig
  ) {
    if (!this.user.user) {
      this.toggleIframe(true);
    }

    this.defaults = {
      redirectTo: null
    };

    this.events.toggleLoginDialog.subscribe((data: any) => {
      const settings: any = Object.assign({}, this.defaults, data);

      this.extraData = settings.extraData;

      if (!this.user.user) {
        this.redirectTo = settings.redirectTo;
      }

      if (settings.type === 'set_new_password') {
        $('#resetPasswordModal').modal('show');
      } else {
        $('#loginModal').modal('show');
      }
    });

    this.events.userLogin.subscribe(() => this.toggleIframe(false));
    this.events.userLogout.subscribe(() => this.toggleIframe(true));
    this.events.loadIframe.subscribe(load => {
      this.toggleIframe(load);
    });
  }

  ngOnInit(): void {
    $('#loginModal').on('shown.bs.modal', e => {
      this.showAuthDialog('login');
    });
    $('#registerModal').on('shown.bs.modal', e => {
      this.showAuthDialog('register');
    });
    $('#requestPasswordResetModal').on('shown.bs.modal', e => {
      this.showAuthDialog('request_password_reset');
    });
    $('#resetPasswordModal').on('shown.bs.modal', e => {
      this.showAuthDialog('set_new_password');
    });
  }

  toggleIframe(load: boolean)
  {
    this.loadIframe = load;
    this.postReferrer();
  }

  postReferrer() {
    const isIframe = (input: HTMLElement | null): input is HTMLIFrameElement => input !== null && input.tagName === 'IFRAME';
    const loginIframe = document.getElementById('loginIframe');
    const registerIframe = document.getElementById('registerIframe');

    if (isIframe(loginIframe) && loginIframe.contentWindow) {
      loginIframe.contentWindow.postMessage({referrer: window.location.href}, '*');
    }
    if (isIframe(registerIframe) && registerIframe.contentWindow) {
      registerIframe.contentWindow.postMessage({referrer: window.location.href}, '*');
    }
  }

  toggleStickySearch() {
    this.events.toggleStickySearch.emit();
  }

  showAuthDialog(authType: string) {
    this.authType = authType;
    this.events.toggleLoadingSpinner$.emit(false);
    this.loginForm = {firstName: '', prefix: '', lastName: '', email: '', password: '', newsletterSubscription: false};
    this.loginFormError = null;
  }

  checkValidations() {
    if (this.authType === 'register') {
      if (!this.loginForm.password || !this.loginForm.email) {
        this.loginFormError = this.translate.instant('AUTH.ERR_REQUIRED');
        return false;
      }
      if (!this.loginForm.firstName && this.loginForm.firstName.length < 1) {
        this.loginFormError = this.translate.instant('AUTH.ERR_NAME_REQUIRED');
        return false;
      }
      if (!this.loginForm.firstName && this.loginForm.firstName.length < 1) {
        this.loginFormError = this.translate.instant('AUTH.EER_NAME_REQUIRED');
        return false;
      }
    }

    const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.authType === 'register' || this.authType === 'request_password_reset') {
      if (!emailValidation.test(this.loginForm.email)) {
        this.loginFormError = this.translate.instant('AUTH.ERR_INVALID_EMAIL');
        return false;
      }
    }

    return true;
  }

  submitForm() {
    this.loginFormError = false;

    if (this.authType === 'login') {
      this.events.toggleLoadingSpinner$.emit(true);

      this.authService.usernamePasswordLogin(this.loginForm.email, this.loginForm.password).then(() => {

        $('#loginModal').modal('hide');

        this.events.toggleLoadingSpinner$.emit(false);

        this.events.showFlashMessage.emit({message: 'AUTH.LOGIN_SUCCESSFUL'});

        if (this.redirectTo) {
          this.router.navigate([this.redirectTo]);
        }

      }).catch((error) => {
        this.events.toggleLoadingSpinner$.emit(false);

        if (error.error_description === 'Invalid username and password combination') {
          this.loginFormError = this.translate.instant('AUTH.ERR_CHECK_CREDENTIALS');
        }
      });
    } else if (this.authType === 'register') {
      if (!this.checkValidations()) {
        return;
      }

      this.events.toggleLoadingSpinner$.emit(true);

      const postData = {
        email: this.loginForm.email,
        plainPassword: this.loginForm.password,
        firstName: this.loginForm.firstName,
        lastNamePrefix: this.loginForm.prefix,
        lastName: this.loginForm.lastName,
        newsletterSubscription: this.loginForm.newsletterSubscription,
        origin: this.appConfig.platformOrigin,
      };

      this.apiService.createResource('users', postData).then(() => {
        $('#registerModal').modal('hide');

        this.events.toggleLoadingSpinner$.emit(false);

        this.events.showAlertDialog.emit({
          title: this.translate.instant('AUTH.REGISTER_CONFIRM_TITLE'),
          message: this.translate.instant('AUTH.REGISTER_CONFIRM_MESSAGE') + '<br/>' +
            '<p class="small mt-1"><em>' + this.translate.instant('AUTH.NO_MAIL_RECEIVED') + '</em></p>'
        });
      }).catch((error) => {
        this.events.toggleLoadingSpinner$.emit(false);

        console.error(error.data.violations[0].message);

        if (error.data.violations[0].message === 'This value is already used.') {
          this.loginFormError = this.translate.instant('AUTH.ERR_EMAIL_USED');
          return;
        }

        this.loginFormError = this.translate.instant('AUTH.ERR.PASSWORD.' + error.error.error);
        return false;
      });
    } else if (this.authType === 'request_password_reset') {
      if (!this.checkValidations()) {
        return;
      }

      this.events.toggleLoadingSpinner$.emit(true);

      const formData = new FormData();
      formData.append('email', this.loginForm.email);
      formData.append('origin', this.appConfig.platformOrigin);

      this.apiService.customPOST('user/request-password-reset', formData).then(() => {
        $('#requestPasswordResetModal').modal('hide');

        this.events.toggleLoadingSpinner$.emit(false);

        this.events.showAlertDialog.emit({
          title: this.translate.instant('AUTH.RESET_PASSWORD_CONFIRM_TITLE'),
          message: this.translate.instant('AUTH.RESET_PASSWORD_CONFIRM_TXT') + '<br/>' +
            '<p class="small mt-1"><em>' + this.translate.instant('AUTH.NO_MAIL_RECEIVED') + '</em></p>'
        });

      }).catch((err) => {
        this.showErrorDialog('GLOBAL.OOPS', 'GLOBAL.SOMETHING_WENT_WRONG');
      });
    } else if (this.authType === 'set_new_password') {
      if (!this.checkValidations()) {
        return;
      }

      this.events.toggleLoadingSpinner$.emit(true);

      const formData = new FormData();
      formData.append('plainPassword', this.loginForm.password);
      formData.append('confirmationToken', this.extraData.confirmationToken);

      this.apiService.customPOST('user/set-new-password', formData).then(() => {
        // Success, log in immediately
        this.authService.usernamePasswordLogin(this.extraData.email, this.loginForm.password).then(() => {
          $('.modal').modal('hide');

          this.events.showFlashMessage.emit({
            message: 'AUTH.SET_NEW_PASSWORD_SUCCESSFUL'
          });

          this.router.navigate(['/']);

        }).catch(() => {
          this.showErrorDialog();
        });
      }).catch((err) => {
        console.log(err.error);
        this.loginFormError = this.translate.instant('AUTH.ERR.PASSWORD.' + err.error.error);
        return false;
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private showErrorDialog(title: string = 'GLOBAL.OOPS', message: string = 'GLOBAL.SOMETHING_WENT_WRONG') {
    this.events.toggleLoadingSpinner$.emit(false);

    this.events.showAlertDialog.emit({
      title,
      message,
      translate: true
    });
  }

}
