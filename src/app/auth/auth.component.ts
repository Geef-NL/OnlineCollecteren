import {Component, HostListener, OnInit, Renderer2} from '@angular/core';
import {EventService} from '../../providers/event.service';
import {FacebookService, InitParams} from 'ngx-facebook';
import {CookieServiceOwn} from '../../providers/cookie.service';
import {DomService} from '../../providers/dom.service';
import {AppConfig} from '../app.config';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public referrer: string;

  @HostListener('window:message', ['$event']) onPostMessage(event) {
    this.referrer = event.data.referrer;
  }

  constructor(
    private events: EventService,
    private renderer: Renderer2,
    private cookieService: CookieServiceOwn,
    private domService: DomService,
    private appConfig: AppConfig,
    private fb: FacebookService
  ) {
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'p-0');
  }

  showFacebookLogin() {
    if (this.cookieService.cookieAllowed('facebook')) {
      this.domService.addScript('https://connect.facebook.net/nl_NL/sdk.js', 'facebook');
      this.domService.scriptLoaded.subscribe((scriptIdentifier) => {
        if (scriptIdentifier === 'facebook') {
          const initParams: InitParams = {
            appId: this.appConfig.get('facebook_app_id'),
            xfbml: true,
            version: 'v10.0'
          };
          this.fb.init(initParams);

          this.events.showFacebookLogin.emit(this.referrer);
        }
      });
    }
  }

}
