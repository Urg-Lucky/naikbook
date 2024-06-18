import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';

@Injectable({
    providedIn: 'root'
})
export class SupportRequestService {

    constructor(private http: HttpClient, private _sessionService: SessionService) { }
    endpoint = this._sessionService.endpoint;

    getSupportRequestStatement(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });
        return this.http.post<any>(this.endpoint + 'comment-request-list', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    cancelRequest(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });
        return this.http.post<any>(this.endpoint + 'comment-request-cancel', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    sendNewMessage(sdata) {
        return this.http.post<any>(this.endpoint + 'user-chat-req', sdata, { headers: this._sessionService.setTokenHeaderMultiPart() });
    }


    loadNewMessage(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });
        return this.http.post<any>(this.endpoint + 'user-chat', sdata, { headers: this._sessionService.setTokenHeader() });
    }
}
