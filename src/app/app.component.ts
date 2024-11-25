import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {AuthService} from '../providers/auth.service';
import {AppConfig} from './app.config';
import {CookieServiceOwn} from '../providers/cookie.service';
import {EventService} from '../providers/event.service';
import {TranslateService} from '@ngx-translate/core';
import {distinctUntilChanged, distinctUntilKeyChanged, filter, map} from 'rxjs/operators';
import {animate, style, transition, trigger} from '@angular/animations';
import {merge, Observable} from 'rxjs';
import {MetaService} from '../providers/meta.service';
import {StickyButtonSettings} from './app.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({opacity: 0}),
            animate('150ms ease-out',
              style({opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({opacity: 1}),
            animate('150ms ease-in',
              style({opacity: 0}))
          ]
        )
      ]
    )
  ]
})
export class AppComponent implements OnInit, AfterViewInit {

  activated = false;

  public loading$: Observable<boolean>;

  constructor(
    private router: Router,
    private appConfig: AppConfig,
    private authService: AuthService,
    private cookieService: CookieServiceOwn,
    private events: EventService,
    private meta: MetaService,
    private translateService: TranslateService,
  ) {
    translateService.setDefaultLang('nl');
    translateService.use('nl');

    const routerLoading$: Observable<boolean> = this.router.events.pipe(
      filter(e => e instanceof NavigationStart || e instanceof NavigationEnd),
      map(e => e instanceof NavigationStart),
      distinctUntilChanged()
    );

    this.loading$ = merge(
      routerLoading$,
      this.events.toggleLoadingSpinner$)
      .pipe(
        distinctUntilChanged()
      ) as Observable<boolean>;

    this.events.search.subscribe((sq) => {
      this.router.navigate(['collectebussen', {s: sq}]);
    });

    this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
    ).subscribe(() => {
      this.events.stickyButton$.next({type: 'none'});
      this.meta.resetMetaTags();
    });

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
    ).subscribe(() => {
      this.events.showSignupSteps$.next(false);
    });

    window.addEventListener('message', (ev) => {
      if (ev.origin !== appConfig.get('siteBaseUrl')) {
        return;
      }
      if (ev.data === 'geef.dm.backToSite') {
        this.events.hideDonationModuleSidebar.emit();
      }
    }, false);

    this.events.showDonationModuleSidebar.subscribe(() => {
      document.body.classList.add('oh');
    });
    this.events.hideDonationModuleSidebar.subscribe(() => {
      document.body.classList.remove('oh');
    });
    this.events.stickyButton$.pipe(
      distinctUntilKeyChanged('type'),
    ).subscribe((stickBtnSettings: StickyButtonSettings) => {
      if (stickBtnSettings.type !== 'none') {
        document.body.classList.add('has-sticky-btn');
      } else {
        document.body.classList.remove('has-sticky-btn');
      }
    });
  }

  ngOnInit(): void {
    this.setupRefParam();
  }

  ngAfterViewInit(): void {
    const donationStatus = this.getQueryParameter('status');
    if (donationStatus === 'paid') {
      this.events.showAlertDialog.emit({
        title: 'GLOBAL.THANKS_FOR_DONATION',
        message: 'GLOBAL.THANKS_FOR_DONATION_EXTRA',
        translate: true
      });
    }
  }

  private setupRefParam(): void {
    const refParameter = this.getQueryParameter('ref');
    if (refParameter !== null) {
      if (this.cookieService.cookieAllowed('geefRef')) {
        this.cookieService.setCookie('geefRef', refParameter, false, null, null);
      }
    }
  }

  onActivate() {
    if (!this.activated && this.router.url !== '/privacy') {
      const cookiesAcknowledged = this.cookieService.isSetUp;
      if (!cookiesAcknowledged) {
        this.events.showCookieSettingsDialog.emit();
      }
    }

    this.activated = true;
  }

  private getQueryParameter(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);

    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
