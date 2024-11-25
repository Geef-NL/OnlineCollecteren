import {Component, Input, OnInit, HostBinding} from '@angular/core';
import {UserService} from '../../providers/user.service';
import {EventService} from '../../providers/event.service';

@Component({
  selector: 'app-signup-steps',
  templateUrl: './signup-steps.component.html',
  styleUrls: ['./signup-steps.component.scss']
})
export class SignupStepsComponent implements OnInit {

  @Input() charity;

  @HostBinding('class.light') isLight = false;

  email: string;

  constructor(
    public user: UserService,
    private events: EventService
  ) {
  }

  ngOnInit(): void {
  }

  toggleIframe(load) {
    this.events.loadIframe.emit(load);
  }

}
