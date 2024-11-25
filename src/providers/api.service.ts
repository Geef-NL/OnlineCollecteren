import {Injectable} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {AuthService} from './auth.service';
import {CookieServiceOwn} from './cookie.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(
    public http: HttpClient,
    private restangular: Restangular,
    private authService: AuthService,
    private cookieService: CookieServiceOwn
  ) {
  }

  subscription: any;

  private static convertResourceToPostData(resource) {
    const postData = Object.assign({}, resource);

    for (const key in postData) {
      if (postData.hasOwnProperty(key)) {
        const value = postData[key];

        if (value !== null && typeof value === 'object' && value['@id']) {
          postData[key] = value['@id'];
        } else if (value !== null && value instanceof Array) {
          postData[key] = ApiService.convertResourceToPostData(value);
        }
      }
    }

    return postData;
  }

  getCollection(type, filters: any = {}) {
    return new Promise((resolve, reject) => {
      this.authService.afterTokenLoad().then(() => {
        this.subscription = this.restangular.all(type).getList(filters).subscribe(
          res => {
            resolve(res);
          },
          err => {
            console.error(err);
            reject(err);
          });
      });
    });
  }

  getResource(typeOrResourceUrl, idOrSlug?) {
    return new Promise((resolve, reject) => {
      this.authService.afterTokenLoad().then(() => {
        let endPoint = typeOrResourceUrl;

        if (idOrSlug) {
          endPoint += '/' + idOrSlug;
        }

        this.restangular.one(endPoint).get().subscribe(
          res => {
            resolve(res);
          },
          err => {
            console.error(err);
            reject(err);
          });
      });
    });
  }

  createResource(type, resource) {
    const postData = ApiService.convertResourceToPostData(resource);

    postData.referer = this.cookieService.getCookie('geefRef', false);

    return new Promise((resolve, reject) => {
      this.restangular.all('').customPOST(postData, type, {}).subscribe(result => {
        resolve(result);
      }, err => {
        console.error(err);
        reject(err);
      });
    });
  }

  deleteResource(resourceOrUri) {
    let resourceUri;

    if (typeof resourceOrUri !== 'string') {
      resourceUri = resourceOrUri['@id'].substring(1);
    } else {
      resourceUri = resourceOrUri;

      if (resourceUri.substring(0, 1) === '/') {
        resourceUri = resourceUri.substring(1);
      }
    }

    return new Promise((resolve, reject) => {
      this.restangular.all('').customDELETE(resourceUri).subscribe(result => {
        resolve(result);
      }, err => {
        reject(err);
      }, done => {
        resolve(done);
      });
    });
  }

  updateResource(resource, postData = null) {
    const resourceUri = resource['@id'].substring(1);

    if (postData == null) {
      postData = ApiService.convertResourceToPostData(resource);
    }

    return new Promise((resolve, reject) => {
      this.restangular.all('').customPUT(postData, resourceUri, {}).subscribe(result => {
        resolve(result);
      }, err => {
        console.error(err);
        reject(err);
      });
    });
  }

  uploadResourceFile(resourceUri: string, file: File, resourceProperty: string = 'photo', fileType: string = 'image') {
    if (resourceUri.substring(0, 1) === '/') {
      resourceUri = resourceUri.substring(1);
    }

    const endpoint = resourceUri + '/' + resourceProperty;

    return this.uploadFile(file, fileType, endpoint);
  }

  uploadFile(file: File, type = null, endPoint = 'media/upload-file') {
    const formData = new FormData();
    formData.append('file', file);

    const params: any = {};
    if (type !== null) {
      params.type = type;
    }

    return new Promise((resolve, reject) => {
      this.restangular.all('').customPOST(formData, endPoint, params).subscribe(result => {
        resolve(result);
      }, err => {
        reject(err);
      });
    });
  }

  customPOST(resourceUri: string, postData: any = {}, queryParams: any = {}) {
    if (resourceUri.substring(0, 1) === '/') {
      resourceUri = resourceUri.substring(1);
    }
    return new Promise((resolve, reject) => {
      this.restangular.all('').customPOST(postData, resourceUri, queryParams).subscribe(result => {
        resolve(result);
      }, err => {
        reject(err);
      });
    });
  }

  customGET(resourceUri: string, queryParams: any = {}) {
    if (resourceUri.substring(0, 1) === '/') {
      resourceUri = resourceUri.substring(1);
    }

    return new Promise((resolve, reject) => {
      this.restangular.all('').customGET(resourceUri, queryParams).subscribe(result => {
        resolve(result);
      }, err => {
        reject(err);
      });
    });
  }
}
