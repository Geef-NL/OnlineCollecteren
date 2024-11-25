import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class CookieServiceOwn {

  public static readonly LEVEL_REQUIRED = 1;
  public static readonly LEVEL_FUNCTIONAL = 2;
  public static readonly LEVEL_ANALYTIC = 3;
  public static readonly LEVEL_CUSTOM = 0;

  public readonly levels: any = [
    {
      name: 'REQUIRED',
      level: CookieServiceOwn.LEVEL_REQUIRED
    },
    {
      name: 'FUNCTIONAL',
      level: CookieServiceOwn.LEVEL_FUNCTIONAL
    },
    {
      name: 'ANALYTIC',
      level: CookieServiceOwn.LEVEL_ANALYTIC
    },
  ];

  public readonly cookies: any = [
    {
      key: 'geefCookieSettings',
      level: CookieServiceOwn.LEVEL_REQUIRED,
      names: ['geefCookieSettings'],
      company: 'Stichting GeefGratis',
      domains: ['onlinecollecteren.nl']
    },
    {
      key: 'PHPSESSID',
      level: CookieServiceOwn.LEVEL_REQUIRED,
      names: ['PHPSESSID'],
      company: 'Stichting GeefGratis',
      domains: ['onlinecollecteren.nl']
    },
    {
      key: 'geefTokenData',
      level: CookieServiceOwn.LEVEL_FUNCTIONAL,
      names: ['geefTokenData'],
      company: 'Stichting GeefGratis',
      domains: ['onlinecollecteren.nl']
    },
    {
      key: 'facebook',
      level: CookieServiceOwn.LEVEL_FUNCTIONAL,
      names: ['c_user', 'datr', 'fr', 'locale'],
      company: 'Facebook, Inc.',
      domains: ['facebook.com']
    },
    {
      key: 'twitter',
      level: CookieServiceOwn.LEVEL_FUNCTIONAL,
      names: ['guest_id', 'personalization_id', 'tfw_exp'],
      company: 'Twitter, Inc.',
      domains: ['twitter.com']
    },
    {
      key: 'geefRef',
      level: CookieServiceOwn.LEVEL_ANALYTIC,
      names: ['geefRef'],
      company: 'Stichting GeefGratis',
      domains: ['onlinecollecteren.nl']
    },
    {
      key: 'googleAnalytics',
      level: CookieServiceOwn.LEVEL_ANALYTIC,
      names: ['_ga', 'gat_*', '_gid'],
      company: 'Google, Inc.',
      domains: ['onlinecollecteren.nl'],
      linkedWith: 'hubspot'
    },
    {
      key: 'hubspot',
      level: CookieServiceOwn.LEVEL_ANALYTIC,
      names: ['__hssc', '__hssrc', '__hstc', 'hubspotutk'],
      company: 'HubSpot, Inc.',
      domains: ['hubspot.com', 'hs-analytics.net', 'hs-scripts.com', 'onlinecollecteren.nl'],
      linkedWith: 'googleAnalytics'
    }
  ];

  // tslint:disable-next-line:variable-name
  private _settings: any = {
    level: 3
  };

  public isSetUp;
  private readonly cookieSettingsName = 'geefCookieSettings';
  private readonly prerenderCookieName = 'geefPrerender';
  private readonly prerenderUserAgent = 'ngrender';

  private readonly cookieDomain;
  private readonly cookieSecure;

  constructor(private cookieService: CookieService) {
    if (this.isPrerender()) {
      this.setCookieLevel(3);
      this.isSetUp = true;
    } else {
      this.isSetUp = this.hasCookie(this.cookieSettingsName);

      if (this.isSetUp) {
        this._settings = this.getCookie(this.cookieSettingsName);
      }
    }

    // this.cookieDomain = location.hostname;
    this.cookieDomain = location.hostname.split('.').slice(1).join('.');
    this.cookieSecure = location.protocol === 'https:';
  }

  get settings() {
    return this._settings;
  }

  public getCookieDetails(key) {
    return this.cookies.find(cookie => cookie.key === key);
  }

  public cookieAllowed(key) {
    const cookieDetails: any = this.getCookieDetails(key);

    if (cookieDetails === undefined) {
      return false;
    }

    if (cookieDetails.level === CookieServiceOwn.LEVEL_REQUIRED) {
      return true;
    }

    if (!this.isSetUp) {
      return false;
    }

    if (this._settings.level === 0) {
      if (this._settings.custom[key]) {
        return this._settings.custom[key];
      } else {
        return false;
      }
    } else {
      return this._settings.level >= cookieDetails.level;
    }
  }

  public cookieAllowedCustom(key) {
    const cookieDetails: any = this.getCookieDetails(key);

    if (cookieDetails === undefined) {
      return false;
    }

    if (cookieDetails.level === CookieServiceOwn.LEVEL_REQUIRED) {
      return true;
    }

    if (this._settings.custom === undefined || this._settings.custom[key] === undefined) {
      return this._settings.level >= cookieDetails.level;
    } else {
      return this._settings.custom[key];
    }

  }

  public toggleCustomCookieAllow(cookie: any, enabled: boolean = null, roundTrip = 0) {
    if (this._settings.custom === undefined) {
      this.prefillCustomAllows();
    }

    if (enabled === null) {
      enabled = !this.cookieAllowedCustom(cookie.key);
    }

    this._settings.custom[cookie.key] = enabled;

    if (cookie.linkedWith !== undefined && roundTrip === 0) {
      this.toggleCustomCookieAllow(this.getCookieDetails(cookie.linkedWith), enabled, (roundTrip + 1));
    }
  }

  private prefillCustomAllows() {
    const customCookieAllowData = {};

    for (const cookie of this.cookies) {
      customCookieAllowData[cookie.key] = this.cookieAllowedCustom(cookie.key);
    }

    this._settings.custom = customCookieAllowData;
  }


  public resetChanges() {
    this._settings = this.getCookie(this.cookieSettingsName);
  }

  public clearCustomAllows() {
    delete this._settings.custom;

    if (this._settings.level === CookieServiceOwn.LEVEL_CUSTOM) {
      this._settings.level = CookieServiceOwn.LEVEL_ANALYTIC;
    }
  }

  public getCookiesByLevel(level: number) {
    return this.cookies.filter(cookie => cookie.level === level);
  }

  public setCookieLevel(level: number) {
    this._settings.level = level;
  }

  public saveCookieSettings(reloadPage: boolean = false) {
    this.setCookie(this.cookieSettingsName, this._settings, true, 1825, 'days');

    if (reloadPage) {
      location.reload();
    }
  }

  public hasCookie(name) {
    return (this.getCookie(name) !== null);
  }

  public getCookie(name: string, jsonDecode: boolean = true): any {
    let cookieContent = this.cookieService.get(name);

    if (cookieContent === '') {
      cookieContent = null;
    }

    if (jsonDecode && cookieContent !== null) {
      cookieContent = JSON.parse(cookieContent);
    }

    return cookieContent;
  }

  public setCookie(name: string, value: any, jsonEncode: boolean = true, validity: number = 30, validityType: string = 'days', force: boolean = false) {
    if (!force && !this.cookieAllowed(name)) {
      console.error('Cookie ' + name + ' is not allowed by user preference!');

      return;
    }

    if (jsonEncode) {
      value = JSON.stringify(value);
    }

    this.cookieService.set(name, value, validity, '/', this.cookieDomain, this.cookieSecure);
  }

  public removeCookie(name: string) {
    this.cookieService.set(name, '', -1, '/', this.cookieDomain, this.cookieSecure);
  }

  public isPrerender() {
    return this.hasCookie(this.prerenderCookieName) ||
      navigator.userAgent.indexOf(this.prerenderUserAgent) !== -1;
  }

}
