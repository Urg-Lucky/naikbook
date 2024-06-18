import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { browserRefresh } from '../app.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LobbygameService } from './lobbygame.services';
import { filter } from 'rxjs/operators';


declare var $: any;


@Component({
  selector: 'app-lobbygame',
  templateUrl: './lobbygame.component.html',
  styleUrls: ['./lobbygame.component.css']
})
export class LobbygameComponent implements OnInit {

  safeSrc: SafeResourceUrl = null;
  loading = false;
  lobbyName = '';
  gameName = '';
  balance = '';

  constructor(private _sessionService: SessionService,
    public _lobbyService: LobbygameService,
    private sanitizer: DomSanitizer,
    private _sportService: SportServiceService,
    public route: Router) {
    this._sportService.isShowOneClick = false;
    this.lobbyName = this._sessionService.get('match_name');
    this.balance = this._sessionService.get('balance');

  }

  ngOnDestroy() {
    if (this.pipSub != null) {
      this.pipSub.unsubscribe();
    }
  }

  pipSub: any = null;

  ngOnInit() {
    if (browserRefresh) {
      this._sessionService.gotoLoginPage();
      return;
    }

    this.pipSub = this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this._sportService.callBalance = 1;
      this._sportService.getBalance();
      this.callKeepAlive();
    });

    this._sportService.callBalance = 1;
    this._sportService.getBalance();
    this.GetMarketList();
    this.callKeepAlive();


  }


  GetMarketList() {
    try {
      this.loading = true;
      if (this.route.url == '/lobbygame') {
        var sdata = { 'providerName': this._sessionService.get('provider_name'), 'gameId': this._sessionService.get('game_id') };
        this._lobbyService.getGameLobbyStart(sdata).subscribe(data => {
          this.loading = false;
          if (!data.error) {
            if (this.route.url != '/lobbygame') {
              return;
            }
            var result = data.data.url;
            this.gameName = this._sessionService.get('game_name');
            //window.open(result, "_blank");
            if (this.safeSrc == null) {
              if (result != '') {
                this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result);
                var frame = $('#lobby')[0];
                frame.contentWindow.location.replace(result);
              }
            }
          } else {

          }
        }, error => {
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }
    catch (e) {
      this.loading = false;
    }

  }

  timerForKeepAlive: any;
  removeTimeOut() {
    if (this.timerForKeepAlive != null) {
      window.clearTimeout(this.timerForKeepAlive);
      this.timerForKeepAlive = null;
    }
  }

  callKeepAlive() {
    try {
      this.removeTimeOut();
      this.timerForKeepAlive = setTimeout(() => {
        if (this.route.url == '/lobbygame') {
          if (this.safeSrc == null) {
            this.callKeepAlive();
            return;
          }

          var sdata = { 'type': "1" };
          this._lobbyService.callKeepAlive(sdata).subscribe(data => {
            if (!data.error) {
              if (this.route.url != '/lobbygame') {
                return;
              }
              this.callKeepAlive();
            } else {
              if (data.code == 101) {
                this._sessionService.gotoDashboard();
                return;
              }
              this.callKeepAlive();
            }
          }, error => {
            this.callKeepAlive();
          });
        }
      }, 3000);
    }
    catch (e) {
      this.callKeepAlive();
    }
  }
}
