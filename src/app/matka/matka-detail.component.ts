import { Component, OnInit } from '@angular/core';
import { MatkaDetailService } from './matka-detail.services';
import { browserRefresh } from '../app.component';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-matka-detail',
  templateUrl: './matka-detail.component.html',
  styleUrls: ['./matka-detail.component.css']
})
export class MatkaDetailComponent implements OnInit {

  localBetDataList = [];
  localBetTotalAmount: number;

  placedBetDataList = [];
  placedBetTotalAmount: number;

  //placedBetDataList = [{ number: 1, amount: 10 }, { number: 2, amount: 10 }, { number: 3, amount: 10 }, { number: 4, amount: 10 }];

  drawRemaingTime = 0;
  matchDetail = null;
  
  haroofRate = " ";
  joidRate = " ";

  totalAmountHaroof = " ";
  totalAmountJodi = " ";

  showPopupNumber=0;

  spinTimer: any = null;
  tsTmeH = 0;
  tsTmeM = 0;
  tsTmeS = 0;

  nullUndefined = isNullOrUndefined;

  constructor(private matkaDetailService: MatkaDetailService, private sessionService: SessionService, public _sportService: SportServiceService, public route: Router) { }

  ngOnInit() {

    if (browserRefresh) {
      this.sessionService.gotoLoginPage();
      return;
    }

    this.callGetMarketDetail();
    this.callGetMarketTempBets();
    this.callGetMarketBets();

  }

  callGetMarketDetail() {

    if (this.route.url == '/matka-detail') {
      var sdata = { 'match_id': this.sessionService.get('match_id'), 'sport_id': this.sessionService.get('sport_id') };
      this.matkaDetailService.GetMarketDetail(sdata).subscribe(data => {
        if (!data.error) {

          this._sportService._serverTime = data.currentTime;
          var result = data.data;
          if (isNullOrUndefined(result) || isNullOrUndefined(result.MatchDetails.match_id)) {
            this.sessionService.gotoDashboard();
            return;
          }
          if (!isNullOrUndefined(result.MatchDetails.close_market) && !isNullOrUndefined(result.MatchDetails.close_market.runner_json) && (result.MatchDetails.close_market.runner_json.length > 0)) {
            this.haroofRate = "Rate 10 : " + (10 * (+result.MatchDetails.close_market.runner_json[0].back[0].price));
          }

          if (!isNullOrUndefined(result.MatchDetails.jodi_market) && !isNullOrUndefined(result.MatchDetails.jodi_market.runner_json) && (result.MatchDetails.jodi_market.runner_json.length > 0)) {
            this.joidRate = "Rate 10 : " + (10 * (+result.MatchDetails.jodi_market.runner_json[0].back[0].price));
          }
          this.matchDetail = result.MatchDetails;
          //console.log(this.matchDetail);
          this.drawRemaingTime = this.matchDetail.draw_date - data.currentTime;
          if(this.drawRemaingTime > 0){
            this.startTimer();
          }

        }
      }, error => {
      });
    }
  }

  startTimer() {
    if(this.drawRemaingTime > 0){
      this.tsTmeH = Math.floor(this.drawRemaingTime / 3600);
      this.tsTmeM = (Math.floor(this.drawRemaingTime / 60 ) % 60) -2;
      this.tsTmeS = this.drawRemaingTime % 60;
    }else{
      this.tsTmeH = 0;
      this.tsTmeM = 0;
      this.tsTmeS = 0;
    }
    
    //console.log(this.tsTmeH+" : "+this.tsTmeM+" : "+this.tsTmeS);
    this.spinTimer = setTimeout(() => {
      this.drawRemaingTime--;
      if(this.drawRemaingTime > 0){
        this.startTimer();
      }
    }, 1000);
  }

  printEvent($event){
    console.log($event);
    
  }

  callGetMarketTempBets() {

    if (this.route.url == '/matka-detail') {
      var sdata = { 'match_id': this.sessionService.get('match_id')};
      this.matkaDetailService.getTempBets(sdata).subscribe(data => {
        if (!data.error) {

          this._sportService._serverTime = data.currentTime;

          this.localBetDataList=data.data;
          this.localBetTotalAmount =  this.localBetDataList.reduce((total, item) => total + item.stack,0);
          
        }else{
          this.localBetDataList = [];
        }
      }, error => {
      });
    }
  }

  callGetMarketBets() {

    if (this.route.url == '/matka-detail') {
      var sdata = { 'match_id': this.sessionService.get('match_id')};
      this.matkaDetailService.getMatkaBets(sdata).subscribe(data => {
        if (!data.error) {

          this._sportService._serverTime = data.currentTime;

          this.placedBetDataList=data.data;
          this.placedBetTotalAmount =  this.placedBetDataList.reduce((total, item) => total + item.stack,0);

        }else{
          this.placedBetDataList = [];
        }
      }, error => {
      });
    }
  }

