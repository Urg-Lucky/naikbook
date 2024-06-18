import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class AccountStatementService {

  constructor(private http: HttpClient, private _sessionService: SessionService) { }
  endpoint = this._sessionService.endpoint;

  getUserAccountStatement(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'statement', sdata, { headers: this._sessionService.setTokenHeader() });
  }

}