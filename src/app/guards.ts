import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../providers/auth.service';
import {EventService} from '../providers/event.service';
import {UserService} from '../providers/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    protected auth: AuthService,
    protected events: EventService,
    protected router: Router
  ) {
    this.auth.initialLoad();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const redirectTo: string = state.url;

    return this.checkLogin(redirectTo);
  }

  checkLogin(redirectTo: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth.afterTokenLoad().then(() => {
        if (this.auth.user) {
          resolve(true);
        } else {
          this.router.navigate(['/']).then(() => {
            this.events.toggleLoginDialog.emit({
              redirectTo
            });
          });
        }
      });
    });
  }

}

@Injectable()
export class CreateCollectingBoxGuard implements CanActivate {

  constructor(
    protected auth: AuthService,
    protected events: EventService,
    protected router: Router,
    protected user: UserService
  ) {
    if (!this.auth.user) {
      this.auth.initialLoad();
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const redirectTo: string = state.url;

    return this.checkLoginAndColboxPresence(redirectTo);
  }

  checkLoginAndColboxPresence(redirectTo: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth.afterTokenLoad().then(() => {
        if (this.auth.user) {
          this.user.fetchCollectingBox().then(userCb => {
            if (!userCb) {
              resolve(true);
            } else {
              // User already has a collecting box
              this.router.navigate(['collectebussen/' + userCb.slug]);
            }
          });
        } else {
          this.router.navigate(['/']).then(() => {
            this.events.toggleLoginDialog.emit({
              redirectTo
            });
          });
        }
      });
    });
  }

}
