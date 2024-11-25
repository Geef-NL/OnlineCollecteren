import { Component, EventEmitter, OnInit } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { EventService } from "../../providers/event.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../providers/auth.service";
import { first } from "rxjs/operators";

@Component({
  selector: 'app-password-reset',
  template: '',
  // styleUrls: ['']
})
export class PasswordResetComponent implements OnInit
{

  constructor(
    private authService: AuthService,
    private events: EventService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params: any) => {

        this.events.toggleLoadingSpinner$.emit(true);

        const confirmData = new FormData();
        confirmData.append('confirmationToken', params.confirmation_token);

        //confirm token
        this.authService.afterTokenLoad().then(() => {
          this.apiService.customPOST('user/validate-password-reset-token', confirmData).then((res: any) => {
            //ok
            this.events.toggleLoginDialog.emit({
              show: true,
              type: 'set_new_password',
              alsoShowIfLoggedIn: true,
              extraData: res.user
            });
            this.events.toggleLoadingSpinner$.emit(false);

          }).catch(err => {
            const onConfirm = new EventEmitter<boolean>();
            onConfirm.subscribe(() => {
              // this.metaService.clearPath();
              this.router.navigate(['/']);
            });
            this.events.showAlertDialog.emit({
              title: 'AUTH.SET_NEW_PASSWORD_INVALID_TOKEN',
              message:'AUTH.SET_NEW_PASSWORD_INVALID_TOKEN_TXT',
              translate: true,
              onConfirm: onConfirm
            });
            this.events.toggleLoadingSpinner$.emit(false);
          });
        });

    });

  }

}
