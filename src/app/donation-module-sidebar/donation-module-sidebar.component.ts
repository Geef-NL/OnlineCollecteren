import { Component, HostBinding, OnInit } from '@angular/core';
import { EventService } from "../../providers/event.service";
import { AppConfig } from "../app.config";
import { tap } from "rxjs/operators";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MetaService } from "../../providers/meta.service";

@Component({
  selector: 'app-donation-module-sidebar',
  templateUrl: './donation-module-sidebar.component.html',
  styleUrls: ['./donation-module-sidebar.component.scss']
})
export class DonationModuleSidebarComponent implements OnInit {

  @HostBinding('class.show') private show = false;
  @HostBinding('class.loading') private loading = false;

  public donateUrl: SafeResourceUrl = null;

  constructor(
    private events: EventService,
    private metaService: MetaService,
    private appConfig: AppConfig,
    private sanitizer: DomSanitizer
  ) {
    this.donateUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  }

  ngOnInit(): void {
    this.events.showDonationModuleSidebar.pipe(
      tap(() => { this.loading = true })
    ).subscribe((actionId) => {
      this.donateUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.metaService.getDonateUrl(actionId) as string
      );
      console.log(this.donateUrl);

      this.show = true;
    });
    this.events.hideDonationModuleSidebar.subscribe(() => {
      this.show = false;
    });

  }

  public iframeLoaded(ev)
  {
    this.loading = false;
  }

  public hide()
  {
    this.events.hideDonationModuleSidebar.emit();
  }


}
