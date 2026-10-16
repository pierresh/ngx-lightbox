import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { LightboxEvent, LIGHTBOX_EVENT } from './lightbox-event.service';
import { LightboxOverlayComponent } from './lightbox-overlay.component';

describe('[ Unit - LightboxOverlayComponent ]', () => {
  let fixture: ComponentFixture<LightboxOverlayComponent>;
  let lightboxEvent: LightboxEvent;
  let mockData: any;

  beforeEach(() => {
    mockData = {
      options: {
        fadeDuration: 1
      }
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [LightboxOverlayComponent],
    providers: [provideZonelessChangeDetection(), LightboxEvent]
});

    fixture = TestBed.createComponent(LightboxOverlayComponent);

    // mock options and ref
    fixture.componentRef.setInput('options', mockData.options);
    fixture.componentRef.setInput('cmpRef', { destroy: jasmine.createSpy('spy') });
    fixture.detectChanges();
  });

  beforeEach(inject([ LightboxEvent ], (lEvent: LightboxEvent) => {
    lightboxEvent = lEvent;
  }));

  it('should init the component with correct styling', () => {
    expect(fixture.nativeElement.getAttribute('class').split(' ')).toEqual(
      jasmine.arrayWithExactContents(['lightboxOverlay', 'animation', 'fadeInOverlay'])
    );
    expect(fixture.nativeElement.getAttribute('style'))
      .toMatch(new RegExp(`animation.*${mockData.options.fadeDuration}s`));
  });

  describe('{ method: close }', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should self destroy and broadcast event when component is closed', () => {
      spyOn(lightboxEvent, 'broadcastLightboxEvent').and.callThrough();
      fixture.componentInstance.close();
      expect(lightboxEvent.broadcastLightboxEvent).toHaveBeenCalledWith({ id: LIGHTBOX_EVENT.CLOSE, data: null });
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute('class').split(' ')).toEqual(
        jasmine.arrayWithExactContents(['lightboxOverlay', 'animation', 'fadeOutOverlay'])
      );
      jasmine.clock().tick(mockData.options.fadeDuration * 1000 + 1);
      expect(fixture.componentInstance.cmpRef().destroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('{ method: ngOnDestroy }', () => {
    it('should unsubscribe event when destroy is called', () => {
      spyOn(fixture.componentInstance['_subscription'], 'unsubscribe').and.callFake(() => {});
      fixture.componentInstance.ngOnDestroy();
      expect(fixture.componentInstance['_subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
