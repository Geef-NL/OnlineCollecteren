import {Injectable} from '@angular/core';

import {Location} from '@angular/common';
import {Meta, Title} from "@angular/platform-browser";
import {AppConfig} from "../app/app.config";
import {ImageSizePipe} from "../pipes/imageSizePipe";
// import {RouteTranslationService} from "./route-service";
import { DomService } from "./dom.service";
import { isNumeric } from "rxjs/internal-compatibility";

declare var jQuery: any;

@Injectable()
export class MetaService {


    prerenderStatusCodeTag: HTMLMetaElement;
    prerenderHeaderTag: HTMLMetaElement;
    descriptionTag: HTMLMetaElement;
    keywordsTag: HTMLMetaElement;
    ogDescriptionTag: HTMLMetaElement;
    ogTitleTag: HTMLMetaElement;
    ogImageTag: HTMLMetaElement;
    ogUrlTag: HTMLMetaElement;

    constructor(private location: Location,
                private meta: Meta,
                private title: Title,
                private domService: DomService,
                private appConfig: AppConfig,
                private imageSize: ImageSizePipe,
                // private routeTrans: RouteTranslationService
    ) {

    }

    public setMetaTags(title = null, description = null, keywords = null, imageUrl = null, resourcePath = null, resourceSlug = null, setRenderReady = true) {

        if(resourcePath && resourceSlug){
            this.forceSlugUrl(resourcePath, resourceSlug);
        }

        let location = (window as any).location.href;
        this.ogUrlTag = this.meta.updateTag({property: 'og:url', content:  location });
        this.domService.addTag({rel: 'canonical', href: location });

        if(title) {
            this.title.setTitle(title+ ' • Onlinecollecteren.nl');
            this.ogTitleTag = this.meta.updateTag({ property: 'og:title', content: title+' • Onlinecollecteren.nl' });
        }

        if(description) {
            let descriptionParsed = this.shortenDescriptionByPeriod(description);
            this.descriptionTag = this.meta.updateTag({ name: 'description', content: descriptionParsed });
            this.ogDescriptionTag = this.meta.updateTag({property: 'og:description', content: descriptionParsed });
        }

        if(keywords){
            let keywordsStr: string = '';
            if(typeof keywords == 'object') {
                keywordsStr = keywords.join(',');
            }
            else keywordsStr = keywords;
            this.keywordsTag = this.meta.updateTag({ name: 'keywords', content: keywordsStr });
        }

        if(imageUrl){
            imageUrl = this.imageSize.transform(imageUrl,'original');
            this.ogImageTag = this.meta.updateTag({property: 'og:image', content: imageUrl });
        }

        if(setRenderReady){
            this.setRenderReady();
        }

    }

    public setRenderReady(timeout = 500){
        window.setTimeout(function() {
            (window as any).renderReady = true;
        },timeout);
    }

    public resetMetaTags(){
        (window as any).renderReady = false;
        this.title.setTitle('Onlinecollecteren.nl');
        this.meta.removeTagElement(this.descriptionTag);
        this.meta.removeTagElement(this.keywordsTag);
        this.meta.removeTagElement(this.ogDescriptionTag);
        this.meta.removeTagElement(this.ogTitleTag);
        this.meta.removeTagElement(this.ogImageTag);
        this.meta.removeTagElement(this.ogUrlTag);
        this.meta.removeTagElement(this.prerenderStatusCodeTag);
        this.meta.removeTagElement(this.prerenderHeaderTag);
    }

    private shortenDescriptionByPeriod(input: string, maxLength=160) {

        let output: string;

        //Strip html tags;
        output = input.replace(/<(?:.|\n)*?>/gm, '');

        //Strip newlines
        output = output.replace(/(\r\n|\n|\r)/gm," ");

        let resultArray: any = output.split(".");
        if (resultArray.length >= 1) {
            resultArray = resultArray.slice(0, 1);
            output = resultArray.join(" ");
        }
        output = output.replace(new RegExp('·', 'g'), '.');

        output = output.trim();
        //max 160 chars
        if(output.length > maxLength) {
            output = output.substring(0,(maxLength-1)) + '…';
        }
        else {
            if(output.substring(-1)!=='.') output = output + '.';
        }
        return output;

    }

    private forceSlugUrl(id: string, slug: string) {

        let currPath = this.location.path();

        if (isNumeric(id)) {
            let newPath = currPath.replace(id, slug);
            //set correct URL in address bar
            this.location.replaceState(newPath);

            //let newLocation = (window as any).location.href;

            //set prerender 301 location
            //this.prerenderStatusCodeTag = this.meta.addTag({name: 'prerender-status-code', content: '301'});
            //this.prerenderHeaderTag = this.meta.addTag({name: 'prerender-header', content: 'Location: ' + newLocation});
        }

    }

    public replacePath(find, replace){
        const currPath = this.location.path();
        const newPath = currPath.replace(find, replace);
        this.location.replaceState(newPath);
    }

    public appendPath(append){
        const currPath = this.location.path();
        const newPath = currPath +'/'+append;
        this.location.replaceState(newPath);
    }

    public clearPath(){
        this.location.replaceState('');
    }


    public getDonateUrl(actionId): string
    {

      const backLink = (window as any).location.href;

      const queryParams = [];
      queryParams.push({name: 'action', value: actionId});
      queryParams.push({name: 'backLink', value: backLink});
      queryParams.push({name: 'type', value: 'e'});
      const queryString = jQuery.param(queryParams);
      const donatePath = '/nl/doneer';

      return this.appConfig.get('siteBaseUrl') + donatePath + '?' + queryString;
    }

    public getCollectingBoxUrl(slug): string
    {
      return encodeURI(`${window.location.origin}/collectebussen/${slug}`);
    }

    redirectToAuth() {
      window.location.href = '//auth.' + location.hostname.split('.').slice(1).join('.');
    }

    public urlEncode(str, double = false) {
        // URL-encodes string
        //
        // version: 1107.2516
        // discuss at: http://phpjs.org/functions/urlencode
        // +   original by: Philip Peterson
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: AJ
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: travc
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Lars Fischer
        // +      input by: Ratheous
        // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Joris
        // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
        // %          note 1: This reflects PHP 5.3/6.0+ behavior
        // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
        // %        note 2: pages served as UTF-8
        // *     example 1: urlencode('Kevin van Zonneveld!');
        // *     returns 1: 'Kevin+van+Zonneveld%21'
        // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
        // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
        // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
        // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
        str = (str + '').toString();

        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        let encoded = encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');

        if (double) return this.urlEncode(encoded, false);

        return encoded;

    }


}
