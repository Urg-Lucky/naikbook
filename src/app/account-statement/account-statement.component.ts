import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { AccountStatementService } from './account-statement.services';
import { SportServiceService } from '../service/sport-service.service';
import { Router } from '@angular/router';
import { SessionService } from '../service/session.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { browserRefresh } from '../app.component';

declare const $: any;

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css']
})
export class AccountStatementComponent implements OnInit {

  bets_sport_id = '0';
  bets_match_id = '0';
  bets_market_id = '0';
  myBets: boolean = false;
  myBetsName;
  myMarketname;
  public betList: any = [];

  toDate;
  fromDate;
  toDateValue;
  fromDateValue;
  public AccountStatementList: any = [];
  page: number = 1;
  SportData: any = [];
  CupData: any = [];
  isDashboard = '';
  constructor(
    public _sessionService: SessionService,
    public AccountStatement: AccountStatementService,
    public _sportService: SportServiceService, public route: Router) {
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
    this.getAccountStatement();

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
    var past7Date = new Date();
    past7Date.setDate(past7Date.getDate() - 6)

    $("#fromDate").datepicker('option', 'maxDate', todayDate);
    $("#toDate").datepicker('option', 'maxDate', todayDate);
    $("#toDate").datepicker('option', 'minDate', todayDate);

    var formattedTodayDate = formatDate(todayDate, "yyyy-MM-dd", "en")
    var formatted7Date = formatDate(past7Date, "yyyy-MM-dd", "en")


    this.toDateValue = formattedTodayDate;
    this.fromDateValue = formatted7Date;

    var fDate = formatted7Date + ' 00:00:00';
    this.fromDate = this.toTimestamp(fDate)

    var tDate = formattedTodayDate + ' 23:59:59';
    this.toDate = this.toTimestamp(tDate)

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
    this.getAccountStatement();


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
    this.getAccountStatement();

  }

  onScroll() {
    this.page = this.page + 1;
    this.getAccountStatement();
  }
  goToSerch() {
    this.getAccountStatement();
  }
  getAccountStatement() {


    if (this.fromDate > this.toDate) {
      this._sessionService.notifier.notify('error', 'Error! ToDate is Grater Then fromDate');
      return;
    }
    var data = {
      "from_date": this.fromDate,
      "to_date": this.toDate,
      "limit": this._sessionService.dataLimit,
      "pageno": this.page
    }

    this.AccountStatement.getUserAccountStatement(data).subscribe(data => {
      if (!data.error) {
        if (this.page == 1) {
          this.AccountStatementList = data.data;
        } else {
          this.AccountStatementList.push.apply(this.AccountStatementList, data.data)
        }
      }
    }, (error) => {
      this._sessionService.printLog(error.error);
      if (error.error instanceof ProgressEvent) {
        if (error.status == 0) {
          this._sessionService.notifier.notify('error', "Internet not available.");
        }
      }


    });

  }
  getMatchBets(item) {
    if (item.match > 0) {
      this.bets_sport_id = '0';
      this.bets_match_id = item.match;
      this.bets_market_id = item.market;
      this.myMarketname = null;
      this.myBetsName = null;
      this.GetMyBetsList();
      $("#exampleModalMM").modal('show');
    }

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
          this.myMarketname = this.betList[0].matchName;
          this.myBetsName = this.betList[0].marketName;

        } else {
          this.betList.push.apply(this.betList, data.data);
          this.myMarketname = this.betList[0].matchName;
          this.myBetsName = this.betList[0].marketName;

        }
      }

    })

  }
}
