import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private http: HttpClient, private _sessionService: SessionService) { }
  endpoint = this._sessionService.endpoint;

  GetCricketMarketList(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'getMatchDetailMarketList', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  getScoreBySportAndMatchId(sdata) {
    return this.http.post<any>(this.endpoint + 'get-cricket-detail', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  getScoreBySportId(match_id) {

    return this.http.get<any>('https://score.jeoad.com/api/v1/getScore?matchId=' + match_id);
  }
  GetSports(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'getSportOuterList', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  timeConverter(UNIX_timestamp) {
    var c = parseInt('19800');
    var date = new Date((UNIX_timestamp) * 1000);
    var localUtcMillisec = date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + (c * 1000)
    date = new Date(localUtcMillisec);
    return date;
  }

  getSessionByMatchId(sdata) {
    // let httpParams = new HttpParams();
    // Object.keys(sdata).forEach(function (key) {
    //   httpParams = httpParams.append(key, sdata[key]);
    // });

    return this.http.get<any>(this.endpoint + 'get-match-session?match_id=' + sdata);
  }

  GetLiveTvAndScore(sdata, sport_id) {
    return this.http.get<any>(this.endpoint + 'get-match-tv?match_id=' + sdata + '&sport_id=' + sport_id);
  }

  getProviderList() {
    return this.http.get<any>(this.endpoint + 'getmarchant', { headers: this._sessionService.setTokenHeader() });
  }
}