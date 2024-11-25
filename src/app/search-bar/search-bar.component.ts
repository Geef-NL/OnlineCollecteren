import {Component, Input, OnInit} from '@angular/core';
import { EventService } from '../../providers/event.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  sticky = false;

  public query = '';

  constructor(private events: EventService) {
    this.events.toggleStickySearch.subscribe(() => {
      this.sticky = !this.sticky;
    });
  }

  ngOnInit(): void {
  }

  toggleStickySearch() {
    this.events.toggleStickySearch.emit();
  }

  submit(ev)
  {
    this.events.search.emit(this.query);
  }

}
