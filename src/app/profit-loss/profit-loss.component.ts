import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { browserRefresh } from '../app.component';
import { Router } from '@angular/router';


declare const $: any;

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent implements OnInit {
  toDate;
  fromDate;
  toDateValue;
  fromDateValue;
  public matchList: any = [];
  public betList: any = [];

  matchType = "P";
  page: number = 1;
  SportData: any = [];
  CupData: any = [];
  sport_id = '0';

  bets_sport_id = '0';
  bets_match_id = '0';
  bets_market_id = '0';
  myBets: boolean = false;
  myBetsName;
  myMarketname;
  isDashboard = '';
  constructor(private _sessionService: SessionService, private _sportService: SportServiceService, public route: Router) {
    this._sportService.isShowOneClick = false;

  }

  toTimestamp(strDate) {
    return this._sessionService.toTimestamp(strDate);
  }
  ngOnInit() {
    if (browserRefresh) {
      this._sessionService.gotoLoginPage();
      return;
    }

    $("#fromDate").datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat: "yy-mm-dd",
      onSelect: (selected, evnt) => { //arrow function passes the this into the new scope
        this.getFromDate();
      }
    });

    $("#toDate").datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat: "yy-mm-dd",
      onSelect: (selected, evnt) => { //arrow function passes the this into the new scope
        this.gettoDate();
      }
    });


    this.setupIntialDates();
    this.GetSport();

    this._sportService.callBalance = 1;
    this._sportService.getBalance();

    if (this.route.url == '/dashboard') {
      this.isDashboard = 'dash_yes';
    } else {
      this.isDashboard = 'dash_no';
    }

  }
  setupIntialDates() {
    var todayDate = new Date();

    $("#fromDate").datepicker('option', 'maxDate', todayDate);
    $("#toDate").datepicker('option', 'maxDate', todayDate);
    $("#toDate").datepicker('option', 'minDate', todayDate);

    var formattedTodayDate = formatDate(todayDate, "yyyy-MM-dd", "en")

    this.toDateValue = formattedTodayDate;
    this.fromDateValue = formattedTodayDate;

    var fDate = formattedTodayDate + ' 00:00:00';
    this.fromDate = this.toTimestamp(fDate)

    var tDate = formattedTodayDate + ' 23:59:59';
    this.toDate = this.toTimestamp(tDate)

  }
  GetSport() {
    //this.loading=true;
    var sdata = {
      "limit": 10,
      "pageno": 1
    }
    this._sportService.getSports(sdata).subscribe(data => {
      if (!data.error) {
        this.SportData = data.data;
        this.selectMatchType('P');
      }
    }, error => {
      //this.loading=false;
    })
  }

  getFromDate() {
    var selectedDate = $("#fromDate").datepicker('getDate');
    var event = formatDate(selectedDate, "yyyy-MM-dd", "en");

    if (this.fromDateValue == event) {
      return;
    }

    var maxToDate = new Date(event);
    $("#toDate").datepicker('option', 'minDate', maxToDate);

    this.fromDateValue = event;
    var fDate = event + ' 00:00:00'
    this.fromDate = this.toTimestamp(fDate)
    if (this.fromDate > this.toDate) {
      this.toDateValue = event;
      var tDate = event + ' 23:59:59';
      this.toDate = this.toTimestamp(tDate)
    }
    this.page = 1;

    this.getUserProfitLoss();


  }
  gettoDate() {
    var selectedDate = $("#toDate").datepicker('getDate');
    var event = formatDate(selectedDate, "yyyy-MM-dd", "en");

    if (this.toDateValue == event) {
      return;
    }
    this.toDateValue = event;
    var tDate = event + ' 23:59:59';
    this.toDate = this.toTimestamp(tDate)
    this.page = 1;

    this.getUserProfitLoss();

  }

  onScroll() {
    this.page = this.page + 1;
    this.getUserProfitLoss();
  }
  selectGametype(id) {
    this.sport_id = id;
    this.page = 1;

    this.getUserProfitLoss()
  }

  selectMatchType(type) {
    this.matchType = type;
    if (this.matchType == 'C') {
      $("#runingbtn").addClass('activeButton');
      $("#complatebtn").removeClass('activeButton');
    }
    else {
      $("#runingbtn").removeClass('activeButton');
      $("#complatebtn").addClass('activeButton');
    }
    this.page = 1;

    this.getUserProfitLoss();
  }
  getUserProfitLoss() {
    if (this.fromDate > this.toDate) {
      this._sessionService.notifier.notify('error', 'Error! ToDate is Grater Then fromDate');
      return;
    }
    var data = {
      "from_date": this.fromDate,
      "to_date": this.toDate,
      "limit": this._sessionService.dataLimit,
      "sport_id": this.sport_id,
      "match_id": '0',
      "betType": this.matchType,
      "pageno": this.page
    }
    this._sportService.getUserProfitLossLMatchAndMarketWise(data).subscribe(data => {
      if (!data.error) {
        if (this.page == 1) {
          this.matchList = data.data;
        } else {
          this.matchList.push.apply(this.matchList, data.data)
        }

      }
    })
  }
  goToRest() {
    // this.sport_id=0;
    // this.toDate='';
    // this.fromDate='';
    // this.pageno=1;
    // this.GetMatchList('C');
  }
  goToSerch() {

  }
  gotoProfitLossLMatch(item, position) {

    var marketdata = this.matchList[position].marketData;
    if (marketdata == undefined || marketdata == '') {
      this.matchList[position].marketData = '';
      var data = {
        "sport_id": item.sportId,
        "match_id": item.matchId,
      }
      this._sportService.getUserProfitLossLMatch(data).subscribe(data => {
        if (!data.error) {
          var ProfitLossLMatchList = data.data;
          this.matchList[position].marketData = ProfitLossLMatchList;
        }
      })

    }
    else {
      this.matchList[position].marketData = '';
    }


  }
  getPostionClassname(position) {

    var marketdata = this.matchList[position].marketData;
    if (marketdata == undefined || marketdata == '') {
      return "fa fa-plus"
    }
    return "fa fa-minus"
  }
  hideTogglemyBets() {
    this.myBets = false;

  }
  getMatchBets(item) {
    this.bets_sport_id = item.sportId;
    this.bets_match_id = item.matchId;
    this.bets_market_id = '0';
    this.myMarketname = null;
    this.myBetsName = item.matchName;
    this.GetMyBetsList();
    this.myBets = true;
    $("#profitLossStatemet").modal('show');

  }
  getMatchMarketBets(match, item) {
    this.bets_sport_id = item.sportId;
    this.bets_match_id = item.matchId;
    this.bets_market_id = match.marketId;
    this.myBetsName = item.matchName;
    this.myMarketname = match.marketName;
    this.GetMyBetsList();
  }

  GetMyBetsList() {
    this.betList = [];
    this.myBets = true;
    var data = {
      "from_date": 0,
      "to_date": 0,
      "limit": 500,
      "sport_id": this.bets_sport_id,
      "market_id": this.bets_market_id,
      "match_id": this.bets_match_id,
      "betType": 'P',
      "pageno": 1
    }

    this._sportService.getUserMyBetsList(data).subscribe(data => {
      if (!data.error) {
        if (this.page == 1) {
          this.betList = data.data;
        } else {
          this.betList.push.apply(this.betList, data.data)
        }
      }

    })

  }

}
