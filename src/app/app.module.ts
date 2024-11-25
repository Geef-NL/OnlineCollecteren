import {BrowserModule} from '@angular/platform-browser';
import {DEFAULT_CURRENCY_CODE, ErrorHandler, InjectionToken, LOCALE_ID, NgModule} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import {FormsModule} from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Restangular, RestangularHttp, RestangularModule} from 'ngx-restangular';

import {AlertDialogComponent} from './dialog/alert.component';
import {ApiService} from '../providers/api.service';
import {AppComponent} from './app.component';
import {AppConfig} from './app.config';
import {AppErrorHandler} from './app.error-handler';
import {AppRoutingModule} from './app-routing.module';
import {AuthGuard} from './guards';
import {AuthService} from '../providers/auth.service';
import {BaseComponent} from './base/base.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CardComponent} from './card/card.component';
import {CarouselComponent} from './carousel/carousel.component';
import {CharityCollectingBoxesComponent} from './charity/collecting-boxes/collecting-boxes.component';
import {CharityDetailComponent} from './charity/charity-detail/charity-detail.component';
import {CharityResolver} from '../resolver/charity.resolver';
import {CollectingBoxCreateComponent} from './collecting-box/create/collecting-box-create.component';
import {CollectingBoxDetailComponent} from './collecting-box/detail/collecting-box-detail.component';
import {CollectingBoxResolver} from '../resolver/collectingbox.resolver';
import {CookieServiceOwn} from '../providers/cookie.service';
import {CookieSettingsComponent} from './dialog/cookie-settings.component';
import {CreateCollectingBoxGuard} from './guards';
import {DomService} from '../providers/dom.service';
import {DonationModuleSidebarComponent} from './donation-module-sidebar/donation-module-sidebar.component';
import {ErrorComponent} from './error/error.component';
import {ErrorService} from '../providers/error.service';
import {EventService} from '../providers/event.service';
import {FlashMessageComponent} from './dialog/flash.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {ImageSizePipe} from '../pipes/imageSizePipe';
import {MatSliderModule} from '@angular/material/slider';
import {MetaService} from '../providers/meta.service';
import {QRCodeModule} from 'angularx-qrcode';
import {RestangularBoltFactory, RestangularConfigFactory} from '../providers/restangular.service';
import {SafeHtmlPipe} from '../pipes/safeHTMLPipe';
import {SafeUrlPipe} from '../pipes/safeURLPipe';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {SignupStepsComponent} from './signup-steps/signup-steps.component';
import {SocialShareComponent} from './social-share/social-share.component';
import {TinyMceComponent} from './tinymce/tinymce.component';
import {ImageUpload} from './upload/image-upload';
import {ConfirmRegistrationComponent} from './user/confirm-registration.component';
import {FacebookModule} from 'ngx-facebook';
import {AuthComponent} from './auth/auth.component';
import {PasswordResetComponent} from './user/password-reset.component';
import {UserService} from '../providers/user.service';
import {TranslateSocialHandlePipe} from '../pipes/translateSocialHandle';
import {PageComponent} from './page/page.component';
import {BOLT, BoltService} from '../providers/bolt.service';
import {BoltPageResolver} from '../resolver/bolt-page.resolver';


registerLocaleData(localeNl);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AlertDialogComponent,
    AppComponent,
    BaseComponent,
    CardComponent,
    CarouselComponent,
    CharityCollectingBoxesComponent,
    CharityDetailComponent,
    CollectingBoxCreateComponent,
    CollectingBoxDetailComponent,
    CookieSettingsComponent,
    DonationModuleSidebarComponent,
    ErrorComponent,
    FlashMessageComponent,
    FooterComponent,
    HeaderComponent,
    ImageSizePipe,
    SafeHtmlPipe,
    SafeUrlPipe,
    SearchBarComponent,
    SignupStepsComponent,
    SocialShareComponent,
    TinyMceComponent,
    ImageUpload,
    ConfirmRegistrationComponent,
    AuthComponent,
    PasswordResetComponent,
    TranslateSocialHandlePipe,
    PageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RestangularModule.forRoot([AuthService, ErrorService, AppConfig], RestangularConfigFactory),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'nl'
    }),
    AppRoutingModule,
    MatSliderModule,
    QRCodeModule,
    FacebookModule.forRoot()
  ],
  providers: [
    ApiService,
    AppConfig,
    AuthGuard,
    AuthService,
    CharityResolver,
    CollectingBoxResolver,
    CookieServiceOwn,
    CreateCollectingBoxGuard,
    DomService,
    ErrorService,
    EventService,
    ImageSizePipe,
    MetaService,
    Restangular,
    RestangularHttp,
    UserService,
    BoltPageResolver,
    BoltService,
    {
      provide: BOLT,
      useFactory: RestangularBoltFactory,
      deps: [Restangular, ErrorService, AppConfig]
    },
    {provide: LOCALE_ID, useValue: 'nl'},
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR'},
    {provide: ErrorHandler, useClass: AppErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
