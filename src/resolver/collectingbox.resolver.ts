import { ApiService } from '../providers/api.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { NotFoundError } from '../app/app.errors';
import { ErrorService } from '../providers/error.service';

@Injectable()
export class CollectingBoxResolver implements Resolve<any> {
  constructor(private api: ApiService, private errorService: ErrorService) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    try {
      const action = await this.api.getResource('actions', route.paramMap.get('slug')) as any;

      if(
        ! action ||
        ! action.charity.id === route.parent.data.charity.id ||
        action.category !== 'collecting-box'
      ) {
        this.triggerNotFound();
      }

      return action;

    } catch(e) {
      this.triggerNotFound(e);
    }
  }

  private triggerNotFound(error?: Error)
  {
    this.errorService.triggerError(new NotFoundError(error));
  }

}
