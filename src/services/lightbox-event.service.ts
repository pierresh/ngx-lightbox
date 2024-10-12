import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export interface IEvent {
  id: LIGHTBOX_EVENT;
  data?: any;
}

export interface IAlbum {
  src: string;
  caption?: string;
  thumb: string;
  downloadUrl?: string;
}

export enum LIGHTBOX_EVENT {
  CHANGE_PAGE = 1,
  CLOSE = 2,
  OPEN = 3,
  ZOOM_IN = 4,
  ZOOM_OUT = 5,
  ROTATE_LEFT = 6,
  ROTATE_RIGHT = 7,
  DOWNLOAD = 8,
}

@Injectable()
export class LightboxEvent {
  private _lightboxEventSource: Subject<IEvent>;
  public lightboxEvent$: Observable<IEvent>;

  constructor() {
    this._lightboxEventSource = new Subject<IEvent>();
    this.lightboxEvent$ = this._lightboxEventSource.asObservable();
  }

  public broadcastLightboxEvent(event: IEvent): void {
    this._lightboxEventSource.next(event);
  }
}

function getWindow(): Window & typeof globalThis {
  return window;
}

@Injectable()
export class LightboxWindowRef {
  public get nativeWindow(): Window & typeof globalThis {
    return getWindow();
  }
}
