import {forwardRef, Inject, Injectable, InjectionToken} from '@angular/core';

export const BOLT = new InjectionToken<any>('RestangularBolt');

@Injectable()
export class BoltService {

  public menu: any = {
    onlinecollecteren: {title: '', items: []},
    footerSnippets: []
  };

  constructor(
    @Inject(forwardRef(() => BOLT)) public RestangularBolt
  ) {
    this.loadMenu();
  }

  public loadMenu() {
    this.getMenu().then(res => {
      this.menu = [];
      (res as any).forEach((menu: any) => {
        this.menu[menu.slug] = menu;
      });
      this.loadSnippets();
    });
  }

  getMenu() {
    return new Promise(resolve => {
      this.RestangularBolt.all('nl/menu').getList().subscribe(
        res => {
          resolve(res);
        },
        err => {
          console.error(err);
        });
    });
  }

  getResource(type, slug) {
    return new Promise((resolve, reject) => {
      this.RestangularBolt.one('nl/' + type + '/' + slug).get().subscribe(
        res => {
          resolve(res);
        },
        err => {
          console.error(err);
          reject(err);
        });
    });
  }

  getSnippet(location: string) {
    return this.RestangularBolt.all(`nl/snippet?location=${location}`).getList().toPromise();
  }


  private async loadSnippets() {
    try {
      const snippets = await this.getSnippet('footer');
      this.menu.footerSnippets = snippets.map(snippet => snippet.body);
    } catch (e) {
      console.error(e);
    }
  }
}
