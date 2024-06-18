import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';

@Injectable({
    providedIn: 'root'
})
export class UpcomingService {

    constructor(private http: HttpClient, private _sessionService: SessionService) { }
    endpoint = this._sessionService.endpoint;

    timeConverter(UNIX_timestamp) {
        var c = parseInt(this._sessionService.get('timezone_value'));
        var date = new Date((UNIX_timestamp) * 1000);
        var localUtcMillisec = date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + (c * 1000)
        date = new Date(localUtcMillisec);
        return date;
    }

    GetSports(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });
        return this.http.post<any>(this.endpoint + 'getSportOuterList', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    getseiresMatchsList(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });
        return this.http.post<any>(this.endpoint + 'getseiresMatchsList', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    GetCupMarketList(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });
        return this.http.post<any>(this.endpoint + 'getCupsMatchDetails', sdata, { headers: this._sessionService.setTokenHeader() });
    }
}
