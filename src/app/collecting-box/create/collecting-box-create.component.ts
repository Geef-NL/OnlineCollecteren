import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../providers/api.service';
import {EventService} from '../../../providers/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../../../providers/user.service';

@Component({
  selector: 'app-collecting-box-create',
  templateUrl: './collecting-box-create.component.html',
  styleUrls: ['./collecting-box-create.component.scss']
})
export class CollectingBoxCreateComponent implements OnInit {

  public charity;
  public description = '';

  constructor(
    private apiService: ApiService,
    private events: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private user: UserService
  ) {
  }

  ngOnInit(): void {
    this.charity = this.route.parent.snapshot.data.charity;
  }

  submitForm() {
    this.events.toggleLoadingSpinner$.emit(true);

    const newAction = {
      charity: '/charities/' + this.charity.id,
      description: this.description,
      isCollectingBox: true
    };

    this.apiService.createResource('actions', newAction)
      .then(res => this.saveCollectingBoxSuccessful(res))
      .catch(err => this.saveCollectingBoxFailed(err));
  }

  private saveCollectingBoxSuccessful(collectingBox) {
    this.events.toggleLoadingSpinner$.emit(false);

    if (collectingBox.active) {
      this.events.userCollectionBoxCreated.emit(collectingBox);

      this.events.showFlashMessage.emit({
        message: 'COLLECTING_BOX.PUBLISH_SUCCESSFUL'
      });
    }

    this.router.navigate(['collectebussen/' + collectingBox.slug]);
  }

  private saveCollectingBoxFailed(error) {
    console.error(error);

    this.events.toggleLoadingSpinner$.emit(false);

    this.events.showAlertDialog.emit({
      title: this.translateService.instant('GLOBAL.OOPS'),
      message: this.translateService.instant('GLOBAL.SOMETHING_WENT_WRONG')
    });
  }

}
