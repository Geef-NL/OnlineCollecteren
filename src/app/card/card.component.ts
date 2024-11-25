import {Component, Input, OnInit} from '@angular/core';
import {CollectorInterface} from '../../interfaces/collector.interface';
import { EventService } from "../../providers/event.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input()
  collector: CollectorInterface;
  @Input()
  showCharity = false;

  constructor(
    private events: EventService
  ) { }

  ngOnInit(): void {
  }

  openDonationModule() {
    this.events.showDonationModuleSidebar.emit(this.collector.id);
  }

}
