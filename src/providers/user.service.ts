import {HostListener, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {AppConfig} from '../app/app.config';
import {EventService} from './event.service';
import {CollectingBoxInterface} from '../interfaces/collecting-box.interface';
import {MetaService} from './meta.service';
import {Router} from '@angular/router';

@Injectable()
export class UserService {

  public collectingBox: CollectingBoxInterface;

  constructor(
    private appConfig: AppConfig,
    private apiService: ApiService,
    private auth: AuthService,
    private events: EventService,
    private meta: MetaService,
    private router: Router
  ) {
    this.setupCollectingBox(false);

    this.events.userLogin.subscribe(() => {
      this.setupCollectingBox(true);
    });

    this.events.userCollectionBoxCreated.subscribe(collectingBox => {
      this.setCollectingBox(collectingBox);
    });

    this.events.userLogout.subscribe(() => {
      this.collectingBox = null;
    });

  }

  public get user() {
    return this.auth.user;
  }

  private async setupCollectingBox(navigate = false) {
    const userCb = await this.fetchCollectingBox();

    if (userCb) {
      this.setCollectingBox(userCb);

      if (navigate === true) {
        await this.router.navigate(['collectebussen/' + userCb.slug]);
      }
    }
  }

  async fetchCollectingBox(): Promise<any> {
    if (!this.user) {
      return;
    }

    const charity = await this.apiService.getResource('charities', this.appConfig.charitySlug) as any;
    const filters = {
      charity: charity.id,
      user: this.user.id,
      category: 'collecting-box',
      active: true,
    } as any;
    const actions = await this.apiService.getCollection('actions', filters) as any;

    if (actions.totalItems === 0) {
      return null;
    }

    return actions[0];
  }

  private setCollectingBox(collectingBox) {
    collectingBox.url = this.meta.getCollectingBoxUrl(collectingBox.slug);
    this.collectingBox = collectingBox;
  }

}
