import { provideZoneChangeDetection, importProvidersFrom } from "@angular/core";

import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { LightboxModule } from "../src";
import { AppComponent } from "./app.component";

bootstrapApplication(AppComponent, {
    providers: [provideZoneChangeDetection(), importProvidersFrom(BrowserModule, LightboxModule)]
});
