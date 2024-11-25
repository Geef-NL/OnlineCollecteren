import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import { StickyButtonSettings } from "../app/app.interfaces";

@Injectable()
export class EventService {
  hideDonationModuleSidebar: EventEmitter<void> = new EventEmitter<void>();
  search: EventEmitter<string> = new EventEmitter<string>();
  showAlertDialog: EventEmitter<any> = new EventEmitter<any>();
  showCookieSettingsDialog: EventEmitter<any> = new EventEmitter<any>();
  showDonationModuleSidebar: EventEmitter<number> = new EventEmitter<number>();
  showFacebookLogin: EventEmitter<any> = new EventEmitter<any>();
  showFlashMessage: EventEmitter<any> = new EventEmitter<any>();
  loadIframe: EventEmitter<boolean> = new EventEmitter<boolean>();
  showSignupSteps$: Subject<boolean> = new BehaviorSubject<boolean>(true);
  stickyButton$: Subject<StickyButtonSettings> = new BehaviorSubject<any>({ type: 'create' });
  toggleLoadingSpinner$: EventEmitter<boolean> = new EventEmitter<boolean>();
  toggleLoginDialog: EventEmitter<any> = new EventEmitter<any>();
  toggleStickySearch: EventEmitter<boolean> = new EventEmitter<boolean>();
  userCollectionBoxCreated: EventEmitter<any> = new EventEmitter<any>();
  userLogin: EventEmitter<any> = new EventEmitter();
  userLogout: EventEmitter<any> = new EventEmitter();
}
