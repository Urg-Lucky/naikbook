import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SessionService } from '../service/session.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private _sessionService: SessionService) { }
  endpoint = this._sessionService.endpoint;
  endpoint2 = this._sessionService.endpoint2;

  changePassword(user) {

    let httpParams = new HttpParams();
    Object.keys(user).forEach(function (key) {
      httpParams = httpParams.append(key, user[key]);
    });
    return this.http.post<any>(this.endpoint + 'update-info', user, { headers: this._sessionService.setTokenHeader() });
  }

  getGameLobby(sdata) {
    let httpParams = new HttpParams();
    Object.keys(sdata).forEach(function (key) {
      httpParams = httpParams.append(key, sdata[key]);
    });
    return this.http.post<any>(this.endpoint2 + 'game-lobby', sdata, { headers: this._sessionService.setTokenHeader() });
  }
}
