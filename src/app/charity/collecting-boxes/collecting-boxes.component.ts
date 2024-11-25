import { AfterViewInit, Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../providers/api.service';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';
import {EventService} from '../../../providers/event.service';
import { MetaService } from "../../../providers/meta.service";

@Component({
  selector: 'app-collecting-boxes',
  templateUrl: './collecting-boxes.component.html',
  styleUrls: ['./collecting-boxes.component.scss']
})
export class CharityCollectingBoxesComponent implements OnInit, AfterViewInit {

  public charity;
  public actions = [];
  public currPage = 1;
  public hasMore = false;
  public loadingActions = true;
  public totalNumActions;
  public searchQuery = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private events: EventService,
    private meta: MetaService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.events.stickyButton$.next({
      type: 'create'
    });
    this.events.showSignupSteps$.next(true);

    this.charity = this.route.parent.snapshot.data.charity;

    this.route.paramMap.pipe(
      map(params => params.get('s')),
      distinctUntilChanged()
    ).subscribe(q => {
      this.actions = [];
      this.searchQuery = q;
      this.loadActions(1);
    });
  }

  ngAfterViewInit(): void {
    this.meta.setMetaTags(
      `Collectebussen  • ${this.charity.name}`,
      null,
      null,
      this.charity.files.logo.file ?? null
    );
  }

  async loadMore() {
    if (this.loadingActions) {
      return;
    }
    this.currPage++;
    await this.loadActions(this.currPage);
  }

  async loadActions(page = 1): Promise<void> {
    this.loadingActions = true;

    const filters = {
      charity: this.charity.id,
      category: 'collecting-box',
      order: 'statistics.donationsCountLastWeek',
      active: true,
      items_per_page: 24,
      page
    } as any;

    if (this.searchQuery) {
      filters.name = this.searchQuery;
    }

    const actions = await this.api.getCollection('actions', filters) as any;

    this.totalNumActions = actions.totalItems;

    this.actions = [...this.actions, ...actions];

    this.hasMore = this.totalNumActions > this.actions.length;

    this.loadingActions = false;
  }

}
