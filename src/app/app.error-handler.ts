import { ErrorHandler, Injectable, Injector } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AppErrorHandler implements ErrorHandler {

    // Error handling is important and needs to be loaded first.
    // Because of this we should manually inject the services with Injector.
  constructor(private injector: Injector) {

  }

  handleError(error): void
  {
    console.error(error);
  }

}
