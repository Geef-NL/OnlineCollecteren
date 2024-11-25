import {Component} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {EventService} from '../../providers/event.service';
import {OnInit} from '@angular/core';

@Component({
  selector: 'app-flash',
  styleUrls: ['./dialog.component.scss'],
  template: `
    <div class="flashMessage" [ngClass]="{'show': visible}">
      <span class="flashClose" (click)="close()">&times;</span>
      <div class="flashContent">{{ message | translate }}</div>
    </div>`
})
export class FlashMessageComponent implements OnInit {

  public visible = false;
  public message = '';
  private onClose: EventEmitter<boolean>;
  private autoClose = true;
  private autoCloseDelay: number;
  private readonly defaults: any;

  constructor(private events: EventService) {
    this.defaults = {
      visible: true,
      autoClose: true,
      autoCloseDelay: 8000,
      message: null,
      onClose: null,
    };
  }

  ngOnInit() {
    this.events.showFlashMessage.subscribe((data: any) => {
      const settings: any = Object.assign({}, this.defaults, data);

      this.message = settings.message;
      this.onClose = settings.onClose;
      this.autoClose = settings.autoClose;
      this.autoCloseDelay = settings.autoCloseDelay;
      this.visible = true;

      if (this.autoClose) {
        setTimeout(() => {
          this.close();
        }, this.autoCloseDelay);
      }
    });
  }

  close() {
    this.visible = false;

    if (this.onClose) {
      this.onClose.emit(true);
    }
  }

}
