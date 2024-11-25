import {Injectable} from '@angular/core';

@Injectable()
export class AppConfig {

  private static envConfigs = [
    {
      domainRegex: '([a-zA-Z0-9\-_]+).onlinecollecteren.test',
      name: 'dev',
      boltBaseUrl: 'https://bolt.geef.nl/api',
      apiBaseUrl: 'http://api.geef.test',
      apiIO: 'https://test.geef.io',
      siteBaseUrl: 'http://geef.test',
      cookie_domain: 'onlinecollecteren.test',
      type: 'dev',
      base_href: '',
      deploy_url: '/',
      facebook_app_id: '180022309233094'
    },
    {
      domainRegex: '([a-zA-Z0-9\-_]+).onlinecollecteren.linku-test5.nl',
      name: 'test',
      boltBaseUrl: 'https://testbolt.geef.nl/api',
      apiBaseUrl: 'https://testomgeving.geef.nl',
      apiIO: 'https://test.geef.io',
      siteBaseUrl: 'https://test.geef.nl',
      type: 'test',
      base_href: '',
      deploy_url: '/',
      facebook_app_id: '1995526847337260'
    },
    {
      domainRegex: '([a-zA-Z0-9\-_]+).test.onlinecollecteren.nl',
      name: 'test',
      boltBaseUrl: 'https://testbolt.geef.nl/api',
      apiBaseUrl: 'https://testomgeving.geef.nl',
      apiIO: 'https://test.geef.io',
      siteBaseUrl: 'https://test.geef.nl',
      type: 'test',
      base_href: '',
      deploy_url: '/',
      facebook_app_id: '1995526847337260'
    },
    {
      domainRegex: '([a-zA-Z0-9\-_]+).onlinecollecteren.nl',
      name: 'prod',
      boltBaseUrl: 'https://bolt.geef.nl/api',
      apiBaseUrl: 'https://api.geef.nl',
      apiIO: 'https://geef.io',
      siteBaseUrl: 'https://www.geef.nl',
      type: 'prod',
      base_href: '',
      deploy_url: '/',
      facebook_app_id: '1995525390670739'
    }
  ];
  private readonly currEnv;

  public charitySlug;
  public platformOrigin;

  constructor() {
    this.currEnv = AppConfig.envConfigs.find((envConf) => {
      return new RegExp(envConf.domainRegex).test(location.hostname);
    });

    this.charitySlug = window.location.hostname.match(this.currEnv.domainRegex)[1];
    this.platformOrigin = location.origin;

    this.currEnv.mobile = (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    );

    this.currEnv.inframe = this.siteIsInFrame();
  }

  private siteIsInFrame(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  get(varname: string) {
    if (typeof this.currEnv[varname] !== 'undefined') {
      return this.currEnv[varname];
    }

    return null;
  }

}
