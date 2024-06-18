import { Component, Inject, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SessionService } from './service/session.service';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { isNullOrUndefined } from 'util';

declare const $: any;



export let browserRefresh = false;
export let deviceInfo = null;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  devToolOpened = false;
  riskCounter = 4;
  startCounter: any = null;

  constructor( @Inject(forwardRef(() => SessionService)) public _sessionService: SessionService,  private router: Router, private deviceService: DeviceDetectorService) {
    //_sessionService.loadScript("https://momentjs.com/downloads/moment-with-locales.min.js");
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // browserRefresh = !router.navigated;

      }
    });
    deviceInfo = this.deviceService.getDeviceInfo();


  }

  ngOnInit() {
    //this.checkDevTool();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  devToolChanged(opened) {
    if (this.router.url == "/login") {
      this.devToolOpened = false;
      return;
    }
    if (this.devToolOpened != opened) {
      this.devToolOpened = opened;
      if (this.devToolOpened) {
        this.startCounterForGoToLogin();
      } else {
        this.stopCounterForGoToLogin();
      }
    }
  }

  startCounterForGoToLogin() {
    this.stopCounterForGoToLogin();
    this.riskCounter = 4;
    this.startCounter = setInterval(() => {
      this.riskCounter--;
      if (this.riskCounter == 0) {
        this.devToolOpened = false;
        this.stopCounterForGoToLogin();
        this._sessionService.gotoLoginPage();
      }
    }, 1000);
  }

  stopCounterForGoToLogin() {
    if (this.startCounter != null) {
      clearInterval(this.startCounter);
      this.startCounter = null;
    }
  }
  checkDevTool() {

    window.onmessage = (event) => {
      if (isNullOrUndefined(event) || isNullOrUndefined(event.data) || isNullOrUndefined(event.data.type)) {
        return;
      }
      if (event.data.type == 'OPENDEV') {
        this.devToolChanged(true);
      } else if (event.data.type == 'CLOSEDEV') {
        this.devToolChanged(false);
      }
    };

    $(document).ready(() => {
      const body = <HTMLDivElement>document.body;
      const script = document.createElement('script');
      script.innerHTML = "var element = new Image; var devtoolsOpen = false; element.__defineGetter__('id', function() { devtoolsOpen = true; }); setInterval(function() { devtoolsOpen = false; console.log(element); if(devtoolsOpen){ window.postMessage({type: 'OPENDEV'}, '*'); }else { window.postMessage({type: 'CLOSEDEV'}, '*');} }, 1000);";
      body.appendChild(script);
    });
  }
}
