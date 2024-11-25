import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {NotFoundError} from '../app/app.errors';
import {ErrorService} from '../providers/error.service';
import {BoltService} from '../providers/bolt.service';

@Injectable()
export class BoltPageResolver implements Resolve<any> {
  constructor(private bolt: BoltService, private errorService: ErrorService) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    try {
      return await this.bolt.getResource('page', route.paramMap.get('slug')) as any;
    } catch(e) {
      this.triggerNotFound(e);
    }
  }

  private triggerNotFound(error?: Error)
  {
    this.errorService.triggerError(new NotFoundError(error));
  }

}
