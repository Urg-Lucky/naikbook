import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { TitliDetailService } from './titli-detail.services';
import { browserRefresh } from '../app.component';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { ThrowStmt } from '@angular/compiler';
//import { TweenMax } from 'gsap';

declare const TweenMax: any;
//declare const Winwheel:any;
declare function startSpin(t: any): any;
declare function resetWheel(): any;

@Component({
  selector: 'app-titli-detail',
  templateUrl: './titli-detail.component.html',
  styleUrls: ['./titli-detail.component.css']
})
export class TitliDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  titliBetDataList = [];
  titliBetTotalAmount: number;

  matchDetail = null;
  currentMatchDetail = null;
  drawRemaingTime = 0;
  titliResultDataList = [];
  declareResultData = [];

  showPopupTitli: any = null;
  getTitliBets: any = null;
  spinTimer: any = null;
  drawTime = 0;
  drawResult = 5;
  tsTme = 0;
  tsTme2 = 0;

  nullUndefined = isNullOrUndefined;

  constructor(private titliDetailService: TitliDetailService, private sessionService: SessionService, public _sportService: SportServiceService, public route: Router) { }

  ngOnInit() {

    if (browserRefresh) {
      this.sessionService.gotoLoginPage();
      return;
    }
    this.callGetMarketDetail();
    this.callGetTitliResult();
  }

  ngOnDestroy() {
    this.stopSpinTimer();
  }

  ngAfterViewInit() {
    this.setupPageScript();
  }


  setupPageScript() {

    // tslint:disable-next-line: prefer-const
    let elementRef = document.getElementById('home-component-head');
    let s = document.createElement('script');
    s.src = './assets/js/vendor/commonWheel.js';
    s.async = true;
    elementRef.appendChild(s);

    // Custom Js Setup

    s = document.createElement('script');
    s.src = './assets/js/vendor/TweenMax.js';
    s.async = true;
    elementRef.appendChild(s);

  }
  updatePopupTtiliData(selection) {
    this.showPopupTitli = selection;
    if (isNullOrUndefined(this.showPopupTitli) || isNullOrUndefined(this.matchDetail)) {
      return;
    }

    var matchData = { 'stack': this.matchDetail.match_stack, 'minBetAmount': this.matchDetail.minBetAmount, 'maxBetAmount': this.matchDetail.maxBetAmount };
    this.showPopupTitli = { ...matchData, ...this.showPopupTitli };

  }

  callGetMarketDetail() {
    if (this.route.url == '/titli-detail') {
      var sdata = { 'sport_id': this.sessionService.get('sport_id') };
      this.titliDetailService.GetMarketDetail(sdata).subscribe(data => {
        if (!data.error) {

          this._sportService._serverTime = data.currentTime;
          var result = data.data;
          if (isNullOrUndefined(result)) {
            this.sessionService.gotoDashboard();
            return;
          }
          this.matchDetail = result.MatchDetails;
          this._sportService.callBalance = 1;
          this._sportService.getBalance();
          this.drawResult = this.matchDetail.drawId;
          //this.drawResult = 6;
          this.drawRemaingTime = this.matchDetail.draw_date - data.currentTime;
          if (this.drawRemaingTime > 0) {
            this.startSpinTimer();
          }
          if (this.drawRemaingTime < 10) {
            this.startSpinTimer();
          }
          this.callGetTitliBets();
        }
      }, error => {
      });
    }

  }

  callGetCurrentResult() {
    if (this.route.url == '/titli-detail') {
      var sdata = { 'sport_id': this.sessionService.get('sport_id') };
      this.titliDetailService.GetMarketDetail(sdata).subscribe(data => {
        if (!data.error) {

          this._sportService._serverTime = data.currentTime;
          var result = data.data;
          if (isNullOrUndefined(result)) {
            this.sessionService.gotoDashboard();
            return;
          }
          this.currentMatchDetail = result.MatchDetails;
          this.drawResult = this.currentMatchDetail.drawId;

        }
      }, error => {
      });
    }

  }
  printEvent($event) {
    console.log($event);

  }

  callGetTitliBets() {
    if (this.route.url == '/titli-detail') {
      var sdata = { 'match_id': this.matchDetail.match_id, 'sport_id': this.matchDetail.sport_id, 'market_id': this.matchDetail.market_id };
      this.titliDetailService.getTitliBets(sdata).subscribe(data => {
        if (!data.error) {
          this._sportService._serverTime = data.currentTime;
          this.titliBetDataList = data.data;

        } else {
          this.titliBetDataList = [];
        }
      }, error => {
      });
    }
  }

  callGetTitliResult() {
    if (this.route.url == '/titli-detail') {
      var sdata = { 'sport_id': this.sessionService.get('sport_id') };
      this.titliDetailService.getTitliResult(sdata).subscribe(data => {
        if (!data.error) {
          this._sportService._serverTime = data.currentTime;
          this.titliResultDataList = data.data;
          //console.log(this.titliResultDataList);
        } else {
          this.titliResultDataList = [];
        }
      }, error => {
      });
    }
  }

  declareTitliResult() {
    if (this.route.url == '/titli-detail') {
      var sdata = { 'match_id': this.matchDetail.match_id, 'sport_id': this.matchDetail.sport_id, 'market_id': this.matchDetail.market_id };
      this.titliDetailService.titliResultDeclare(sdata).subscribe(data => {
        if (!data.error) {
          this._sportService._serverTime = data.currentTime;
          this.declareResultData = data.data;

        } else {
          console.log(this.declareResultData);
          this.declareResultData = [];
        }
      }, error => {
      });
    }
  }

  allowedNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onCallStartSpin() {
    startSpin(this.drawResult);
  }
  onCallStopSpin() {
    resetWheel();
  }

  startSpinTimer() {
    if (this.drawRemaingTime > 0) {
      this.tsTme = Math.floor(this.drawRemaingTime / 60);
      this.tsTme2 = this.drawRemaingTime - (this.tsTme * 60);
    } else {
      this.tsTme = 0;
      this.tsTme2 = 0;
    }

    //console.log(this.tsTme+" : "+this.tsTme2);
    this.spinTimer = setTimeout(() => {
      this.drawRemaingTime--;
      this.callGetCurrentResult()
      if (this.drawRemaingTime == 10) {
        this.onCallStartSpin();
        this.showPopupTitli = null;
      }
      if (this.drawRemaingTime > -1) {
        this.startSpinTimer();
      } else {
        this.stopSpinTimer();
        this.onCallStopSpin();
        this.callGetMarketDetail();
        this.callGetTitliResult();
        //this.declareTitliResult();
      }
    }, 1000);
  }

  stopSpinTimer() {
    if (this.spinTimer != null) {
      clearTimeout(this.spinTimer);
    }

  }

}