  deleteTempBets(betid, amount){
    if (isNullOrUndefined(betid)) {
      return;
    }
    var data = {"betid": betid, "amount": amount }
    this._sportService._loading = true;
    this.matkaDetailService.deleteMatkaTempBets(data).subscribe(data => {
        if (!data.error) {
          
          this.callGetMarketTempBets();
        }
        this._sportService._loading = false;
      }, error => {
      });
    //return true;

  }

  deleteAllTempBets(){
    var sdata = { 'match_id': this.sessionService.get('match_id'), 'amount' : this.localBetTotalAmount };
    this._sportService._loading = true;
    this.matkaDetailService.deleteMatkaAllTempBets(sdata).subscribe(data => {
      if (!data.error) {
        this.callGetMarketTempBets();
      }
      this._sportService._loading = false;
    }, error => {
    });
  }

  checkMatkaMatchOpen(match) {
    if (isNullOrUndefined(match) || isNullOrUndefined(match.start_date) || isNullOrUndefined(match.end_date)) {
      return;
    }

    if (isNullOrUndefined(match.matkaCurrentlyClose)) {
      match.matkaCurrentlyClose = false;
    }

    if (isNullOrUndefined(match.matkaLeftTime)) {
      match.matkaLeftTime = "";
    }


    if (this._sportService._serverTime>= +match.start_date && this._sportService._serverTime<= +match.end_date) {
      if(match.matkaCurrentlyClose==1 || match.matkaCurrentlyClose==2){
        match.matkaCurrentlyClose=0;
      }

      let remainTime= +match.end_date - +this._sportService._serverTime;
      if (remainTime>0) {
        match.matkaLeftTime=""+remainTime;
      } else {
        match.matkaLeftTime="";
      }

    }else if(this._sportService._serverTime< +match.start_date){
      if(match.matkaCurrentlyClose==0 || match.matkaCurrentlyClose==2){
        match.matkaCurrentlyClose=1;
      }

      let remainTime= +match.end_date - +this._sportService._serverTime;
      if(remainTime>0){
        match.matkaLeftTime=""+remainTime;
      }else{
        match.matkaLeftTime="";
      }
      
    }else{
      if(match.matkaCurrentlyClose==0 || match.matkaCurrentlyClose==1){
        match.matkaCurrentlyClose=2;
      }
    }
  }

  onHaroofDataChange() {
    let updatedAmount = 0;
    if (isNullOrUndefined(this.matchDetail)) {
      return;
    }
    if (!isNullOrUndefined(this.matchDetail.close_market) && !isNullOrUndefined(this.matchDetail.close_market.runner_json) && (this.matchDetail.close_market.runner_json.length > 0)) {
      this.matchDetail.close_market.runner_json.forEach(selection => {
        if (!isNullOrUndefined(selection.inputAmount) && selection.inputAmount != "") {
          updatedAmount += (+selection.inputAmount);
        }
      });
    }
    if (!isNullOrUndefined(this.matchDetail.open_market) && !isNullOrUndefined(this.matchDetail.open_market.runner_json) && (this.matchDetail.open_market.runner_json.length > 0)) {
      this.matchDetail.open_market.runner_json.forEach(selection => {
        if (!isNullOrUndefined(selection.inputAmount) && selection.inputAmount != "") {
          updatedAmount += (+selection.inputAmount);
        }
      });
    }
    if (updatedAmount == 0) {
      this.totalAmountHaroof = " ";
    } else {
      this.totalAmountHaroof = updatedAmount + "";
    }
  }

  onJodiDataChange() {
    let updatedAmount = 0;
    if (isNullOrUndefined(this.matchDetail)) {
      return;
    }
    if (!isNullOrUndefined(this.matchDetail.jodi_market) && !isNullOrUndefined(this.matchDetail.jodi_market.runner_json) && (this.matchDetail.jodi_market.runner_json.length > 0)) {
      this.matchDetail.jodi_market.runner_json.forEach(selection => {
        if (!isNullOrUndefined(selection.inputAmount) && selection.inputAmount != "") {
          updatedAmount += (+selection.inputAmount);
        }
      });
    }

    if (updatedAmount == 0) {
      this.totalAmountJodi = " ";
    } else {
      this.totalAmountJodi = updatedAmount + "";
    }
  }

  onHaroofDataClear() {
    if (isNullOrUndefined(this.matchDetail)) {
      return;
    }
    if (!isNullOrUndefined(this.matchDetail.close_market) && !isNullOrUndefined(this.matchDetail.close_market.runner_json) && (this.matchDetail.close_market.runner_json.length > 0)) {
      this.matchDetail.close_market.runner_json.forEach(selection => {
        selection.inputAmount = "";
      });
    }
    if (!isNullOrUndefined(this.matchDetail.open_market) && !isNullOrUndefined(this.matchDetail.open_market.runner_json) && (this.matchDetail.open_market.runner_json.length > 0)) {
      this.matchDetail.open_market.runner_json.forEach(selection => {
        selection.inputAmount = "";
      });
    }

    this.totalAmountHaroof = " ";

  }

