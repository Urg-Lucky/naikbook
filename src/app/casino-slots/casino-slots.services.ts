import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class CasinoSlotsService {

  constructor(private http: HttpClient, private _sessionService: SessionService) { }
  endpoint = this._sessionService.endpoint;

  getCasinoSlots(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'getCasinoListByCategory', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  GetSports(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'getSportOuterList', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  getProviderList() {
    return this.http.get<any>(this.endpoint + 'getmarchant', { headers: this._sessionService.setTokenHeader() });
  }

  getMatchByMarchent(sdata) {
    return this.http.post<any>(this.endpoint + 'getMatchByMarchent', sdata);
  }
}