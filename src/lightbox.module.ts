import { NgModule } from "@angular/core";
import { FileSaverModule } from "ngx-filesaver";

import { LightboxComponent } from "./components/lightbox/lightbox.component";
import { LightboxOverlayComponent } from "./components/lightbox-overlay/lightbox-overlay.component";
import { Lightbox } from "./services/lightbox.service";
import { LightboxConfig } from "./services/lightbox-config.service";
import { LightboxEvent, LightboxWindowRef } from "./services/lightbox-event.service";

@NgModule({
  providers: [Lightbox, LightboxConfig, LightboxEvent, LightboxWindowRef],
  imports: [FileSaverModule, LightboxOverlayComponent, LightboxComponent],
})
export class LightboxModule {}
