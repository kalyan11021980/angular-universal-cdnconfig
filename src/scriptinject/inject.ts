import {
  Injectable,
  RendererFactory2,
  ViewEncapsulation,
  Injector
} from '@angular/core';
import { PlatformState } from '@angular/platform-server';
import { CONFIG } from './interface';
const VERSION = process.env.npm_package_version;

@Injectable()
export class InjectorService {
  constructor(
    private state: PlatformState,
    private injector: Injector,
    private renderfactory: RendererFactory2
  ) {}

  inject() {
    try {
      const document: any = this.state.getDocument();
      const renderer = this.renderfactory.createRenderer(document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const body = document.body;
      const head = document.head;
      if (!body) {
        throw new Error('Please have <body>');
      }
      const config = this.injector.get<CONFIG>(<any>'CONFIG');
      const env = config.BB_ENV === 'DEV' ? '' : `${config.BB_CDN_URL}/${VERSION}/`;

      // for runtimejs
      const runtimejs = `${env}runtime.js`;
      const runtimescript = renderer.createElement('script');
      renderer.setAttribute(runtimescript, 'type', 'text/javascript');
      renderer.setAttribute(runtimescript, 'src', runtimejs);
      renderer.appendChild(body, runtimescript);

      // For polyfill
      const polyfills = `${env}polyfills.js`;
      const polyfillsscript = renderer.createElement('script');
      renderer.setAttribute(polyfillsscript, 'type', 'text/javascript');
      renderer.setAttribute(polyfillsscript, 'src', polyfills);
      renderer.appendChild(body, polyfillsscript);

      // For mainjs
      const mainjs = `${env}main.js`;
      const mainscript = renderer.createElement('script');
      renderer.setAttribute(mainscript, 'type', 'text/javascript');
      renderer.setAttribute(mainscript, 'src', mainjs);
      renderer.appendChild(body, mainscript);

      // for css
      const stylescss = `${env}styles.css`;
      const csslink = renderer.createElement('link');
      renderer.setAttribute(csslink, 'rel', 'stylesheet');
      renderer.setAttribute(csslink, 'href', stylescss);
      renderer.appendChild(head, csslink);


    } catch (error) {
      console.log(error);
    }
  }
}
