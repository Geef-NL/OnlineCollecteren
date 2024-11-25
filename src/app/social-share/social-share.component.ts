import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss']
})
export class SocialShareComponent implements OnInit {

  @Input() name: string;
  @Input() url: string;

  shareUrl: string;
  shareText: string;
  shareTextKey: string;

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    const ref = '?ref=onlinecollecteren-sharebutton';

    this.shareUrl = this.url ? this.url + ref : window.location.href + ref;
    this.shareTextKey = 'GLOBAL.SHARE_TEXT';
    this.shareText = this.name ? this.translate.instant(this.shareTextKey, {name: this.name}) + ' ' : null;
  }

}
