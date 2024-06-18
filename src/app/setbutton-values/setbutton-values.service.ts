import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';
@Injectable({
  providedIn: 'root'
})
export class SetbuttonValuesService {

  constructor(private http: HttpClient, public _sessionService: SessionService) { }
  endpoint = this._sessionService.endpoint;

  getDWRequestStatement(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'user-chat-list', sdata, { headers: this._sessionService.setTokenHeader() });
  }



  cancelRequest(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'my-deposit-cancel', sdata, { headers: this._sessionService.setTokenHeader() });
  }
}
