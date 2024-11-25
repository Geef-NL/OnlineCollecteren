import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Theme} from '../../providers/theme.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {EventService} from '../../providers/event.service';
import { StickyButtonSettings } from "../app.interfaces";
import {FacebookService, InitParams} from 'ngx-facebook';
import {CookieServiceOwn} from '../../providers/cookie.service';
import {DomService} from '../../providers/dom.service';
import {AppConfig} from '../app.config';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  public charity;
  public showSignupSteps = false;

  public stickyBtn: StickyButtonSettings = { type: 'none'};

  constructor(
    public events: EventService,
    private appConfig: AppConfig,
    private route: ActivatedRoute,
    private cookieService: CookieServiceOwn,
    private domService: DomService,
    private fb: FacebookService
  ) {
    this.events.stickyButton$.pipe(debounceTime(5)).subscribe(btnSettings => {
      this.stickyBtn = btnSettings;
    });
  }

  ngOnInit(): void {
    this.charity = this.route.snapshot.data.charity;

    Theme.setCharityColors(this.charity);

    this.events.showSignupSteps$.pipe(
      distinctUntilChanged(),
      debounceTime(5)
    ).subscribe((show) => {
      this.showSignupSteps = show;
    });

    this.setupFacebook();
    this.setupGoogleTagManager();
  }

  private setupFacebook(): void {
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
        }
      });
    }
  }

  private setupGoogleTagManager(): void {
    const gtmId = 'GTM-MJMZH2H';

    const gtmScript = document.createElement('script');
    const gtmFunction = document.createTextNode(`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`);
    gtmScript.appendChild(gtmFunction);
    document.head.insertBefore(gtmScript, document.head.firstChild);

    const iFrame = document.createElement('iframe');
    iFrame.src = '//www.googletagmanager.com/ns.html?id=' + gtmId;
    iFrame.width = '0';
    iFrame.height = '0';
    iFrame.style.display = 'none';
    iFrame.style.visibility = 'hidden';

    const noscript = document.createElement('noscript');
    noscript.appendChild(iFrame);

    document.body.insertBefore(noscript, document.body.firstChild);
  }

}
