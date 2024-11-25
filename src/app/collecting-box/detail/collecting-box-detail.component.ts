import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../../../providers/event.service';
import {MetaService} from '../../../providers/meta.service';
import {ApiService} from '../../../providers/api.service';
import {UserService} from '../../../providers/user.service';

@Component({
  selector: 'app-collecting-box-detail',
  templateUrl: './collecting-box-detail.component.html',
  styleUrls: ['./collecting-box-detail.component.scss']
})
export class CollectingBoxDetailComponent implements OnInit, AfterViewInit {

  public charity;
  public collectingBox;
  public donateUrl;
  public isEditable = false;
  public edit = false;
  public editPP = false;
  public editDescription = '';

  imageFileTemplate = {
    file: null,
    fileName: null,
    uploading: false,
    resize: null,
    type: 'image'
  };

  public profilePictureFile: {
    file?: string,
    fileName?: string,
    uploading: boolean,
    resize?: string,
    type: string
  };

  constructor(
    private route: ActivatedRoute,
    private events: EventService,
    private meta: MetaService,
    private user: UserService,
    private api: ApiService
  ) {
  }

  ngOnInit(): void {
    this.events.showSignupSteps$.next(true);
    this.charity = this.route.parent.snapshot.data.charity;
    this.collectingBox = this.route.snapshot.data.collectingBox;
    this.events.stickyButton$.next({
      type: "donate",
      collectingBoxId: this.collectingBox.id
    });
    this.donateUrl = this.meta.getDonateUrl(this.collectingBox.id);

    this.setEditable();

    this.events.userLogin.subscribe(() => this.setEditable());
    this.events.userLogout.subscribe(() => this.setEditable());
  }

  ngAfterViewInit(): void {
    this.meta.setMetaTags(
      `Collecte van ${this.collectingBox.user.fullName} • ${this.charity.name}`,
      `Ik collecteer omdat ${this.collectingBox.description}`,
      null,
      this.collectingBox.user.profilePicture || this.collectingBox.photo
    );
  }


  private setEditable() {
    this.isEditable = this.user.user && (this.user.user.id === this.collectingBox.user.id);

    if (this.isEditable) {
      this.profilePictureFile = Object.assign({}, this.imageFileTemplate);
      // if (this.authService.user.profilePicture) {
      //   this.profilePictureFile = {
      //     file: this.authService.user.profilePicture,
      //     fileName: this.authService.user.profilePicture,
      //     uploading: false,
      //     resize: 'medium',
      //     type: 'image'
      //   };
      // } else {
      //   this.profilePictureFile = Object.assign({}, this.imageFileTemplate);
      // }
    }
  }

  openDonationModule() {
    this.events.showDonationModuleSidebar.emit(this.collectingBox.id);
  }

  toggleEditMode(edit) {
    if (!this.isEditable) {
      return;
    }

    if (edit) {
      this.editDescription = this.collectingBox.description;
    }

    this.edit = edit;
  }


  saveEdit() {
    this.events.toggleLoadingSpinner$.emit(true);
    this.api.updateResource(this.collectingBox, {description: this.editDescription}).then(() => {
      this.events.toggleLoadingSpinner$.emit(false);
      this.events.showFlashMessage.emit({
        message: 'COLLECTING_BOX.SAVE_SUCCESSFUL'
      });
      this.collectingBox.description = this.editDescription;
      this.edit = false;
    }, () => {
      this.events.showAlertDialog.emit({
        title: 'GLOBAL.OOPS',
        message: 'GLOBAL.SOMETHING_WENT_WRONG',
        translate: true
      });
    });
  }

  uploadProfilePicture(file: File) {
    this.profilePictureFile.uploading = true;

    this.api.uploadFile(file, 'image').then((result: any) => {

      const user = Object.assign({}, this.user.user);
      const newProfilePicture = Object.assign({}, this.profilePictureFile);
      newProfilePicture.file = result.url;
      newProfilePicture.fileName = result.file;

      user.profilePictureFile = newProfilePicture;

      this.saveUser(user).then((res: any) => {
        this.collectingBox.user.profilePicture = res.profilePicture;
        this.user.user.profilePicture = res.profilePicture;
        this.profilePictureFile.uploading = false;
        this.editPP = false;
      });

    }, err => {
      this.editPP = false;
      console.error(err);
      this.events.showAlertDialog.emit({
        title: 'GLOBAL.OOPS',
        message: 'GLOBAL.UPLOAD_FAILED',
        translate: true
      });

      this.clearProfilePicture();
    });
  }

  clearProfilePicture() {
    this.profilePictureFile = Object.assign({}, this.imageFileTemplate);
  }

  saveUser(user) {
    if (!this.isEditable) {
      return;
    }

    return this.api.updateResource(user);
  }

  toggleEditPPMode(edit) {
    if (!this.isEditable) {
      return;
    }

    this.editPP = edit;
  }

}
