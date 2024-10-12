export class LightboxUiConfig {
  /* control the appear of the reloader
  // false: image has loaded completely and ready to be shown
  // true: image is still loading */
  public showReloader: boolean = true;

  // control the appear of the nav arrow
  // the arrowNav is the parent of both left and right arrow
  // in some cases, the parent shows but the child does not show
  public showLeftArrow: boolean = false;
  public showRightArrow: boolean = false;
  public showArrowNav: boolean = false;

  // control the appear of the zoom and rotate buttons
  public showZoomButton: boolean = false;
  public showRotateButton: boolean = false;

  // control whether to show the
  // page number or not
  public showPageNumber: boolean = false;
  public showCaption: boolean = false;

  /* control whether to show the download button or not */
  public showDownloadButton: boolean = false;

  /* control whether to show the download button or not */
  public showDownloadExtButton: boolean = false;

  public classList: string = "lightbox animation fadeIn";
}
