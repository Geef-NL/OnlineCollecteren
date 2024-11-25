import {Component, OnInit} from '@angular/core';
import {CookieServiceOwn} from '../../providers/cookie.service';
import {EventService} from '../../providers/event.service';

@Component({
  selector: 'app-cookie-settings',
  templateUrl: './cookie-settings.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class CookieSettingsComponent implements OnInit {

  settings: any = {};
  switchingView = false;
  view: any = {};
  visible = false;

  constructor(
    private events: EventService,
    public cookieService: CookieServiceOwn
  ) {
  }

  ngOnInit(): void {
    this.events.showCookieSettingsDialog.subscribe(() => {
      if (this.cookieService.isSetUp) {
        this.view = {
          closeable: true,
          mode: (this.cookieService.settings.level === 0) ? 'advanced' : 'settings'
        };
      } else {
        this.view = {
          closeable: false,
          mode: 'initial'
        };

      }

      this.visible = true;
    });
  }

  hideDialog(resetChanges: boolean = false) {
    if (resetChanges) {
      this.cookieService.resetChanges();
    }
    this.visible = false;
  }

  setViewMode(mode: string) {
    this.switchingView = true;
    setTimeout(() => {
      this.view.mode = mode;
    }, 50);
    setTimeout(() => {
      this.switchingView = false;
    }, 100);
  }

}
