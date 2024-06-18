import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class TitliDetailService {

  constructor(private http: HttpClient, private _sessionService: SessionService) { }
  endpoint = this._sessionService.endpoint;

  GetMarketDetail(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'event-money-tt', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  saveTitliBets(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'save-tt-bets', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  getTitliBets(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'get-tt-bet', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  getTitliResult(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'get-tt-res', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  titliResultDeclare(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'tt-res-declare', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  deleteMatkaTempBets(betid) {
    //console.log(betid);
    let httpParams = new HttpParams();
    Object.keys(betid).forEach(function (key) {
      httpParams = httpParams.append(key, betid[key]);
    });
    return this.http.post<any>(this.endpoint + 'delete-mtk-temp-bet', betid, { headers: this._sessionService.setTokenHeader() });
  }

  deleteMatkaAllTempBets(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'deleteMatkaAllTempBetData', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  saveAllMatkaTempBets(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'save-mtk-bet', sdata, { headers: this._sessionService.setTokenHeader() });
  }

}