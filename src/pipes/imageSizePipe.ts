import {PipeTransform, Injectable, Pipe} from '@angular/core';

@Pipe({
  name: 'imageSize'
})
@Injectable()
export class ImageSizePipe implements PipeTransform {
  constructor() {
  }

  public transform(input: any, type: any): string {

    if (input === null) {
      return null;
    }
    if (type === null || type === '' || typeof type === 'undefined') {
      return input;
    }

    let searchPath;
    if (input.indexOf('/medium/') > -1) {
      searchPath = '/medium/';
    }
    if (input.indexOf('/original/') > -1) {
      searchPath = '/original/';
    }
    if (input.indexOf('/avatar/') > -1) {
      searchPath = '/avatar/';
    }
    if (input.indexOf('/thumb/') > -1) {
      searchPath = '/thumb/';
    }

    let replacePath = '/' + type + '/';
    if (replacePath == searchPath) {
      return input;
    }

    return input.replace(searchPath, replacePath);


  }
}
