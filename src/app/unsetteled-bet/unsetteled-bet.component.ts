import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { browserRefresh } from '../app.component';


declare var $: any;
@Component({
  selector: 'app-unsetteled-bet',
  templateUrl: './unsetteled-bet.component.html',
  styleUrls: ['./unsetteled-bet.component.css']
})
export class UnsetteledBetComponent implements OnInit {
  sport_id = '0';
  toDate;
  fromDate;
  toDateValue;
  fromDateValue;
  public matchList: any = [];
  matchType = "C";
  page: number = 1;
  SportData: any = [];
  CupData: any = [];

  constructor(private _sessionService: SessionService, private _sportService: SportServiceService) {
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

    var sdata = {
      "limit": 10,
      "pageno": 1
    }
    this._sportService.getSports(sdata).subscribe(data => {
      if (!data.error) {
        this.SportData = data.data;
        this.selectMatchType('C');
      }
    }, error => {

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
    this.GetMyBetsList();


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

    this.GetMyBetsList();

  }

  onScroll() {
    this.page = this.page + 1;
    this.GetMyBetsList();
  }
  selectGametype(id) {
    this.sport_id = id;
    this.page = 1;

    this.GetMyBetsList()
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

    this.GetMyBetsList();
  }
  GetMyBetsList() {


    if (this.fromDate > this.toDate) {
      this._sessionService.notifier.notify('error', 'Error! ToDate is Grater Then fromDate');
      return;
    }
    var data = {
      "from_date": this.fromDate,
      "to_date": this.toDate,
      "limit": this._sessionService.dataLimit,
      "sport_id": this.sport_id,
      "betType": this.matchType,
      "pageno": this.page,
      "market_id": '0',
      "match_id": 0
    }

    this._sportService.getUserMyBetsList(data).subscribe(data => {
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
  addclassByType() {
    if (this.matchList.Type == 'Back') {
      return 'backRow';
    }
    else {
      return 'LayRow';

    }

  }

}
