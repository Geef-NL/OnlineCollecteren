import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiService} from '../../../providers/api.service';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../../../providers/event.service';
import {MetaService} from '../../../providers/meta.service';
import {UserService} from '../../../providers/user.service';

@Component({
  selector: 'app-charity-detail',
  templateUrl: './charity-detail.component.html',
  styleUrls: ['./charity-detail.component.scss']
})
export class CharityDetailComponent implements OnInit, AfterViewInit {

  public charity;
  public actions;
  public loadingActions = true;
  public totalNumActions;
  public headerImages = [];

  constructor(
    private api: ApiService,
    private events: EventService,
    private route: ActivatedRoute,
    public user: UserService,
    private meta: MetaService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.events.stickyButton$.next({
      type: 'create'
    });
    this.events.showSignupSteps$.next(true);

    this.charity = this.route.snapshot.data.charity;

    this.headerImages = Object.keys(this.charity.files).filter((fileKey) => {
      return fileKey.substr(0, 8) === 'oc_image';
    }).map((fileKey) => {
      return this.charity.files[fileKey].file;
    });

    this.actions = await this.api.getCollection('actions', {
      charity: this.charity.id,
      category: 'collecting-box',
      order: 'statistics.donationsCountLastWeek',
      active: true,
      items_per_page: 8,
      page: 1
    });
    this.loadingActions = false;
    this.totalNumActions = this.actions.totalItems;
  }

  ngAfterViewInit(): void {
    this.meta.setMetaTags(
      this.charity.name,
      this.charity.details.onlineCollecterenDescription,
      null,
      this.charity.files?.logo?.file ?? null
    );
  }

}
