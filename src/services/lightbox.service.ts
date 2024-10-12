import { DOCUMENT } from "@angular/common";
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, inject, Injectable, Injector } from "@angular/core";

import { LightboxComponent } from "../components/lightbox/lightbox.component";
import { LightboxOverlayComponent } from "../components/lightbox-overlay/lightbox-overlay.component";
import { LightboxConfig } from "./lightbox-config.service";
import { IAlbum, LIGHTBOX_EVENT, LightboxEvent } from "./lightbox-event.service";

@Injectable()
export class Lightbox {
  private _applicationRef = inject(ApplicationRef);
  private _lightboxConfig = inject(LightboxConfig);
  private _lightboxEvent = inject(LightboxEvent);
  private _documentRef: Document = inject(DOCUMENT);

  // private viewContainerRef = inject(ViewContainerRef);
  private _componentFactoryResolver = inject(ComponentFactoryResolver);
  private _injector = inject(Injector);

  constructor() {}

  public open(album: IAlbum[], curIndex = 0, options = {}): void {
    // const overlayComponentRef = this.viewContainerRef.createComponent(LightboxOverlayComponent);
    // const componentRef = this.viewContainerRef.createComponent(LightboxComponent);

    // TODO: replace old way with new way (viewContainerRef)
    const overlayComponentRef = this._createComponent(LightboxOverlayComponent);
    const componentRef = this._createComponent(LightboxComponent);

    const newOptions: Partial<LightboxConfig> = {};

    // broadcast open event
    this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.OPEN });
    Object.assign(newOptions, this._lightboxConfig, options);

    // attach input to lightbox
    componentRef.instance.albums.set(album);
    componentRef.instance.currentImageIndex.set(curIndex);
    componentRef.instance.options.set(newOptions);
    componentRef.instance.cmpRef.set(componentRef);

    // attach input to overlay
    overlayComponentRef.instance.options.set(newOptions);
    overlayComponentRef.instance.cmpRef.set(overlayComponentRef);

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

  private _createComponent<T>(ComponentClass: new (...args: any[]) => T): ComponentRef<T> {
    const factory = this._componentFactoryResolver.resolveComponentFactory(ComponentClass);
    const component = factory.create(this._injector);

    return component;
  }
}
