import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class MatkaDetailService {

  constructor(private http: HttpClient, private _sessionService: SessionService) { }
  endpoint = this._sessionService.endpoint;

  GetMarketDetail(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'event-money', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  saveTempBets(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'save-mtk-tmp-bet', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  getTempBets(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'get-mtk-temp-bet', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  getMatkaBets(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'get-mtk-bet', sdata, { headers: this._sessionService.setTokenHeader() });
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
    return this.http.post<any>(this.endpoint + 'delete-all-temp-bet', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  saveAllMatkaTempBets(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'save-mtk-bet', sdata, { headers: this._sessionService.setTokenHeader() });
  }

}