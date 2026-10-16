import { importProvidersFrom, provideZonelessChangeDetection } from "@angular/core";

import { bootstrapApplication } from "@angular/platform-browser";
import { LightboxModule } from "../src";
import { AppComponent } from "./app.component";

bootstrapApplication(AppComponent, {
    providers: [provideZonelessChangeDetection(), importProvidersFrom(LightboxModule)]
});
