import {Component, Input, OnInit} from '@angular/core';
import {EventService} from '../../providers/event.service';
import {BoltService} from '../../providers/bolt.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() public charity;

  constructor(
    public bolt: BoltService,
    private events: EventService
  ) {
  }

  ngOnInit(): void {
  }

  showCookieSettingsDialog() {
    this.events.showCookieSettingsDialog.emit();
  }

}
