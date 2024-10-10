import { DOCUMENT } from "@angular/common";
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector } from "@angular/core";

import { LightboxComponent } from "./lightbox.component";
import { LightboxConfig } from "./lightbox-config.service";
import { IAlbum, LIGHTBOX_EVENT, LightboxEvent } from "./lightbox-event.service";
import { LightboxOverlayComponent } from "./lightbox-overlay.component";

@Injectable()
export class Lightbox {
  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _applicationRef: ApplicationRef,
    private _lightboxConfig: LightboxConfig,
    private _lightboxEvent: LightboxEvent,
    @Inject(DOCUMENT) private _documentRef: any
  ) {}

  public open(album: IAlbum[], curIndex = 0, options = {}): void {
    const overlayComponentRef = this._createComponent(LightboxOverlayComponent);
    const componentRef = this._createComponent(LightboxComponent);
    const newOptions: Partial<LightboxConfig> = {};

    // broadcast open event
    this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.OPEN });
    Object.assign(newOptions, this._lightboxConfig, options);

    // attach input to lightbox
    componentRef.instance.album = album;
    componentRef.instance.currentImageIndex = curIndex;
    componentRef.instance.options = newOptions;
    componentRef.instance.cmpRef = componentRef;

    // attach input to overlay
    overlayComponentRef.instance.options = newOptions;
    overlayComponentRef.instance.cmpRef = overlayComponentRef;

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

  public close(): void {
    if (this._lightboxEvent) {
      this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.CLOSE });
    }
  }

  private _createComponent(ComponentClass: any): ComponentRef<any> {
    const factory = this._componentFactoryResolver.resolveComponentFactory(ComponentClass);
    const component = factory.create(this._injector);

    return component;
  }
}
