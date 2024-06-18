import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SessionService } from '../../service/session.service';
import { Router } from '@angular/router'

const MINUTES_UNITL_AUTO_LOGOUT = 10 // in mins
const CHECK_INTERVAL = 5000 // in ms
const STORE_KEY = 'lastAction';
@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    // val: any;
    // public getLastAction() {
    //     return parseInt(localStorage.getItem(STORE_KEY));
    // }
    // public setLastAction(lastAction: number) {
    //     localStorage.setItem(STORE_KEY, lastAction.toString());
    // }

    constructor(private http: HttpClient, private _sessionService: SessionService, private router: Router) {

        //this.check();
        //this.initListener();
        //this.initInterval();
        //localStorage.setItem(STORE_KEY, Date.now().toString());
    }
    endpoint = this._sessionService.endpoint;

    GetProfile() {
        return this.http.get<any>(this.endpoint + 'get_profile', { headers: this._sessionService.setTokenHeader() });
    }

    getRules() {
        return this.http.post<any>(this.endpoint + 'rule-list', '', { headers: this._sessionService.setAppHeader() });
    }

    updateRules(data) {
        return this.http.post<any>(this.endpoint + 'rules', data, { headers: this._sessionService.setTokenHeader() });
    }


    logout() {

        let httpParams = new HttpParams();
        return this.http.post<any>(this.endpoint + 'logout', httpParams, { headers: this._sessionService.setTokenHeader() });

    }


    updateTimeZone(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'zone-update', sdata, { headers: this._sessionService.setTokenHeader() });
    }


    dwrequestSave(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'my-deposit-request', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    userChatRequestSave(sdata) {
        let httpParams = new HttpParams();
        return this.http.post<any>(this.endpoint + 'comment-request', sdata, { headers: this._sessionService.setTokenHeaderMultiPart() });
    }

    // initListener() {
    //     document.body.addEventListener('click', () => this.reset());
    //     document.body.addEventListener('mouseover', () => this.reset());
    //     document.body.addEventListener('mouseout', () => this.reset());
    //     document.body.addEventListener('keydown', () => this.reset());
    //     document.body.addEventListener('keyup', () => this.reset());
    //     document.body.addEventListener('keypress', () => this.reset());
    //     window.addEventListener("storage", () => this.storageEvt());

    // }

    // reset() {

    //     console.log('date got by using events', Date.now());
    //     this.setLastAction(Date.now());
    //     console.log('store key', localStorage.getItem(STORE_KEY));

    // }

    // initInterval() {
    //     setInterval(() => {
    //         this.check();
    //     }, CHECK_INTERVAL);
    // }

    // check() {
    //     const now = Date.now();
    //     const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    //     const diff = timeleft - now;
    //     console.log('difference', diff)
    //     const isTimeout = diff < 0;

    //     if (isTimeout) {
    //         localStorage.clear();
    //         this.router.navigate(['./home']);
    //     }
    // }
    // storageEvt() {
    //     console.log("storage");
    //     this.val = localStorage.getItem(STORE_KEY);
    // }

}
