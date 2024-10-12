import { DOCUMENT } from "@angular/common";
import { ApplicationRef, Inject, inject, Injectable, ViewContainerRef } from "@angular/core";

import { LightboxComponent } from "./lightbox.component";
import { LightboxConfig } from "./lightbox-config.service";
import { IAlbum, LIGHTBOX_EVENT, LightboxEvent } from "./lightbox-event.service";
import { LightboxOverlayComponent } from "./lightbox-overlay.component";

@Injectable()
export class Lightbox {
  private _applicationRef = inject(ApplicationRef);
  private _lightboxConfig = inject(LightboxConfig);
  private _lightboxEvent = inject(LightboxEvent);
  private viewContainerRef = inject(ViewContainerRef);

  constructor(@Inject(DOCUMENT) private _documentRef: Document) {}

  public open(album: IAlbum[], curIndex = 0, options = {}): void {
    const overlayComponentRef = this.viewContainerRef.createComponent(LightboxOverlayComponent);
    const componentRef = this.viewContainerRef.createComponent(LightboxComponent);
    const newOptions: Partial<LightboxConfig> = {};

    // broadcast open event
    this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.OPEN });
    Object.assign(newOptions, this._lightboxConfig, options);

    // attach input to lightbox
    componentRef.instance.album.set(album);
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

  public close(): void {
    if (this._lightboxEvent) {
      this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.CLOSE });
    }
  }
}
