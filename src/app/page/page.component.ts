import {Component, OnInit} from '@angular/core';
import {BoltService} from '../../providers/bolt.service';
import {ActivatedRoute} from '@angular/router';
import {MetaService} from '../../providers/meta.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  public page;

  constructor(
    private bolt: BoltService,
    private route: ActivatedRoute,
    private meta: MetaService
  ) {
  }

  ngOnInit(): void {
    this.page = this.route.snapshot.data.page;

    this.meta.setMetaTags(
      (this.page.seo_title !== '' ? this.page.seo_title : this.page.title),
      this.page.seo_meta_description
    );
  }

}
