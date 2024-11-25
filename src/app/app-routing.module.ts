import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CreateCollectingBoxGuard} from './guards';
import {CharityCollectingBoxesComponent} from './charity/collecting-boxes/collecting-boxes.component';
import {CharityDetailComponent} from './charity/charity-detail/charity-detail.component';
import {CollectingBoxDetailComponent} from './collecting-box/detail/collecting-box-detail.component';
import {CollectingBoxCreateComponent} from './collecting-box/create/collecting-box-create.component';
import {CollectingBoxResolver} from '../resolver/collectingbox.resolver';
import {BaseComponent} from './base/base.component';
import {CharityResolver} from '../resolver/charity.resolver';
import {AuthComponent} from './auth/auth.component';
import {ErrorComponent} from './error/error.component';
import {NotFoundError} from './app.errors';
import {ConfirmRegistrationComponent} from './user/confirm-registration.component';
import {PasswordResetComponent} from './user/password-reset.component';
import {PageComponent} from './page/page.component';
import {BoltPageResolver} from '../resolver/bolt-page.resolver';

const routes: Routes = [
  {path: 'error', component: ErrorComponent},
  {
    path: '',
    component: BaseComponent,
    resolve: {
      charity: CharityResolver
    },
    children: [
      {path: '', component: CharityDetailComponent},
      {path: 'collectebussen', component: CharityCollectingBoxesComponent},
      {
        path: 'collectebussen/:slug',
        component: CollectingBoxDetailComponent,
        resolve: {
          collectingBox: CollectingBoxResolver
        }
      },
      {path: 'collectebus-aanmaken', component: CollectingBoxCreateComponent, canActivate: [CreateCollectingBoxGuard]},
      {
        path: 'nl/profiel/activeer/:confirmation_token',
        component: ConfirmRegistrationComponent,
      },
      {
        path: 'nl/profiel/wachtwoord-instellen/:confirmation_token',
        component: PasswordResetComponent,
      },
      {
        path: 'pagina/:slug',
        component: PageComponent,
        resolve: {
          page: BoltPageResolver
        }
      },
    ]
  },
  {path: 'auth', component: AuthComponent},
  {path: '**', component: ErrorComponent, data: {error: 'NotFoundError'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
