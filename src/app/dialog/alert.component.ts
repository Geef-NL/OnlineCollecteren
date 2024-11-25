import {Component} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {EventService} from '../../providers/event.service';
import {OnInit} from '@angular/core';

@Component({
  selector: 'app-alert',
  styleUrls: ['./dialog.component.scss'],
  template: `
    <div class="dialog onTop" [ngClass]="{'show': visible}">
      <div class="dialogFader"></div>
      <div class="dialogContainer">
        <div class="dialogInner">

          <div class="dialogTitle">{{ translate ? (title | translate) : title }}</div>

          <div class="dialogContent" [innerHtml]="translate ? (message | translate) : message"></div>
          <div class="dialogButtons one">
            <button type="button" class="btn btn-secondary" (click)="confirm()">OK</button>
          </div>

        </div>
      </div>
    </div>`
})

export class AlertDialogComponent implements OnInit {

  public visible = false;
  public message = '';
  public title = '';
  public translate = false;
  private onConfirm: EventEmitter<boolean>;
  private readonly defaults: any;

  constructor(private events: EventService) {
    this.defaults = {
      visible: true,
      title: '',
      message: null,
      onConfirm: null,
      translate: false
    };
  }

  ngOnInit() {
    this.events.showAlertDialog.subscribe((data: any) => {
      const settings: any = Object.assign({}, this.defaults, data);
      this.translate = settings.translate;
      this.message = settings.message;
      this.title = settings.title;
      this.onConfirm = settings.onConfirm;
      this.visible = true;
    });
  }

  confirm() {
    this.visible = false;

    if (this.onConfirm) {
      this.onConfirm.emit(true);
    }
  }

}
