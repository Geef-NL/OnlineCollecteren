import {EventEmitter, Injectable, Output} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { NotFoundError } from "../app/app.errors";

@Injectable()
export class ErrorService {

  popupInfo: {};

  @Output() showPopup: EventEmitter<any> = new EventEmitter();
  @Output() sendEmail: EventEmitter<any> = new EventEmitter();
  @Output() sendPassword: EventEmitter<any> = new EventEmitter();

  constructor(
    public http: HttpClient,
    private router: Router,
  ) {
  }

  public triggerError(error)
  {
    if (error instanceof NotFoundError)
    {
      this.router.navigate(['error', { error: error }], {
        skipLocationChange: true,
        state: {
          error: error
        }
      });
    }
  }


  showErrorPopup(err) {
    switch (err) {
      case 'email_missing':
        this.popupInfo = {
          type: 'email',
          title: 'E-mailadres ontbreekt',
          message: 'Om een account aan te maken op Geef heb je een e-mailadres nodig.'
        };
        this.showPopup.emit(this.popupInfo);
        break;
      case 'need_password':
        this.popupInfo = {
          type: 'password',
          title: 'Het e-mailadres van je Facebookaccount staat al geregistreerd in ons systeem.',
          message: 'Om in het vervolg te kunnen inloggen met je Facebookaccount moet je nog eenmaal met je Geefaccount inloggen om deze te koppelen.'
        };
        this.showPopup.emit(this.popupInfo);
        break;
      case 'invalid_password':
        this.popupInfo = {
          type: 'password',
          title: 'Oops',
          message: 'Dit wachtwoord is incorrect, probeer het nogmaals.'
        };
        this.showPopup.emit(this.popupInfo);
        break;
      case 'The grant type is unauthorized for this client_id':
        localStorage.removeItem('token');
        break;
      default:
        console.error(err);
    }
  }

  setEmail(email) {
    this.sendEmail.emit(email);
  }

  setPassword(password) {
    this.sendPassword.emit(password);
  }
}
