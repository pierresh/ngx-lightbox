import { Injectable } from "@angular/core";

@Injectable()
export class LightboxConfig {
  public fadeDuration: number = 0.7;
  public resizeDuration: number = 0.5;
  public fitImageInViewPort: boolean = true;
  public positionFromTop: number = 20;
  public showImageNumberLabel: boolean = false;
  public alwaysShowNavOnTouchDevices: boolean = false;
  public wrapAround: boolean = false;
  public disableKeyboardNav: boolean = false;
  public disableScrolling: boolean = false;
  public centerVertically: boolean = false;
  public enableTransition: boolean = true;
  public albumLabel: string = "Image %1 of %2";
  public showZoom: boolean = false;
  public showRotate: boolean = false;
  public showDownloadButton: boolean = false;
  public containerElementResolver: (document: any) => HTMLElement = documentRef => documentRef.querySelector("body");
}
