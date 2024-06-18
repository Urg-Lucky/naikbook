import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';
@Injectable({
  providedIn: 'root'
})
export class DepositPaymentOptionService {

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

  getAccountDetail(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'customer-details', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  dwrequestSave(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint + 'my-deposit-request', sdata, { headers: this._sessionService.setTokenHeader() });
  }

  uploadPanFile(sdata) {
    let httpParams = new HttpParams();
    return this.http.post<any>(this.endpoint + 'uploadDepositeFile', sdata, { headers: this._sessionService.setTokenHeaderMultiPart() });
  }
}
