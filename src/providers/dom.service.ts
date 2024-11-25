import {Injectable, RendererFactory2, ViewEncapsulation, Inject, EventEmitter, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class DomService {

  @Output() scriptLoaded: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document
  ) {
  }

  addScript(src: string, identifier: string = null, type: string = 'text/javascript') {
    try {
      const renderer = this.rendererFactory.createRenderer(this.document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const scriptElem = renderer.createElement('script');
      const head = this.document.head;

      if (head === null) {
        throw new Error('<head> not found within DOCUMENT.');
      }

      renderer.setAttribute(scriptElem, 'src', src);
      renderer.setAttribute(scriptElem, 'type', type);

      if (identifier) {
        renderer.listen(scriptElem, 'load', () => {
          this.scriptLoaded.emit(identifier);
        });
      }

      renderer.appendChild(head, scriptElem);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Inject the State into the bottom of the <head>
   */
  addTag(tag: LinkDefinition, forceCreation?: boolean) {
    try {
      const renderer = this.rendererFactory.createRenderer(this.document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const link = renderer.createElement('link');
      const head = this.document.head;
      const canonical = document.querySelector('link[rel=\'canonical\']');

      if (head === null) {
        throw new Error('<head> not found within DOCUMENT.');
      }

      if (canonical) {
        renderer.removeChild(head, canonical);
      }

      Object.keys(tag).forEach((prop: string) => {
        return renderer.setAttribute(link, prop, tag[prop]);
      });

      renderer.appendChild(head, link);

    } catch (e) {
      console.error(e);
    }
  }
}

export declare type LinkDefinition = {
  charset?: string;
  crossorigin?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  rev?: string;
  sizes?: string;
  target?: string;
  type?: string;
} & {
  [prop: string]: string;
};