  onJodiDataClear() {
    if (isNullOrUndefined(this.matchDetail)) {
      return;
    }
    if (!isNullOrUndefined(this.matchDetail.jodi_market) && !isNullOrUndefined(this.matchDetail.jodi_market.runner_json) && (this.matchDetail.jodi_market.runner_json.length > 0)) {
      this.matchDetail.jodi_market.runner_json.forEach(selection => {
        selection.inputAmount = "";
      });
    }
    this.totalAmountJodi = " ";
  }

  saveJodiTempBets() {
    let tempBets = [];
    if (isNullOrUndefined(this.matchDetail)) {
      return;
    }
    if (!isNullOrUndefined(this.matchDetail.jodi_market) && !isNullOrUndefined(this.matchDetail.jodi_market.runner_json) && (this.matchDetail.jodi_market.runner_json.length > 0)) {
      this.matchDetail.jodi_market.runner_json.forEach(selection => {
        if (!isNullOrUndefined(selection.inputAmount) && selection.inputAmount != "") {
          tempBets.push({ selection_id: selection.selectionId, amount: selection.inputAmount, market_id: this.matchDetail.jodi_market.marketId });
        }
      });
    }
    this._sportService._loading = true;
    if (this.route.url == '/matka-detail') {
      var sdata = { 'match_id': this.sessionService.get('match_id'), 'bet_data': tempBets };
      this.matkaDetailService.saveTempBets(sdata).subscribe(data => {
        if (!data.error) {
          this._sportService._loading = false;
          this.sessionService.notifier.notify('success',data.message);
          this.onJodiDataClear();
          this._sportService._serverTime = data.currentTime;
          this._sportService.callBalance = 1;
            this._sportService.getBalance();
          this.callGetMarketTempBets();
          
        }else{
          this._sportService._loading = false;
          this.sessionService.notifier.notify('error',data.message);
        }
      }, error => {
      });
    }


  }

  saveHaroofTempBets() {
    let tempBets = [];
    if (isNullOrUndefined(this.matchDetail)) {
      return;
    }
    if (!isNullOrUndefined(this.matchDetail.close_market) && !isNullOrUndefined(this.matchDetail.close_market.runner_json) && (this.matchDetail.close_market.runner_json.length > 0)) {
      this.matchDetail.close_market.runner_json.forEach(selection => {
        if (!isNullOrUndefined(selection.inputAmount) && selection.inputAmount != "") {
          tempBets.push({ selection_id: selection.selectionId, amount: selection.inputAmount, market_id: this.matchDetail.close_market.marketId });
        }
      });
    }
    if (!isNullOrUndefined(this.matchDetail.open_market) && !isNullOrUndefined(this.matchDetail.open_market.runner_json) && (this.matchDetail.open_market.runner_json.length > 0)) {
      this.matchDetail.open_market.runner_json.forEach(selection => {
        if (!isNullOrUndefined(selection.inputAmount) && selection.inputAmount != "") {
          tempBets.push({ selection_id: selection.selectionId, amount: selection.inputAmount, market_id: this.matchDetail.open_market.marketId });
        }
      });
    }
    this._sportService._loading = true;
    if (this.route.url == '/matka-detail') {
      var sdata = { 'match_id': this.sessionService.get('match_id'), 'bet_data': tempBets };
      this.matkaDetailService.saveTempBets(sdata).subscribe(data => {
        if (!data.error) {
          this._sportService._loading = false;
          this.sessionService.notifier.notify('success',data.message);
          this.onHaroofDataClear();
          this._sportService._serverTime = data.currentTime;
          this._sportService.callBalance = 1;
            this._sportService.getBalance();
          this.callGetMarketTempBets();
        }else{
          this._sportService._loading = false;
          this.sessionService.notifier.notify('error',data.message);
        }
      }, error => {
      });
    }
  }

  saveAllTempBets(){
    var sdata = {'amount': this.localBetTotalAmount, 'match_id': this.sessionService.get('match_id')};
    this._sportService._loading = true;
    this.matkaDetailService.saveAllMatkaTempBets(sdata).subscribe(data => {
      if (!data.error) {
        this.sessionService.notifier.notify('success',data.message);
        this._sportService._loading = false;
        this._sportService.callBalance = 1;
            this._sportService.getBalance();
        this.callGetMarketTempBets();
        this.callGetMarketBets();
      }
    }, error => {
    });
  }

  allowedNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
