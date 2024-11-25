import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translateSocialHandle'})
export class TranslateSocialHandlePipe implements PipeTransform {

  transform(value, platform) {
    const regex = new RegExp('/(facebook.com|linkedin.com|twitter.com|youtube.com)/');
    let url;

    if (regex.test(value)) {
      return value;
    }

    switch (platform) {
      case 'facebook':
        url = 'https://www.facebook.com/' + value;
        break;
      case 'linkedin':
        url = 'https://www.linkedin.com/company/' + value;
        break;
      case 'twitter':
        url = 'https://twitter.com/' + value;
        break;
      case 'youtube':
        url = 'https://www.youtube.com/' + value;
        break;
    }

    return url;
  }

}
