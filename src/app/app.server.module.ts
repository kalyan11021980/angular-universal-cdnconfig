import { NgModule, ApplicationRef, APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { InjectorServiceModule } from './../../src/scriptinject/injector.module';
import { InjectorService } from './../../src/scriptinject/inject';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

export function onBootstrap(appRef: ApplicationRef, scriptinject: InjectorService) {
  return () => {
    appRef.isStable
      .subscribe(() => {
        scriptinject.inject();
      });
  };
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    InjectorServiceModule,
    ModuleMapLoaderModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      multi: true,
      deps: [
        ApplicationRef,
        InjectorService
      ]
    }
  ]
})
export class AppServerModule {}
