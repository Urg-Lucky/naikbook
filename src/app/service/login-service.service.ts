import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
  HttpParams,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { SessionService } from "./session.service";

@Injectable({
  providedIn: "root",
})
export class LoginServiceService {
  endpoint = this._sessionService.endpoint;

  constructor(
    private http: HttpClient,
    private _sessionService: SessionService
  ) {}

  loginSave(user): Observable<any> {
    return this.http.post(this.endpoint + "login", user, {
      headers: this._sessionService.setAppHeader(),
    });
  }
  saveUser(user): Observable<any> {
    return this.http.post(this.endpoint + "sign-up", user, {
      headers: this._sessionService.setAppHeader(),
    });
  }
  IsUserExist(user): Observable<any> {
    return this.http.post(this.endpoint + "check-avaliable", user, {
      headers: this._sessionService.setAppHeader(),
    });
  }
  sendOtp(mobile): Observable<any> {
    return this.http.post(this.endpoint + "sendOtp", mobile, {
      headers: this._sessionService.setAppHeader(),
    });
  }
  // getbalance() {
  //   return this.http.post<any>(this.endpoint + "wallet-balance", "", {
  //     headers: this._sessionService.setTokenHeader(),
  //   });
  // }
  // getbalance() {
  //   return this.http.post<any>(this.endpoint + "wallet-balance", "", {
  //     headers: this._sessionService.setTokenHeader(),
  //   });
  // }
  getbalance() {
    return this.http.post<any>(this.endpoint + "wallet-balance", "", {
      headers: this._sessionService.setTokenHeader(),
    });
  }
  // getbalncelucky() {
  //   return this.http.post<any>(this.endpoint + "wallet-balance", "", {
  //     headers: this._sessionService.setTokenHeader(),
  //   });
  // }
  globalSetting(): Observable<any> {
    return this.http.post(this.endpoint + "info", "", {
      headers: this._sessionService.setAppHeader(),
    });
  }

  getOuterSports(): Observable<any> {
    return this.http.post(this.endpoint + "our-sport", "", {
      headers: this._sessionService.setAppHeader(),
    });
  }

  getOuterNews(): Observable<any> {
    return this.http.post(this.endpoint + "our-news", "", {
      headers: this._sessionService.setAppHeader(),
    });
  }

  getOuterSlider(): Observable<any> {
    return this.http.post(this.endpoint + "our-slide", "", {
      headers: this._sessionService.setAppHeader(),
    });
  }

  getOuterPages(): Observable<any> {
    return this.http.post(this.endpoint + "our-page", "", {
      headers: this._sessionService.setAppHeader(),
    });
  }

  outerPagesDetails(data): Observable<any> {
    return this.http.post(this.endpoint + "our-page-show", data, {
      headers: this._sessionService.setAppHeader(),
    });
  }

  getOuterDashboard(): Observable<any> {
    return this.http.post(this.endpoint + "our-home", "", {
      headers: this._sessionService.setAppHeader(),
    });
  }

  getOuterDashboardBySports(data): Observable<any> {
    return this.http.post(this.endpoint + "our-home-sport", data, {
      headers: this._sessionService.setAppHeader(),
    });
  }
  sendSupportData(data): Observable<any> {
    return this.http.post(this.endpoint + "sendSupportData", data, {
      headers: this._sessionService.setAppHeader(),
    });
  }
  getstate(): Observable<any> {
    return this.http.get(this.endpoint + "getstateList", {
      headers: this._sessionService.setAppHeader(),
    });
  }

  getCities(data): Observable<any> {
    return this.http.post(this.endpoint + "getCityList", data, {
      headers: this._sessionService.setAppHeader(),
    });
  }
  CheckUserMobileExist(user): Observable<any> {
    return this.http.post(this.endpoint + "userexistornotmobile", user, {
      headers: this._sessionService.setAppHeader(),
    });
  }
  CheckUserNameExist(data): Observable<any> {
    return this.http.post(this.endpoint + "check-avaliable", data, {
      headers: this._sessionService.setAppHeader(),
    });
  }
  CheckValidOtp(mobile): Observable<any> {
    return this.http.post(this.endpoint + "CheckValidOtp", mobile, {
      headers: this._sessionService.setAppHeader(),
    });
  }

  getCasinoList(): Observable<any> {
    const url = "https://yolo96bet.com/api/v5/getCasinoList";
    const limit = 20;
    const body = { limit: limit };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.post(url, body, { headers: headers });
  }

  getbannerList(): Observable<any> {
    const url = "https://yolo96bet.com/api/v5/our-slide";
    const domain_id = 17;
    const body = { domain_id: domain_id };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.post(url, body, { headers: headers });
  }
  Loginfrom(data: any) {
    let url = `https://yolo96bet.com/api/v5/login`;
    return this.http.post(url, data);
  }

  SingUPd(data: any) {
    let url = `https://yolo96bet.com/api/v5/sign-up`;
    return this.http.post(url, data);
  }
}
