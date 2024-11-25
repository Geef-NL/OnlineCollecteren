import { Component, EventEmitter, OnInit } from "@angular/core";
import { EventService } from "../../providers/event.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../providers/auth.service";
import { first } from "rxjs/operators";

@Component({
  selector: 'app-confirm-registration',
  template: '',
  // styleUrls: ['']
})
export class ConfirmRegistrationComponent implements OnInit
{

  constructor(
    private authService: AuthService,
    private events: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params: any) => {

        this.events.toggleLoadingSpinner$.emit(true);
        this.authService.confirmationTokenLogin(params.confirmation_token).then(() => {
            this.events.showFlashMessage.emit({
                message: 'GLOBAL.ACTIVATION_SUCCESFUL',
            });
            this.events.toggleLoadingSpinner$.emit(false);
            this.router.navigate(['/']);
        }).catch(err => {

            const onConfirm = new EventEmitter<boolean>();
            onConfirm.pipe(first()).subscribe(() => {
                // this.metaService.clearPath();
              this.router.navigate(['/']);
            });

            this.events.showAlertDialog.emit({
                title: 'AUTH.REGISTER_INVALID_TOKEN',
                message: 'AUTH.REGISTER_INVALID_TOKEN_TXT',
                onConfirm: onConfirm,
                translate: true
            });
            this.events.toggleLoadingSpinner$.emit(false);
        });

    });

  }

}
