import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { AppComponent } from "./app.component";
import { NgxLoadingModule } from "ngx-loading";
import { environment } from "../environments/environment";
import { DeviceDetectorModule } from "ngx-device-detector";
import { CarouselModule } from "ngx-bootstrap/carousel";

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: "right",
      distance: 10,
    },
    vertical: {
      position: "top",
      distance: 10,
      gap: 10,
    },
  },
  theme: "material",
  behaviour: {
    autoHide: 1000,
    onClick: "hide",
    onMouseover: false,
    showDismissButton: false,
    stacking: 1,
  },
  animations: {
    enabled: true,
    show: {
      preset: "slide",
      speed: 300,
      easing: "ease-in",
    },
    hide: {
      preset: "slide",
      speed: 300,
      easing: "ease-out",
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: "ease",
    },
    overlap: 150,
  },
};

const customNotifierOptions2: NotifierOptions = {
  position: {
    horizontal: {
      position: "right",
      distance: 10,
    },
    vertical: {
      position: "bottom",
      distance: 10,
      gap: 10,
    },
  },
  theme: "material",
  behaviour: {
    autoHide: 1000,
    onClick: "hide",
    onMouseover: false,
    showDismissButton: false,
    stacking: 1,
  },
  animations: {
    enabled: true,
    show: {
      preset: "slide",
      speed: 300,
      easing: "ease-in",
    },
    hide: {
      preset: "slide",
      speed: 300,
      easing: "ease-out",
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: "ease",
    },
    overlap: 150,
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CarouselModule.forRoot(),
    NotifierModule.withConfig(
      environment.loginPageType == 1
        ? customNotifierOptions
        : environment.loginPageType == 2
        ? customNotifierOptions2
        : customNotifierOptions
    ),
    NgxLoadingModule.forRoot({}),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
