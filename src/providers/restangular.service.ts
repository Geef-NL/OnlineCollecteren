export function RestangularConfigFactory(RestangularProvider, AuthService, ErrorService, AppConfig) {

  RestangularProvider.setBaseUrl(AppConfig.get('apiBaseUrl'));
  RestangularProvider.setPlainByDefault(true);

  AuthService.initialLoad();

  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
    return {
      headers: Object.assign({}, headers, {Authorization: `Bearer ${AuthService.accessToken}`})
    };
  });

  RestangularProvider.addResponseInterceptor((data, operation) => {
    let extractedData;
    // .. to look for getList operations
    if (operation === 'getList' && data['hydra:member']) {
      // .. and handle the data and meta data
      extractedData = data['hydra:member'];
      extractedData.totalItems = data['hydra:totalItems'];
      extractedData.views = data['hydra:view'];
      extractedData.meta = {};
    } else {
      extractedData = data;
    }

    return extractedData;
  });

  RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
    switch (response.status) {
      case 401:
        AuthService.renewToken().then(() => {
          const newHeaders = response.request.headers.set('Authorization', `Bearer ${AuthService.accessToken}`);
          const newRequest = response.request.clone({headers: newHeaders});
          response.repeatRequest(newRequest).subscribe(
            res => {
              responseHandler(res);
            },
            (err) => {
              subject.error(err);
            }
          );
        }, (err) => {
          subject.error(err);
        });

        return false;
      case 403:
      // You could redirect to forbidden page here
      // return errorService.setError(403);
      case 404:
      // return errorService.setError(404);
      case 500:
      // return errorService.setError(500);
      default:
      // return errorService.setError(response.status);
    }

    return true;
  });
}

export function RestangularBoltFactory(Restangular, ErrorService, AppConfig) {
  return Restangular.withConfig((RestangularConfigurer) => {
    RestangularConfigurer.setBaseUrl(AppConfig.get('boltBaseUrl'));
    RestangularConfigurer.setDefaultHeaders();
  });
}
