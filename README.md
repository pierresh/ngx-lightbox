# Ngx-Lightbox

A [lightbox2](https://github.com/lokesh/lightbox2) implementation port to use with new Angular without the need for jQuery


## [Demo](https://themyth92.com/project/ngx-lightbox)

## Compatibility

The major version of this package follows the Angular major version.

| @pierresh/ngx-lightbox | Angular |
| ---------------------- | ------- |
| 22.x                   | 22.x    |

## Installation

`npm install --save @pierresh/ngx-lightbox`

Update your `angular.json`

```
{
  "styles": [
    "./node_modules/@pierresh/ngx-lightbox/lightbox.css",
    ...
  ],
}
```

## Usage

### Setup

`LightboxModule` registers the lightbox providers.

With a standalone application (default since Angular 19), add it to the providers of `bootstrapApplication`:

```typescript
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { LightboxModule } from '@pierresh/ngx-lightbox';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(LightboxModule)]
});
```

With an `NgModule` based application, import it in your module:

```typescript
import { LightboxModule } from '@pierresh/ngx-lightbox';

@NgModule({
  imports: [ LightboxModule ]
})
```

### Component

1. Markup

```html
@for (image of _albums; track image.src; let i = $index) {
  <img [src]="image.thumb" (click)="open(i)" />
}
```

2. Component method

```typescript
import { inject } from '@angular/core';
import { IAlbum, Lightbox } from '@pierresh/ngx-lightbox';

export class AppComponent {
  private _lightbox = inject(Lightbox);
  _albums: IAlbum[] = [];

  constructor() {
    for (let i = 1; i <= 4; i++) {
      const src = 'demo/img/image' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';
      const thumb = 'demo/img/image' + i + '-thumb.jpg';
      this._albums.push({ src, caption, thumb });
    }
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._albums, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }
}
```

Each `object` of `album` array inside your component may contains 3 properties :

| Properties | Requirement | Description                                                                                                        |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| src        | Required    | The source image to your thumbnail that you want to with use lightbox when user click on `thumbnail` image         |
| caption    | Optional    | Your caption corresponding with your image                                                                         |
| thumb      | Optional    | Source of your thumbnail. It is being used inside your component markup so this properties depends on your naming. |

3. Listen to lightbox event

You can listen to 3 events, which are either **CHANGE_PAGE**, **CLOSE** or **OPEN**.

```typescript
import { inject } from '@angular/core';
import { LightboxEvent, LIGHTBOX_EVENT } from '@pierresh/ngx-lightbox';
import { Subscription } from 'rxjs';

export class AppComponent {
  private _lightboxEvent = inject(LightboxEvent);
  private _subscription: Subscription;

  open(index: number): void {
    // register your subscription and callback whe open lightbox is fired
    this._subscription = this._lightboxEvent.lightboxEvent$
      .subscribe(event => this._onReceivedEvent(event));
  }

  private _onReceivedEvent(event: any): void {
    // remember to unsubscribe the event when lightbox is closed
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      // event CLOSED is fired
      this._subscription.unsubscribe();
    }

    if (event.id === LIGHTBOX_EVENT.OPEN) {
      // event OPEN is fired
    }

    if (event.id === LIGHTBOX_EVENT.CHANGE_PAGE) {
      // event change page is fired
      console.log(event.data); // -> image index that lightbox is switched to
    }
  }
}
```

## Lightbox options

Available options based on lightbox2 options

| Properties                  | Default          | Description                                                                                                                                                                                                                                 |
| --------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fadeDuration                | **0.7** seconds  | _duration_ starting when the **src** image is **loaded** to **fully appear** onto screen.                                                                                                                                                   |
| resizeDuration              | **0.5** seconds  | _duration_ starting when Lightbox container **change** its dimension from a _default/previous image_ to the _current image_ when the _current image_ is **loaded**.                                                                         |
| fitImageInViewPort          | **true**         | Determine whether lightbox will use the natural image _width/height_ or change the image _width/height_ to fit the view of current window. Change this option to **true** to prevent problem when image too big compare to browser windows. |
| positionFromTop             | **20** px        | The position of lightbox from the top of window browser                                                                                                                                                                                     |
| showImageNumberLabel        | **false**        | Determine whether to show the image number to user. The default text shown is `Image IMAGE_NUMBER of ALBUM_LENGTH`                                                                                                                          |
| alwaysShowNavOnTouchDevices | **false**        | Determine whether to show `left/right` arrow to user on Touch devices.                                                                                                                                                                      |
| wrapAround                  | **false**        | Determine whether to move to the start of the album when user reaches the end of album and vice versa. Set it to **true** to enable this feature.                                                                                           |
| disableKeyboardNav          | **false**        | Determine whether to disable navigation using keyboard event.                                                                                                                                                                               |
| disableScrolling            | **false**        | If **true**, prevent the page from scrolling while Lightbox is open. This works by settings overflow hidden on the body.                                                                                                                    |
| centerVertically            | **false**        | If **true**, images will be centered vertically to the screen.                                                                                                                                                                              |
| albumLabel                  | "Image %1 of %2" | The text displayed below the caption when viewing an image set. The default text shows the current image number and the total number of images in the set.                                                                                  |
| enableTransition            | **true**         | Transition animation between images will be disabled if this flag set to **false**                                                                                                                                                          |
| showZoom            | **false**         | Zoom Buttons will be shown if this flag set to **true**                                                                                                                                                          |
| showRotate            | **false**         | Rotate Buttons will be shown if this flag set to **true**                                                                                                                                                                                                    |
| showDownloadButton  | **false**         | Download button will be shown if this flag set to **true**    |
| showDownloadExtButton  | **false**         | Download button will be shown if this flag set to **true** and the download should be handled when the event LIGHTBOX_EVENT.DOWNLOAD is received    |
| containerElementResolver | () => document.body | Resolves the element that will contain the lightbox | 


**NOTE**: You can either override default config or during a specific opening window

1. Override default config

```typescript
import { inject } from '@angular/core';
import { LightboxConfig } from '@pierresh/ngx-lightbox';

export class AppComponent {
  private _lightboxConfig = inject(LightboxConfig);

  constructor() {
    // override default config
    this._lightboxConfig.fadeDuration = 1;
  }
}
```

2. Set config in a specific opening window

```typescript
import { inject } from '@angular/core';
import { Lightbox } from '@pierresh/ngx-lightbox';

export class AppComponent {
  private _lightbox = inject(Lightbox);

  open(index: number): void {
    // override the default config on second parameter
    this._lightbox.open(this._albums, index, { wrapAround: true, showImageNumberLabel: true });
  }
}
```

### Overriding lightbox parent elements

If you want to use any other parent element than your `<body>`, please override the `containerElementResolver` property of your `LightboxConfig`.
This can be used, e.g. if you are opening the lightbox from within a Shadow DOM based web component.

```typescript
export class MyLightBoxTrigger {
  private _lightbox = inject(Lightbox);
  private _lightboxConfig = inject(LightboxConfig);

  constructor() {
    this._lightboxConfig.containerElementResolver = (doc: Document) => doc.getElementById('my-lightbox-host');
  }

  open(index: number): void {
    this._lightbox.open(this.images, index); // will put the lightbox child into e.g. <div id="my-lightbox-host"></div>
  }
}
```

## Server-side rendering (SSR)

This project works with SSR out of the box with no additional configuration.

## License

MIT


