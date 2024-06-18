import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { deviceInfo } from '../app.component';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  notifier: NotifierService;
  selectedType = "AL";
  selectedStatus = "AL";
  showMarketInfo = environment.showMarketInfo;
  websiteName = environment.websiteName;
  supportSystemAvailable = environment.supportSystemAvailable;
  xpgSideMenuAvailable = environment.xpgSideMenuAvailable;
  ezugiSideMenuAvailable = environment.ezugiSideMenuAvailable;
  lotusSideMenuAvailable = environment.lotusSideMenuAvailable;
  casinoSideMenuAvaliable = environment.casinoSideMenuAvaliable;
  oddsBlinkAvailable = environment.oddsBlinkAvailable;
  hideExtraOdds = environment.hideExtraOdds;
  backTitleName = environment.backTitleName;
  layTitleName = environment.layTitleName;

  depositPlaceHolder = "";
  withdrawlPlaceHolder = "";
  accountInformation = "";

  endpoint = "https://" + environment.domain + environment.port + environment.apipath;
  endpoint2 = "https://" + environment.domain + environment.port + environment.apipath2;

  constructor(notifierService: NotifierService, private route: Router, private http: HttpClient) {
    this.notifier = notifierService;

    if (window.location.hostname.startsWith("www.")) {
      this.endpoint = "https://" + "www." + environment.domain + environment.port + environment.apipath;
    }

  }

  public internetAvaliable = true;
  public casinoSportsId = 111;
  public matkaSportsId = 222;

  public matkaMatchSportsId = 2224;

  public casino_id_t20 = "1111";
  public casino_id_t1day = "1112";
  public casino_id_poker = "2221";
  public casino_id_poker_T20 = "2223";
  public casino_id_poker6player = "2222";
  public casino_id_andarbahar = "7779";
  public casino_id_32cards = "4444";
  public casino_id_7UpDown = "5555";
  public casino_id_hilow = "6666";
  public casino_id_matka = "7777";

  public casino_id_D_t20 = "1113";
  public casino_id_D_t1day = "1114";
  public casino_id_AAA = "5556";
  public casino_id_7UpDown_B = "5557";

  public casino_id_7UpDown_H = "5558";
  public casino_id_dragon_tiger = "5559";
  public casino_id_H_t20 = "1115";
  public casino_id_H_Muflis = "1116";
  public casino_id_H_Test = "1117";
  public casino_id_H_Matka = "7778";
  public casino_id_H_Passa = "8881";


  public casino_id_XPG = "9991";
  public casino_id_EZUGI = "9992";
  public casino_id_LOTUS = "9993";
  public casino_id_EVOLUTIONS = "9994";
  public casino_id_EVOLUTIONS2 = "9999";


  public dataLimit = 15;

  set(key, value) {
    return localStorage.setItem(key, value);
  }
  get(key) {
    return localStorage.getItem(key);
  }
  destroy(key) {
    return localStorage.removeItem(key);
  }
  getFloat(key): number {
    return parseFloat(this.get(key));
  }

  convertToAbs(data) {
    return Math.abs(parseFloat(data));
  }

  isLoggedIn() {

    if (localStorage.getItem('slug') != undefined && localStorage.getItem('slug') != null && localStorage.getItem('slug') != '') {
      return true;
    }
    else {
      return false;
    }
  }

  setAppHeader() {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    headers = this.updateDeviceInfoInHeader(headers);
    return headers;
  }

  setTokenHeader() {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.get('slug')
    });
    headers = this.updateDeviceInfoInHeader(headers);
    return headers;
  }

  setTokenHeaderMultiPart() {

    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.get('slug')
    });
    headers == this.updateDeviceInfoInHeader(headers);
    return headers;
  }

  updateDeviceInfoInHeader(headers: HttpHeaders) {
    if (deviceInfo != null) {
      headers = headers.set('LocalBrowser', deviceInfo.browser);
      headers = headers.set('LocalBrowserVersion', deviceInfo.browser_version);
      headers = headers.set('LocalDevice', deviceInfo.device);
      headers = headers.set('LocalOs', deviceInfo.os);
      headers = headers.set('LocalUserAgent', deviceInfo.userAgent);
    } else {
      headers = headers.set('LocalBrowser', "UNKNOWN");
    }
    return headers;

  }

  getSettingData() {
    return this.http.get<any>(this.endpoint + 'getSettingData', { headers: this.setTokenHeader() });
  }
  gotoLoginPage() {
    localStorage.clear();
    if (this.route.url != "/login") {
      this.route.navigate(['/login']);
    }
  }

  gotoDashboard() {
    if (this.route.url != "/dashboard") {
      this.route.navigate(['dashboard']);
    }
  }



  printLog(message) {
    console.log(message);
  }


  toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    if (!isNaN(datum)) {
      return datum / 1000;
    }

    var datum = Date.parse(strDate.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
    return datum / 1000;
  }

  public loadScript(url: string) {
    if (!this.isScriptLoaded(url)) {
      const body = <HTMLDivElement>document.body;
      const script = document.createElement('script');
      script.innerHTML = '';
      script.src = url;
      script.async = true;
      script.defer = false;
      body.appendChild(script);
    }
  }

  isScriptLoaded(src) {
    return document.querySelector('script[src="' + src + '"]') ? true : false;
  }

  public loadTawkScriptChat() {
    if (environment.chatsupport != '') {
      var url = environment.chatsupport;
      if (!this.isScriptLoaded(url)) {
        var s1 = document.createElement("script");
        var s0 = <HTMLDivElement>document.body;
        s1.async = true;
        s1.src = url;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.appendChild(s1);
      }
    }

  }

  getDWRequestStatement(sdata) {

    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'user-chat-list', sdata, { headers: this.setTokenHeader() });
  }
  toDate;
  fromDate;
  public DWStatement: any = [];
  getDWStatement() {

    if (this.fromDate > this.toDate) {
      this.notifier.notify('error', 'Error! ToDate is Grater Then fromDate');
      return;
    }
    var data = {
      "from_date": this.fromDate,
      "to_date": this.toDate,
      "limit": this.dataLimit,
      "page": 1,
      "status": this.selectedStatus,
      "type": this.selectedType
    }

    this.getDWRequestStatement(data).subscribe(data => {
      if (!data.error) {
        if (true) {
          this.DWStatement = data.data;
        }
      }
    }, (error) => {
      this.printLog(error.error);
      if (error.error instanceof ProgressEvent) {
        if (error.status == 0) {
          this.notifier.notify('error', "Internet not available.");
        }
      }


    });

  }
  SupportStatement: any = [];
  getSupportRequestStatement(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'comment-request-list', sdata, { headers: this.setTokenHeader() });
  }
  getSupportStatement() {

    if (this.fromDate > this.toDate) {
      this.notifier.notify('error', 'Error! ToDate is Grater Then fromDate');
      return;
    }
    var data = {
      "from_date": this.fromDate,
      "to_date": this.toDate,
      "limit": this.dataLimit,
      "page": 1,
      "status": this.selectedStatus == 'AL' ? 'A' : this.selectedStatus,
      "type": this.selectedType == 'AL' ? 'A' : this.selectedType
    }

    this.getSupportRequestStatement(data).subscribe(data => {
      if (!data.error) {
        if (true) {
          this.SupportStatement = data.data;
        }
      }
    }, (error) => {
      this.printLog(error.error);
      if (error.error instanceof ProgressEvent) {
        if (error.status == 0) {
          this.notifier.notify('error', "Internet not available.");
        }
      }


    });

  }


  getFromDate() {

    var selectedDate = $("#fromDate").datepicker('getDate');
    var event = formatDate(selectedDate, "yyyy-MM-dd", "en");

    $("#toDate").datepicker('option', 'minDate', selectedDate);
    var fDate = event + ' 00:00:00'
    this.fromDate = this.toTimestamp(fDate)
    if (this.fromDate > this.toDate) {

      var tDate = event + ' 23:59:59';
      this.toDate = this.toTimestamp(tDate)
      this.fromDate = this.fromDate;
      this.toDate = this.toDate;
    }

  }
  gettoDate() {
    var selectedDate = $("#toDate").datepicker('getDate');
    var event = formatDate(selectedDate, "yyyy-MM-dd", "en");

    var tDate = event + ' 23:59:59';
    this.toDate = this.toTimestamp(tDate)

    this.toDate = this.toDate;


  }

  filterReset() {
    this.gettoDate();
    this.getFromDate();
  }

  getFormatNumber(number) {
    let a = number + '';
    if (a.length == 1) {
      return '0' + number;
    } else if (a == '100') {
      return a;
    } else if (a.length > 2) {
      return a.substring(1, a.length);
    } else {
      return a;
    }
  }

  isTomorrow(date) {
    const tomorrow = new Date();
    const today = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.geDateFromat(tomorrow) === this.geDateFromat(date)) {
      return 'Tomorrow';
    } else if (this.geDateFromat(today) === this.geDateFromat(date)) {
      return 'Today';
    } else {
      return this.getDayFromat(date);
    }
  }

  geDateFromat(selectedDate) {
    return formatDate(selectedDate, "yyyy/MM/dd", "en");
  }

  getDayFromat(dayDate) {
    return formatDate(dayDate, "MMM dd", "en");
  }
}
