import {ApiService} from '../providers/api.service';
import {ActivatedRouteSnapshot, Resolve, ResolveEnd, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AppConfig} from '../app/app.config';
import {ErrorService} from '../providers/error.service';
import {NotFoundError} from '../app/app.errors';
import {EventService} from '../providers/event.service';

@Injectable()
export class CharityResolver implements Resolve<any> {
  constructor(
    private api: ApiService,
    private appConfig: AppConfig,
    private errorService: ErrorService,
    private events: EventService,
    private router: Router
  ) {
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {

    if (this.appConfig.charitySlug === 'auth') {
      this.triggerAuth();
      return;
    }

    try {
      const charity = await this.api.getResource('charities', this.appConfig.charitySlug) as any;

      if (!charity || !charity.details.onlineCollecterenEnabled) {
        this.triggerNotFound();
      }

      const latestActions = await this.api.getCollection('actions', {
        charity: charity.id,
        category: 'collecting-box',
        order: 'id',
        active: true,
        items_per_page: 1,
        page: 1
      }) as any;
      if (latestActions.length) {
        charity.latestAction = latestActions[0];
      } else {
        charity.latestAction = null;
      }
      return charity;

    } catch (e) {
      this.triggerNotFound(e);
    }

  }

  private triggerAuth() {
    // Only navigate on the first route to avoid looping
    this.router.events.subscribe(event => {
      if (event instanceof ResolveEnd && event.id === 1) {
        this.router.navigate(['auth'], {
          skipLocationChange: true
        });
      }
    });
  }

  private triggerNotFound(error?: Error) {
    this.errorService.triggerError(new NotFoundError(error));
  }

}
