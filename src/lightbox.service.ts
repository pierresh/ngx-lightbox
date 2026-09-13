import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable, Injector, DOCUMENT, inject } from '@angular/core';
import { LightboxComponent } from './lightbox.component';
import { LightboxConfig } from './lightbox-config.service';
import { LightboxEvent, LIGHTBOX_EVENT, IAlbum } from './lightbox-event.service';
import { LightboxOverlayComponent } from './lightbox-overlay.component';


@Injectable()
export class Lightbox {
  private _environmentInjector = inject(EnvironmentInjector);
  private _injector = inject(Injector);
  private _applicationRef = inject(ApplicationRef);
  private _lightboxConfig = inject(LightboxConfig);
  private _lightboxEvent = inject(LightboxEvent);
  private _documentRef = inject<Document>(DOCUMENT);


  open(album: Array<IAlbum>, curIndex = 0, options = {}): void {
    const overlayComponentRef = this._createComponent(LightboxOverlayComponent);
    const componentRef = this._createComponent(LightboxComponent);
    const newOptions: Partial<LightboxConfig> = {};

    // broadcast open event
    this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.OPEN });
    Object.assign(newOptions, this._lightboxConfig, options);

    // attach input to lightbox
    componentRef.setInput('album', album);
    componentRef.setInput('currentImageIndex', curIndex);
    componentRef.setInput('options', newOptions);
    componentRef.setInput('cmpRef', componentRef);

    // attach input to overlay
    overlayComponentRef.setInput('options', newOptions);
    overlayComponentRef.setInput('cmpRef', overlayComponentRef);

    // FIXME: not sure why last event is broadcasted (which is CLOSED) and make
    // lightbox can not be opened the second time.
    // Need to timeout so that the OPEN event is set before component is initialized
    setTimeout(() => {
      this._applicationRef.attachView(overlayComponentRef.hostView);
      this._applicationRef.attachView(componentRef.hostView);
      overlayComponentRef.onDestroy(() => {
        this._applicationRef.detachView(overlayComponentRef.hostView);
      });
      componentRef.onDestroy(() => {
        this._applicationRef.detachView(componentRef.hostView);
      });

      const containerElement = newOptions.containerElementResolver!(this._documentRef);
      containerElement.appendChild(overlayComponentRef.location.nativeElement);
      containerElement.appendChild(componentRef.location.nativeElement);
    });
  }

  close(): void {
    if (this._lightboxEvent) {
      this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.CLOSE });
    }
  }

  _createComponent(ComponentClass: any): ComponentRef<any> {
    return createComponent(ComponentClass, {
      environmentInjector: this._environmentInjector,
      elementInjector: this._injector
    });
  }
}
