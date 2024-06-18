import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SessionService } from './session.service';
import { LoginServiceService } from './login-service.service';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { log } from 'console';
declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class SportServiceService {

    endpoint = this._sessionService.endpoint;
    _loading = false;

    public sideBarSelectedSeries: any = null;
    public sideBarSelectedSports: any = null;

    public callBalance = 1;

    matchForDashboard = null;
    public callType = 1;


    _selectedSport: string = "All";
    _selectedSportId = "";
    _selectedIcon: string;
    public _seriesId: any = 0;

    sportIDS = null;
    SportList: any;
    _serverTime: any;
    _ListMatchbySport: any = [];
    _LeftMenuMatch: any = [];
    _SeriesList: any = [];
    _ListMatch: any = [];
    _ListInPlayMatch: any = [];
    _ListUpcomingMatch = [];
    _ListMyMarketsMatch: any = [];
    _ListFavoriteMatch: any = [];
    _ListCasinoGames = [];
    oneClickShow: boolean;
    oneClickTV: boolean;
    isShowOneClick: boolean;
    stake2: any = {};
    FinalTeam: any = [];
    stakeIds: any = [];
    backArray: any = [];
    layArray: any = [];
    BackLayArray: any = [];
    TempArray: any = [];
    arrayObj: any = {};
    constructor(private http: HttpClient, private _sessionService: SessionService, public route: Router, public loginservice: LoginServiceService) {
        this._ListMatch.PopularMatches = [];
        this._ListMatch.InplayMatches = [];
        this._ListMatch._ListMyMarketsMatch = [];
        this._ListMatchbySport.UpCommingMatches = [];
        this._ListMatchbySport.InplayMatches = [];
        //this._ListCasinoGames.CasinoInplay = [];

    }

    getSports(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });
        return this.http.post<any>(this.endpoint + 'games-list', sdata, { headers: this._sessionService.setTokenHeader() });

    }
    getSeriesOuter(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'getSeriesOuterListBySportId', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getSeries(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'event-game-list', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getUserMyBetsList(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'my-bet-list', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getBanner(sdata) {
        return this.http.post<any>(this.endpoint + 'our-slide', sdata, { headers: this._sessionService.setTokenHeader() });
        //return this.http.post<any>(this.endpoint + 'our-slide');
    }
    getBannerMobile(sdata) {
        return this.http.post<any>(this.endpoint + 'our-slide-m', sdata, { headers: this._sessionService.setTokenHeader() });
        //return this.http.post<any>(this.endpoint + 'our-slide');
    }
    getUserProfitLossLMatchAndMarketWise(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'my-profit-loss', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getUserProfitLossLMatch(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'my-profit-round', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getMatchListForDashboard(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'game-profile', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getIndianSessionByMatchId(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'event-session', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getMatchListBySportIdAndSeriesId(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'event-game', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getSearchExchange(sdata) {
        return this.http.post<any>(this.endpoint + 'getSearchExchange', sdata, { headers: this._sessionService.setTokenHeader() })
    }
    getCasinoGameList() {
        return this.http.get<any>('https://lord999.com/api/game-list', { headers: this._sessionService.setTokenHeader() });
    }
    getScoreBySportAndMatchId(match_id) {

        return this.http.get<any>('https://score.jeoad.com/api/v1/getScore?matchId=' + match_id);
    }
    getBetsByMatchFancyORMarketeId(sdata) {

        return this.http.post<any>(this.endpoint + 'list-bt-ssn-mk', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getDefaultSetting() {
        return this.http.get<any>(this.endpoint + 'default-setting')
    }
    getCasinoBetsByMatchFancyORMarketeId(sdata) {

        return this.http.post<any>(this.endpoint + 'list-fn-match', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    getInplayMatchListBySportId(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'inplay-event', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getUpcomingMatchListBySportId(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'upcoming-event', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    getMyMarketsMatchListBySportId(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'my-event-list', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    getFavoriteMatchListBySportId(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'personal-games-list', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    updateFavoriteMatch(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'add-in-personal', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getMatchListBySeriesId(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });

        return this.http.post<any>(this.endpoint + 'game-event-list', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    saveBetData(sdata) {
        return this.http.post<any>(this.endpoint + 'save-bet', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    saveCasinoBetData(sdata) {
        return this.http.post<any>(this.endpoint + 'save-csn-bet', sdata, { headers: this._sessionService.setTokenHeader() });
    }

    saveFancyData(sdata) {
        return this.http.post<any>(this.endpoint + 'save-ssn-bet', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    saveFancyDataManual(sdata) {
        return this.http.post<any>(this.endpoint + 'save-ssn-bet-meter', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    saveFancyMLData(sdata) {
        return this.http.post<any>(this.endpoint + 'save-ssn-favourite', sdata, { headers: this._sessionService.setTokenHeader() });
    }
    getCasionLastResult(sdata) {
        return this.http.post<any>(this.endpoint + 'last-result', sdata, { headers: this._sessionService.setTokenHeader() })
    }

    GetSeriesBySportId(sport, loadSeries: boolean) {

        if (loadSeries) {
            this._SeriesList = [];
            this._selectedSport = sport.name;
            this._selectedIcon = sport.image;
            this._selectedSportId = sport.sport_id;
            var sdata = {
                "limit": 10,
                "sport_id": sport.sport_id,
                "pageno": 1
            }

            this.getSeries(sdata).subscribe(data => {
                if (!data.error) {
                    this._SeriesList = data.data;
                    //this.callFun(sport.sport_id);
                    //this.callTab(sport);

                }
            }, error => {

            })
        } else {
            setTimeout(() => {
                this._selectedSport = sport.name;
                this._selectedIcon = sport.image;
                this._selectedSportId = sport.sport_id;
                //this.callFun(sport.sport_id);
                //this.callTab(sport);
            }, 100);


        }

    }
    GetSeriesBySportIdOuter(sport, loadSeries: boolean) {
        if (loadSeries) {
            this._SeriesList = [];
            this._selectedSport = sport.name;
            this._selectedIcon = sport.image;
            this._selectedSportId = sport.sport_id;
            var sdata = {
                "limit": 10,
                "sport_id": sport.sport_id,
                "pageno": 1
            }

            this.getSeriesOuter(sdata).subscribe(data => {
                if (!data.error) {
                    this._SeriesList = data.data;
                    //this.callFun(sport.sport_id);
                    //this.callTab(sport);

                }
            }, error => {

            })
        } else {
            setTimeout(() => {
                this._selectedSport = sport.name;
                this._selectedIcon = sport.image;
                this._selectedSportId = sport.sport_id;
                //this.callFun(sport.sport_id);
                //this.callTab(sport);
            }, 100);


        }

    }

    resetSportData() {
        this._seriesId = 0;
        this.callType = 1;
        this._ListInPlayMatch = [];
        this._ListUpcomingMatch = [];
        this._ListMyMarketsMatch = [];
        this._ListFavoriteMatch = [];
        this._ListMatchbySport = [];
        this._ListMatchbySport.UpCommingMatches = [];
        this._ListMatchbySport.InplayMatches = [];
    }

    callFun(cls) {
        $(".sports-drop-bx").addClass('active');
        $(".sidenav2").addClass('active');
    }
    callTab(sport) {
        $('a[href="#' + sport.name + '"]').tab('show');
    }
    callTab2(sportname, sport_id) {
        this._selectedSport = sportname;
        this._selectedSportId = sport_id;
        $('a[href="#' + sportname + '"]').tab('show');
    }
    callTabName(sport) {
        this._seriesId = 0;
        $('a[href="#' + sport + '"]').tab('show');
    }
    callTabNameSport(sport) {
        this._seriesId = 0;
        $('a[href="#' + sport.name + '"]').tab('show');
        this._selectedSport = sport.name;
        this._selectedSportId = sport.sport_id;
    }


    timerForServerTime = null;

    stopServerTimerIncrement() {
        if (this.timerForServerTime != null) {
            clearTimeout(this.timerForServerTime);
            this.timerForServerTime = null;
        }
    }

    startServerTimerIncrement() {
        this.stopServerTimerIncrement();
        this.timerForServerTime = setTimeout(() => {
            if (!isNullOrUndefined(this._serverTime)) {
                this._serverTime++;
                if (this._selectedSportId == "222") {
                    this.startServerTimerIncrement();
                }
            }
        }, 1000);

    }

    GetMatchList(sportID, type) {
        if (this.matchForDashboard != null) {
            clearTimeout(this.matchForDashboard);
            this.matchForDashboard = null;
        }
        if (this.route.url == '/dashboard') {
            if (sportID == "" && this._selectedSport == "All" && type != 'home') {
                var sport = { "limit": 10, "pageno": 1 }
                this.stopServerTimerIncrement();
                this.getMatchListForDashboard(sport).subscribe(data => {
                    if (!data.error) {
                        this._serverTime = data.currentTime;
                        var result = data.data;
                        this.updateBetAllowTimeInResponse(result.InplayMatches)
                        if (this.callType == 1) {
                            this._ListMatch = data.data;
                        }
                        else {
                            this.setMatchData(result);
                        }

                        // this.callType = 2;
                        // this.GetMatchList(sportID, type);
                    }
                    this.matchForDashboard = setTimeout(() => {
                        this.GetMatchList(sportID, type);
                        this.callType++;
                    }, this.callType == 1 ? 0 : 15000);
                }, error => {
                    this.callType = 2;
                    this.GetMatchList(sportID, type);
                })
            }
            else if (this._selectedSport != "All" && type == 'home') {
                //sportID = this._selectedSportId;
                var sport1 = {
                    "limit": 10,
                    "pageno": 1,
                    "sport_id": sportID,
                    "series_id": this._seriesId,
                    "type": 'home'
                }

                this.getMatchListBySportIdAndSeriesId(sport1).subscribe(data => {

                    if (!data.error) {
                        this._serverTime = data.currentTime;
                        var result = data.data;
                        this.updateBetAllowTimeInResponse(result.UpCommingMatches);
                        this.updateBetAllowTimeInResponse(result.InplayMatches);
                        if (this.callType == 1) {
                            this._ListMatchbySport = data.data;
                        }
                        else {
                            this.setMatchDataForSport(result);
                        }

                        this._LeftMenuMatch = this._ListMatchbySport.InplayMatches.concat(this._ListMatchbySport.UpCommingMatches);

                        this.callType = 2;
                        if (this._selectedSportId == "222") {
                            this.startServerTimerIncrement();
                        }
                        this.sportIDS = sportID;
                        //this.GetMatchList(sportID, type);
                    }
                    this.matchForDashboard = setTimeout(() => {
                        this.GetMatchList(sportID, type);
                        this.callType++;
                    }, this.callType == 1 ? 0 : 15000);
                }, error => {
                    this.callType = 2;
                    this.GetMatchList(sportID, type);
                })
            }
        } else {
            this.stopServerTimerIncrement();
        }


    }

    resetMatch() {
        this._loading = true;
        this._ListMatchbySport.UpCommingMatches = [];
        this._ListMatchbySport.InplayMatches = [];
    }

    getseiresMatchsList(limit, sport_id) {
        this._loading = false;
        if (this.route.url == '/dashboard') {
            var sdata = { "limit": limit, "pageno": 1, "sport_id": sport_id, "series_id": 0, 'type': 'home' };
            //if (sport_id == 111) {
            this.getMatchListBySportIdAndSeriesId(sdata).subscribe(data => {
                if (this.matchForDashboard != null) {
                    clearTimeout(this.matchForDashboard);
                }

                if (!data.error) {
                    var result = data;;
                    if (!isNullOrUndefined(result)) {
                        //this._sportService.updateBetAllowTimeInResponse(result.UpCommingMatches)
                        this.setMatchDataHome(result);
                        this._serverTime = data.currentTime;
                        this._LeftMenuMatch = this._ListMatchbySport.InplayMatches.concat(this._ListMatchbySport.UpCommingMatches);

                    }
                }
                this._loading = false;
                if (this.sportIDS != null) {
                    this.sportIDS = sport_id;
                } else {
                    this.sportIDS = 4;
                }
                this.matchForDashboard = setTimeout(() => {
                    this.getseiresMatchsList(limit, this.sportIDS);
                    this.callType++;
                }, this.callType == 1 ? 0 : 15000);
                //this.sportsList = data;

            }, (error) => {
                this.callType = 2;
                this.getseiresMatchsList(limit, sport_id);
            });

            //} else {

            //}
        }
    }

    getCasinoGames() {
        this.getCasinoGameList().subscribe(data => {
            if (!data.error) {
                var result = data;
                if (!isNullOrUndefined(result)) {
                    this._ListCasinoGames = result.data;
                    this.sportIDS = 111;
                    // console.log(this._ListCasinoGames);
                    // for (let i = 0; i < this._ListCasinoGames.length; i++) {
                    //     var indx = this._ListCasinoGames.CasinoInplay.findIndex(x => x.match_id == this._ListCasinoGames[i].match_id);
                    //     if (indx > -1) {

                    //         this._ListCasinoGames.CasinoInplay[indx].Image = this._ListCasinoGames[i].Image
                    //     }
                    // }

                    // console.log(this._ListCasinoGames.CasinoInplay);

                }
            }
        });
    }
    GetMyMarketsMatchList(sportID) {

        if (this.matchForDashboard != null) {
            clearTimeout(this.matchForDashboard);
            this.matchForDashboard = null;
        }

        this.matchForDashboard = setTimeout(() => {
            var sport = {
                "sport_id": this._selectedSportId == "" ? 0 : this._selectedSportId
            }

            if (this.route.url == '/my-markets') {

                this.getMyMarketsMatchListBySportId(sport).subscribe(data => {

                    if (!data.error) {

                        this._serverTime = data.currentTime;
                        var result = data.data;
                        this.updateBetAllowTimeInResponse(result)

                        if (result != null) {
                            if (this.callType == 1) {
                                this._ListMyMarketsMatch = data.data;
                            }
                            else {
                                if (isNullOrUndefined(this._ListMyMarketsMatch)) {
                                    this._ListMyMarketsMatch = result;
                                } else if (this._ListMyMarketsMatch.length != result.length) {
                                    this._ListMyMarketsMatch = result;
                                } else {
                                    this.setMyMarketsMatchData(result);
                                }

                            }
                        }
                        else {
                            this._ListMyMarketsMatch = [];
                        }

                        $(".sidenav2").removeClass('active');
                        $(".sports-drop-bx").removeClass('active');
                        this.callType = 2;
                        this.GetMyMarketsMatchList(sportID);
                    }
                }, error => {
                    this.callType = 2;
                    this.GetMyMarketsMatchList(sportID);
                })


            }


        }, this.callType == 1 ? 0 : 2000);
    }

    setMyMarketsMatchData(result) {
        var favoriteMatch = result;
        if (favoriteMatch.length != this._ListMyMarketsMatch.length) {
            this._ListMyMarketsMatch = favoriteMatch;
        }
        else {
            for (let i = 0; i < favoriteMatch.length; i++) {
                var indx = this._ListMyMarketsMatch.findIndex(x => x.market_id == favoriteMatch[i].market_id);
                if (indx > -1) {
                    this._ListMyMarketsMatch[indx].backRateDiff = favoriteMatch[i].backRateDiff;
                    this._ListMyMarketsMatch[indx].InplayStatus = favoriteMatch[i].InplayStatus;
                    this._ListMyMarketsMatch[indx].IsFancyAllow = favoriteMatch[i].IsFancyAllow;
                    this._ListMyMarketsMatch[indx].BetAllowTimeBefore = favoriteMatch[i].BetAllowTimeBefore;
                    this._ListMyMarketsMatch[indx].favMatchID = favoriteMatch[i].favMatchID;
                    this._ListMyMarketsMatch[indx].IsBetAllow = favoriteMatch[i].IsBetAllow;
                    this._ListMyMarketsMatch[indx].layRateDiff = favoriteMatch[i].layRateDiff;
                    this._ListMyMarketsMatch[indx].matchVolumn = favoriteMatch[i].matchVolumn;
                    this._ListMyMarketsMatch[indx].runner_json = this.checkUpdatedData(this._ListMyMarketsMatch[indx].runner_json, favoriteMatch[i].runner_json);

                    this._ListMyMarketsMatch[indx].order_by = favoriteMatch[i].order_by;
                    this._ListMyMarketsMatch[indx].start_date = favoriteMatch[i].start_date;
                    this._ListMyMarketsMatch[indx].row_num = favoriteMatch[i].row_num;
                    this._ListMyMarketsMatch[indx].adminMessage = favoriteMatch[i].adminMessage;

                    this._ListMyMarketsMatch[indx].isDetail = favoriteMatch[i].isDetail;
                    this._ListMyMarketsMatch[indx].remainTime = favoriteMatch[i].remainTime;

                }

            }

        }
    }

    GetInlayMatchList(sportID) {
        console.log(sportID);
        if (this.matchForDashboard != null) {
            clearTimeout(this.matchForDashboard);
            this.matchForDashboard = null;
        }

        this.matchForDashboard = setTimeout(() => {
            var sport = {
                "limit": 10,
                "pageno": 1,
                "sport_id": this._selectedSportId == "" ? 0 : this._selectedSportId
            }

            if (this.route.url == '/inplay') {

                this.getInplayMatchListBySportId(sport).subscribe(data => {

                    if (!data.error) {

                        this._serverTime = data.currentTime;
                        var result = data.data;
                        this.updateBetAllowTimeInResponse(result)
                        if (result != null) {
                            if (this.callType == 1) {
                                this._ListInPlayMatch = data.data;
                            }
                            else {
                                if (this._ListInPlayMatch == undefined) {
                                    this._ListInPlayMatch = result;
                                }
                                else if (this._ListInPlayMatch.length != result.length) {
                                    this._ListInPlayMatch = result;
                                } else {
                                    this.setInplayMatchData(result);
                                }
                            }
                        }
                        else {
                            this._ListInPlayMatch = [];
                        }

                        if (this.sportIDS != null) {
                            this.sportIDS = sportID;
                        } else {
                            this.sportIDS = 4;
                        }
                        this.callType = 2;
                        this.GetInlayMatchList(sportID);
                    }
                }, error => {
                    this.callType = 2;
                    this.GetInlayMatchList(sportID);
                })


            }


        }, this.callType == 1 ? 0 : 15000);
    }

    GetUpcomingMatchList(sportID) {

        if (this.matchForDashboard != null) {
            clearTimeout(this.matchForDashboard);
            this.matchForDashboard = null;
        }

        this.matchForDashboard = setTimeout(() => {
            var sport = {
                "limit": 10,
                "pageno": 1,
                "sport_id": this._selectedSportId == "" ? 0 : this._selectedSportId
            }

            if (this.route.url == '/upcoming') {

                this.getUpcomingMatchListBySportId(sport).subscribe(data => {

                    if (!data.error) {

                        this._serverTime = data.currentTime;
                        var result = data.data;
                        this.updateBetAllowTimeInResponse(result)
                        if (result != null) {
                            if (this.callType == 1) {
                                this._ListUpcomingMatch = data.data;
                            }
                            else {
                                if (this._ListUpcomingMatch == undefined) {
                                    this._ListUpcomingMatch = result;
                                }
                                else if (this._ListUpcomingMatch.length != result.length) {
                                    this._ListUpcomingMatch = result;
                                } else {
                                    this.setUpcomingMatchData(result);
                                }
                            }
                        }
                        else {
                            this._ListUpcomingMatch = [];
                        }

                        this.callType = 2;
                        this.GetUpcomingMatchList(sportID);
                    }
                }, error => {
                    this.callType = 2;
                    this.GetUpcomingMatchList(sportID);
                })


            }


        }, this.callType == 1 ? 0 : 15000);
    }

    setInplayMatchData(result) {
        var favoriteMatch = result;
        if (favoriteMatch.length != this._ListInPlayMatch.length) {
            this._ListInPlayMatch = favoriteMatch;
        }
        else {
            for (let i = 0; i < favoriteMatch.length; i++) {
                var indx = this._ListInPlayMatch.findIndex(x => x.market_id == favoriteMatch[i].market_id);
                if (indx > -1) {
                    this._ListInPlayMatch[indx].backRateDiff = favoriteMatch[i].backRateDiff;
                    this._ListInPlayMatch[indx].InplayStatus = favoriteMatch[i].InplayStatus;
                    this._ListInPlayMatch[indx].IsFancyAllow = favoriteMatch[i].IsFancyAllow;
                    this._ListInPlayMatch[indx].BetAllowTimeBefore = favoriteMatch[i].BetAllowTimeBefore;
                    this._ListInPlayMatch[indx].favMatchID = favoriteMatch[i].favMatchID;
                    this._ListInPlayMatch[indx].IsBetAllow = favoriteMatch[i].IsBetAllow;
                    this._ListInPlayMatch[indx].layRateDiff = favoriteMatch[i].layRateDiff;
                    this._ListInPlayMatch[indx].matchVolumn = favoriteMatch[i].matchVolumn;
                    this._ListInPlayMatch[indx].runner_json = this.checkUpdatedData(this._ListInPlayMatch[indx].runner_json, favoriteMatch[i].runner_json);

                    this._ListInPlayMatch[indx].order_by = favoriteMatch[i].order_by;
                    this._ListInPlayMatch[indx].start_date = favoriteMatch[i].start_date;
                    this._ListInPlayMatch[indx].row_num = favoriteMatch[i].row_num;
                    this._ListInPlayMatch[indx].adminMessage = favoriteMatch[i].adminMessage;

                    this._ListInPlayMatch[indx].isDetail = favoriteMatch[i].isDetail;
                    this._ListInPlayMatch[indx].remainTime = favoriteMatch[i].remainTime;

                }
            }

        }
    }

    setUpcomingMatchData(result) {
        var favoriteMatch = result;
        if (favoriteMatch.length != this._ListUpcomingMatch.length) {
            this._ListUpcomingMatch = favoriteMatch;
        }
        else {
            for (let i = 0; i < favoriteMatch.length; i++) {
                var indx = this._ListUpcomingMatch.findIndex(x => x.market_id == favoriteMatch[i].market_id);
                if (indx > -1) {
                    this._ListUpcomingMatch[indx].backRateDiff = favoriteMatch[i].backRateDiff;
                    this._ListUpcomingMatch[indx].InplayStatus = favoriteMatch[i].InplayStatus;
                    this._ListUpcomingMatch[indx].IsFancyAllow = favoriteMatch[i].IsFancyAllow;
                    this._ListUpcomingMatch[indx].BetAllowTimeBefore = favoriteMatch[i].BetAllowTimeBefore;
                    this._ListUpcomingMatch[indx].favMatchID = favoriteMatch[i].favMatchID;
                    this._ListUpcomingMatch[indx].IsBetAllow = favoriteMatch[i].IsBetAllow;
                    this._ListUpcomingMatch[indx].layRateDiff = favoriteMatch[i].layRateDiff;
                    this._ListUpcomingMatch[indx].matchVolumn = favoriteMatch[i].matchVolumn;
                    this._ListUpcomingMatch[indx].runner_json = this.checkUpdatedData(this._ListUpcomingMatch[indx].runner_json, favoriteMatch[i].runner_json);

                    this._ListUpcomingMatch[indx].order_by = favoriteMatch[i].order_by;
                    this._ListUpcomingMatch[indx].start_date = favoriteMatch[i].start_date;
                    this._ListUpcomingMatch[indx].row_num = favoriteMatch[i].row_num;
                    this._ListUpcomingMatch[indx].adminMessage = favoriteMatch[i].adminMessage;

                    this._ListUpcomingMatch[indx].isDetail = favoriteMatch[i].isDetail;
                    this._ListUpcomingMatch[indx].remainTime = favoriteMatch[i].remainTime;

                }
            }

        }
    }
    GetFavoriteMatchList(sportID) {

        if (this.matchForDashboard != null) {
            clearTimeout(this.matchForDashboard);
            this.matchForDashboard = null;
        }

        this.matchForDashboard = setTimeout(() => {
            var sport = {
                "limit": 10,
                "pageno": 1,
                "sport_id": this._selectedSportId == "" ? 0 : this._selectedSportId
            }

            if (this.route.url == '/favorite') {
                this.getFavoriteMatchListBySportId(sport).subscribe(data => {

                    if (!data.error) {

                        this._serverTime = data.currentTime;
                        var result = data.data;
                        this.updateBetAllowTimeInResponse(result)
                        if (this.callType == 1) {
                            this._ListFavoriteMatch = data.data;
                        }
                        else {
                            this.setFavoriteMatchData(result);
                        }

                        $(".sidenav2").removeClass('active');
                        $(".sports-drop-bx").removeClass('active');

                        this.callType = 2;
                        this.GetFavoriteMatchList(sportID);
                    }
                }, error => {
                    this.callType = 2;
                    this.GetFavoriteMatchList(sportID);
                })
            }
        }, this.callType == 1 ? 0 : 3000);
    }

    setFavoriteMatchData(result) {
        var favoriteMatch = result;
        if (favoriteMatch.length != this._ListFavoriteMatch.length) {
            this._ListFavoriteMatch = favoriteMatch;
        }
        else {
            for (let i = 0; i < favoriteMatch.length; i++) {
                var indx = this._ListFavoriteMatch.findIndex(x => x.market_id == favoriteMatch[i].market_id);
                if (indx > -1) {
                    this._ListFavoriteMatch[indx].backRateDiff = favoriteMatch[i].backRateDiff;
                    this._ListFavoriteMatch[indx].InplayStatus = favoriteMatch[i].InplayStatus;
                    this._ListFavoriteMatch[indx].IsFancyAllow = favoriteMatch[i].IsFancyAllow;
                    this._ListFavoriteMatch[indx].BetAllowTimeBefore = favoriteMatch[i].BetAllowTimeBefore;
                    this._ListFavoriteMatch[indx].favMatchID = favoriteMatch[i].favMatchID;
                    this._ListFavoriteMatch[indx].IsBetAllow = favoriteMatch[i].IsBetAllow;
                    this._ListFavoriteMatch[indx].layRateDiff = favoriteMatch[i].layRateDiff;
                    this._ListFavoriteMatch[indx].matchVolumn = favoriteMatch[i].matchVolumn;
                    this._ListFavoriteMatch[indx].runner_json = this.checkUpdatedData(this._ListFavoriteMatch[indx].runner_json, favoriteMatch[i].runner_json);
                    this._ListFavoriteMatch[indx].order_by = favoriteMatch[i].order_by;
                    this._ListFavoriteMatch[indx].start_date = favoriteMatch[i].start_date;
                    this._ListFavoriteMatch[indx].row_num = favoriteMatch[i].row_num;
                    this._ListFavoriteMatch[indx].adminMessage = favoriteMatch[i].adminMessage;

                    this._ListFavoriteMatch[indx].isDetail = favoriteMatch[i].isDetail;
                    this._ListFavoriteMatch[indx].remainTime = favoriteMatch[i].remainTime;
                }
                // if (i == this._ListMatch.PopularMatches.length - 1) {

                // }
            }

        }
    }

    updateFavorite(match) {

        if (match.favMatchID == undefined) {
            match.favMatchID = match.match_id;
        }
        var mdata = {
            "market_id": match.market_id,
            "isFav": match.favMatchID > 0 ? false : true,
            "match_id": match.match_id
        }
        this._loading = true;
        this.updateFavoriteMatch(mdata).subscribe(data => {
            if (!data.error) {
                this._sessionService.notifier.notify('success', data.message);
                match.favMatchID = match.favMatchID > 0 ? 0 : match.match_id;
            }
            else {
                this._sessionService.notifier.notify('error', data.message);
            }
            this._loading = false;
        }, error => {
            this._loading = false;
        })
    }


    timeConverter(UNIX_timestamp) {
        var c = parseInt(this._sessionService.get('timezone_value'));
        var date = new Date((UNIX_timestamp) * 1000);
        var localUtcMillisec = date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + (c * 1000)
        date = new Date(localUtcMillisec);
        return date;
    }


    timeDifference(date1, date2) {
        var difference = date1 - date2;

        if (difference > 0) {
            var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
            difference -= daysDifference * 1000 * 60 * 60 * 24

            var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
            difference -= hoursDifference * 1000 * 60 * 60

            var minutesDifference = Math.floor(difference / 1000 / 60);
            difference -= minutesDifference * 1000 * 60

            var secondsDifference = Math.floor(difference / 1000);

            return (daysDifference > 0 ? daysDifference + ' day (s)' : "") + (hoursDifference > 0 ? hoursDifference + 'h ' : "") + minutesDifference + 'm ' + secondsDifference + 's ';
        }
        else {
            return "Inplay";
        }

    }

    setMatchData(result) {
        var InplayMatches = result.InplayMatches;
        //var PopularMatches = result.PopularMatches;
        if (InplayMatches.length != this._ListMatch.InplayMatches.length) {
            this._ListMatch.InplayMatches = InplayMatches;
        }
        else {
            for (let i = 0; i < InplayMatches.length; i++) {
                var indx = this._ListMatch.InplayMatches.findIndex(x => x.market_id == InplayMatches[i].market_id);
                if (indx > -1) {
                    this._ListMatch.InplayMatches[indx].backRateDiff = InplayMatches[i].backRateDiff;
                    this._ListMatch.InplayMatches[indx].InplayStatus = InplayMatches[i].InplayStatus;
                    this._ListMatch.InplayMatches[indx].IsFancyAllow = InplayMatches[i].IsFancyAllow;
                    this._ListMatch.InplayMatches[indx].BetAllowTimeBefore = InplayMatches[i].BetAllowTimeBefore;
                    this._ListMatch.InplayMatches[indx].favMatchID = InplayMatches[i].favMatchID;
                    this._ListMatch.InplayMatches[indx].IsBetAllow = InplayMatches[i].IsBetAllow;
                    this._ListMatch.InplayMatches[indx].layRateDiff = InplayMatches[i].layRateDiff;
                    this._ListMatch.InplayMatches[indx].matchVolumn = InplayMatches[i].matchVolumn;
                    this._ListMatch.InplayMatches[indx].runner_json = this.checkUpdatedData(this._ListMatch.InplayMatches[indx].runner_json, InplayMatches[i].runner_json);
                    this._ListMatch.InplayMatches[indx].order_by = InplayMatches[i].order_by;
                    this._ListMatch.InplayMatches[indx].start_date = InplayMatches[i].start_date;
                    this._ListMatch.InplayMatches[indx].row_num = InplayMatches[i].row_num;
                    this._ListMatch.InplayMatches[indx].adminMessage = InplayMatches[i].adminMessage;
                    this._ListMatch.InplayMatches[indx].remainTime = InplayMatches[i].remainTime;
                }
            }
        }


        // if (PopularMatches.length != this._ListMatch.PopularMatches.length) {
        //     this._ListMatch.PopularMatches = PopularMatches;
        // }
        // else {
        //     for (let i = 0; i < PopularMatches.length; i++) {
        //         var indx = this._ListMatch.PopularMatches.findIndex(x => x.market_id == PopularMatches[i].market_id);
        //         if (indx > -1) {
        //             this._ListMatch.PopularMatches[indx].backRateDiff = PopularMatches[i].backRateDiff;
        //             this._ListMatch.PopularMatches[indx].InplayStatus = PopularMatches[i].InplayStatus;
        //             this._ListMatch.PopularMatches[indx].IsFancyAllow = PopularMatches[i].IsFancyAllow;
        //             this._ListMatch.PopularMatches[indx].BetAllowTimeBefore = PopularMatches[i].BetAllowTimeBefore;
        //             this._ListMatch.PopularMatches[indx].favMatchID = PopularMatches[i].favMatchID;
        //             this._ListMatch.PopularMatches[indx].IsBetAllow = PopularMatches[i].IsBetAllow;
        //             this._ListMatch.PopularMatches[indx].layRateDiff = PopularMatches[i].layRateDiff;
        //             this._ListMatch.PopularMatches[indx].matchVolumn = PopularMatches[i].matchVolumn;
        //             this._ListMatch.PopularMatches[indx].runner_json = this.checkUpdatedData(this._ListMatch.PopularMatches[indx].runner_json, PopularMatches[i].runner_json);
        //             this._ListMatch.PopularMatches[indx].order_by = PopularMatches[i].order_by;
        //             this._ListMatch.PopularMatches[indx].start_date = PopularMatches[i].start_date;
        //             this._ListMatch.PopularMatches[indx].row_num = PopularMatches[i].row_num;
        //             this._ListMatch.PopularMatches[indx].adminMessage = PopularMatches[i].adminMessage;
        //             this._ListMatch.PopularMatches[indx].isDetail = PopularMatches[i].isDetail;
        //             this._ListMatch.PopularMatches[indx].remainTime = PopularMatches[i].remainTime;
        //         }
        //     }

        // }


    }

    setMatchDataHome(result) {
        var InplayMatches = result.data.InplayMatches;
        var UpCommingMatches = result.data.UpCommingMatches;
        if (InplayMatches.length != this._ListMatchbySport.InplayMatches.length) {
            this._ListMatchbySport.InplayMatches = InplayMatches;
        }
        else {
            for (let i = 0; i < InplayMatches.length; i++) {
                var indx = this._ListMatchbySport.InplayMatches.findIndex(x => x.market_id == InplayMatches[i].market_id);
                if (indx > -1) {
                    this._ListMatchbySport.InplayMatches[indx].backRateDiff = InplayMatches[i].backRateDiff;
                    this._ListMatchbySport.InplayMatches[indx].InplayStatus = InplayMatches[i].InplayStatus;
                    this._ListMatchbySport.InplayMatches[indx].IsFancyAllow = InplayMatches[i].IsFancyAllow;

                    this._ListMatchbySport.InplayMatches[indx].BetAllowTimeBefore = InplayMatches[i].BetAllowTimeBefore;
                    this._ListMatchbySport.InplayMatches[indx].favMatchID = InplayMatches[i].favMatchID;
                    this._ListMatchbySport.InplayMatches[indx].IsBetAllow = InplayMatches[i].IsBetAllow;
                    this._ListMatchbySport.InplayMatches[indx].layRateDiff = InplayMatches[i].layRateDiff;
                    this._ListMatchbySport.InplayMatches[indx].matchVolumn = InplayMatches[i].matchVolumn;
                    this._ListMatchbySport.InplayMatches[indx].runner_json = this.checkUpdatedData(this._ListMatchbySport.InplayMatches[indx].runner_json, InplayMatches[i].runner_json);

                    this._ListMatchbySport.InplayMatches[indx].order_by = InplayMatches[i].order_by;
                    this._ListMatchbySport.InplayMatches[indx].start_date = InplayMatches[i].start_date;
                    if (!isNullOrUndefined(InplayMatches[i].end_date)) {
                        this._ListMatchbySport.InplayMatches[indx].end_date = InplayMatches[i].end_date;
                    }
                    if (!isNullOrUndefined(InplayMatches[i].draw_date)) {
                        this._ListMatchbySport.InplayMatches[indx].draw_date = InplayMatches[i].draw_date;
                    }
                    this._ListMatchbySport.InplayMatches[indx].row_num = InplayMatches[i].row_num;
                    this._ListMatchbySport.InplayMatches[indx].adminMessage = InplayMatches[i].adminMessage;
                    this._ListMatchbySport.InplayMatches[indx].inPlay = true;
                    var btBefor = this._ListMatchbySport.InplayMatches[indx].BetAllowTimeBefore;

                    this._serverTime = result.currentTime;
                    var timeStamp = this.timeDifference((this._ListMatchbySport.InplayMatches[indx].start_date - btBefor) * 1000, this._serverTime * 1000);
                    if (timeStamp == 'Inplay') {
                        this._ListMatchbySport.InplayMatches[indx].isDetail = true;
                        this._ListMatchbySport.InplayMatches[indx].remainTime = timeStamp;
                    } else {
                        this._ListMatchbySport.InplayMatches[indx].isDetail = false;
                        this._ListMatchbySport.InplayMatches[indx].remainTime = timeStamp;
                    }
                }
            }

        }



        if (UpCommingMatches.length != this._ListMatchbySport.UpCommingMatches.length) {
            this._ListMatchbySport.UpCommingMatches = UpCommingMatches;
        }
        else {
            for (let i = 0; i < UpCommingMatches.length; i++) {
                var indx = this._ListMatchbySport.UpCommingMatches.findIndex(x => x.market_id == UpCommingMatches[i].market_id);
                if (indx > -1) {
                    this._ListMatchbySport.UpCommingMatches[indx].backRateDiff = UpCommingMatches[i].backRateDiff;
                    this._ListMatchbySport.UpCommingMatches[indx].InplayStatus = UpCommingMatches[i].InplayStatus;
                    this._ListMatchbySport.UpCommingMatches[indx].IsFancyAllow = UpCommingMatches[i].IsFancyAllow;
                    this._ListMatchbySport.UpCommingMatches[indx].BetAllowTimeBefore = UpCommingMatches[i].BetAllowTimeBefore;
                    this._ListMatchbySport.UpCommingMatches[indx].favMatchID = UpCommingMatches[i].favMatchID;
                    this._ListMatchbySport.UpCommingMatches[indx].IsBetAllow = UpCommingMatches[i].IsBetAllow;
                    this._ListMatchbySport.UpCommingMatches[indx].layRateDiff = UpCommingMatches[i].layRateDiff;
                    this._ListMatchbySport.UpCommingMatches[indx].matchVolumn = UpCommingMatches[i].matchVolumn;
                    this._ListMatchbySport.UpCommingMatches[indx].runner_json = this.checkUpdatedData(this._ListMatchbySport.UpCommingMatches[indx].runner_json, UpCommingMatches[i].runner_json);

                    this._ListMatchbySport.UpCommingMatches[indx].order_by = UpCommingMatches[i].order_by;
                    this._ListMatchbySport.UpCommingMatches[indx].start_date = UpCommingMatches[i].start_date;
                    this._ListMatchbySport.UpCommingMatches[indx].row_num = UpCommingMatches[i].row_num;
                    this._ListMatchbySport.UpCommingMatches[indx].adminMessage = UpCommingMatches[i].adminMessage;
                    this._ListMatchbySport.UpCommingMatches[indx].inPlay = false;
                    var btBefor = this._ListMatchbySport.UpCommingMatches[indx].BetAllowTimeBefore;

                    this._serverTime = result.currentTime;
                    var timeStamp = this.timeDifference((this._ListMatchbySport.UpCommingMatches[indx].start_date - btBefor) * 1000, this._serverTime * 1000);
                    if (timeStamp == 'Inplay') {
                        this._ListMatchbySport.UpCommingMatches[indx].isDetail = true;
                        this._ListMatchbySport.UpCommingMatches[indx].remainTime = timeStamp;
                    } else {
                        this._ListMatchbySport.UpCommingMatches[indx].isDetail = false;
                        this._ListMatchbySport.UpCommingMatches[indx].remainTime = timeStamp;
                    }
                    //this._ListMatchbySport.UpCommingMatches[indx].isDetail = UpCommingMatches[i].isDetail;
                    //this._ListMatchbySport.UpCommingMatches[indx].remainTime = UpCommingMatches[i].remainTime;

                }
            }
        }

    }
    CheckSportExist(sId) {
        var isExist = false;
        if (this._ListMatchbySport.UpCommingMatches != undefined) {
            for (var i = 0; i < this._ListMatchbySport.UpCommingMatches.length; i++) {
                if (this._ListMatchbySport.UpCommingMatches[i].sport_id == sId) {
                    isExist = true;
                    break;
                }
            }

        }
        return isExist;
    }
    public checkUpdatedData(oldData, newData) {

        if ((oldData != null && newData == null) || (oldData == null && newData != null)) {

            return newData;

        }

        for (let index = 0; index < newData.length; index++) {
            const newSelection = newData[index];
            if (oldData != null && oldData.length > index) {
                const oldSelection = oldData[index];

                if (!isNullOrUndefined(newSelection.ex)) {

                    if (!isNullOrUndefined(newSelection.ex.availableToBack)) {
                        for (let index2 = 0; index2 < newSelection.ex.availableToBack.length; index2++) {
                            const newBackBhav = newSelection.ex.availableToBack[index2];
                            try {
                                if (oldSelection != null && oldSelection.ex.availableToBack.length > index2) {
                                    const oldBackBhav = oldSelection.ex.availableToBack[index2];
                                    if ((newBackBhav.price + "") != (oldBackBhav.price + "")) {
                                        if (newBackBhav.price > oldBackBhav.price) {
                                            newBackBhav.priceChanged = 1;
                                        } else if (newBackBhav.price < oldBackBhav.price) {
                                            newBackBhav.priceChanged = 2;
                                        } else {
                                            newBackBhav.priceChanged = 0;
                                        }
                                    }
                                }
                            } catch {

                            }


                        }
                    }

                    if (!isNullOrUndefined(newSelection.ex.availableToLay)) {
                        for (let index2 = 0; index2 < newSelection.ex.availableToLay.length; index2++) {
                            const newBackBhav = newSelection.ex.availableToLay[index2];
                            try {
                                if (oldSelection != null && oldSelection.ex.availableToLay.length > index2) {
                                    const oldBackBhav = oldSelection.ex.availableToLay[index2];
                                    if ((newBackBhav.price + "") != (oldBackBhav.price + "")) {
                                        if (newBackBhav.price > oldBackBhav.price) {
                                            newBackBhav.priceChanged = 1;
                                        } else if (newBackBhav.price < oldBackBhav.price) {
                                            newBackBhav.priceChanged = 2;
                                        } else {
                                            newBackBhav.priceChanged = 0;
                                        }
                                    }
                                }
                            } catch {

                            }

                        }
                    }

                }
            }

        }

        return newData;
    }

    updateBetAllowTimeInResponse(list) {
        if (isNullOrUndefined(list)) {
            return;
        }
        for (let indx = 0; indx < list.length; indx++) {

            var btBefor = list[indx].BetAllowTimeBefore;
            if ((list[indx].start_date - btBefor) > this._serverTime) {
                list[indx].isDetail = false;
                var timeStamp = this.timeDifference((list[indx].start_date - btBefor) * 1000, this._serverTime * 1000);
                list[indx].remainTime = timeStamp;
            }
            else {
                list[indx].isDetail = true;
                list[indx].remainTime = "Inplay"
            }

        }

    }


    setMatchDataForSport(result) {
        var InplayMatches = result.InplayMatches;
        var UpCommingMatches = result.UpCommingMatches;
        if (InplayMatches.length != this._ListMatchbySport.InplayMatches.length) {
            this._ListMatchbySport.InplayMatches = InplayMatches;
        }
        else {
            for (let i = 0; i < InplayMatches.length; i++) {
                var indx = this._ListMatchbySport.InplayMatches.findIndex(x => x.market_id == InplayMatches[i].market_id);
                if (indx > -1) {
                    this._ListMatchbySport.InplayMatches[indx].backRateDiff = InplayMatches[i].backRateDiff;
                    this._ListMatchbySport.InplayMatches[indx].InplayStatus = InplayMatches[i].InplayStatus;
                    this._ListMatchbySport.InplayMatches[indx].IsFancyAllow = InplayMatches[i].IsFancyAllow;

                    this._ListMatchbySport.InplayMatches[indx].BetAllowTimeBefore = InplayMatches[i].BetAllowTimeBefore;
                    this._ListMatchbySport.InplayMatches[indx].favMatchID = InplayMatches[i].favMatchID;
                    this._ListMatchbySport.InplayMatches[indx].IsBetAllow = InplayMatches[i].IsBetAllow;
                    this._ListMatchbySport.InplayMatches[indx].layRateDiff = InplayMatches[i].layRateDiff;
                    this._ListMatchbySport.InplayMatches[indx].matchVolumn = InplayMatches[i].matchVolumn;
                    this._ListMatchbySport.InplayMatches[indx].runner_json = this.checkUpdatedData(this._ListMatchbySport.InplayMatches[indx].runner_json, InplayMatches[i].runner_json);

                    this._ListMatchbySport.InplayMatches[indx].order_by = InplayMatches[i].order_by;
                    this._ListMatchbySport.InplayMatches[indx].start_date = InplayMatches[i].start_date;
                    if (!isNullOrUndefined(InplayMatches[i].end_date)) {
                        this._ListMatchbySport.InplayMatches[indx].end_date = InplayMatches[i].end_date;
                    }
                    if (!isNullOrUndefined(InplayMatches[i].draw_date)) {
                        this._ListMatchbySport.InplayMatches[indx].draw_date = InplayMatches[i].draw_date;
                    }
                    this._ListMatchbySport.InplayMatches[indx].row_num = InplayMatches[i].row_num;
                    this._ListMatchbySport.InplayMatches[indx].adminMessage = InplayMatches[i].adminMessage;
                    this._ListMatchbySport.InplayMatches[indx].remainTime = InplayMatches[i].remainTime;

                }
            }

        }


        if (UpCommingMatches.length != this._ListMatchbySport.UpCommingMatches.length) {
            this._ListMatchbySport.UpCommingMatches = UpCommingMatches;
        }
        else {
            for (let i = 0; i < UpCommingMatches.length; i++) {
                var indx = this._ListMatchbySport.UpCommingMatches.findIndex(x => x.market_id == UpCommingMatches[i].market_id);
                if (indx > -1) {
                    this._ListMatchbySport.UpCommingMatches[indx].backRateDiff = UpCommingMatches[i].backRateDiff;
                    this._ListMatchbySport.UpCommingMatches[indx].InplayStatus = UpCommingMatches[i].InplayStatus;
                    this._ListMatchbySport.UpCommingMatches[indx].IsFancyAllow = UpCommingMatches[i].IsFancyAllow;
                    this._ListMatchbySport.UpCommingMatches[indx].BetAllowTimeBefore = UpCommingMatches[i].BetAllowTimeBefore;
                    this._ListMatchbySport.UpCommingMatches[indx].favMatchID = UpCommingMatches[i].favMatchID;
                    this._ListMatchbySport.UpCommingMatches[indx].IsBetAllow = UpCommingMatches[i].IsBetAllow;
                    this._ListMatchbySport.UpCommingMatches[indx].layRateDiff = UpCommingMatches[i].layRateDiff;
                    this._ListMatchbySport.UpCommingMatches[indx].matchVolumn = UpCommingMatches[i].matchVolumn;
                    this._ListMatchbySport.UpCommingMatches[indx].runner_json = this.checkUpdatedData(this._ListMatchbySport.UpCommingMatches[indx].runner_json, UpCommingMatches[i].runner_json);

                    this._ListMatchbySport.UpCommingMatches[indx].order_by = UpCommingMatches[i].order_by;
                    this._ListMatchbySport.UpCommingMatches[indx].start_date = UpCommingMatches[i].start_date;
                    this._ListMatchbySport.UpCommingMatches[indx].row_num = UpCommingMatches[i].row_num;
                    this._ListMatchbySport.UpCommingMatches[indx].adminMessage = UpCommingMatches[i].adminMessage;

                    this._ListMatchbySport.UpCommingMatches[indx].isDetail = UpCommingMatches[i].isDetail;
                    this._ListMatchbySport.UpCommingMatches[indx].remainTime = UpCommingMatches[i].remainTime;

                }


            }

        }
    }
    updateOneClickStack(sdata) {
        let httpParams = new HttpParams();
        Object.keys(sdata).forEach(function (key) {
            httpParams = httpParams.append(key, sdata[key]);
        });
        return this.http.post<any>(this.endpoint + 'single-click-update-amount', sdata, { headers: this._sessionService.setTokenHeader() });
    }


    AssignKeyInit(SelectionId, MatchId, MarketId) {
        var UId = SelectionId + "_" + MatchId + "_" + MarketId; //for uniqueness we combine selction id and match id
        var obj = { 'placeName': '', 'TeamW': 0, 'TeamL': 0, 'UId': UId, 'MatchId': MatchId, 'MarketId': MarketId };
        var ind = this.FinalTeam.findIndex(x => x.UId == UId);
        if (ind == -1) {
            this.FinalTeam.push(obj);
        }
        var obj1 = { 'MatchId': MatchId, 'UId': UId, 'MarketId': MarketId };
        var ind1 = this.stakeIds.findIndex(x => x.UId == UId);
        if (ind1 == -1) {

            this.stakeIds.push(obj1);
            this.stake2['field_' + UId] = 0;
            this.stake2['loss_' + UId] = 0;
            this.stake2['win_' + UId] = 0;
        }
    }
    ResetP_L(back) {
        var ind = this.FinalTeam.findIndex(x => x.UId == back.unique_id);
        if (ind > -1) {
            this.FinalTeam[ind].TeamW = 0;
            this.FinalTeam[ind].TeamL = 0;
        }
    }
    CalculateProfitLoss(back, type) {

        if (type == 0) {
            this.ResetP_L(back);//it will call during remove or cross;
            if (this.BackLayArray.length == 0) {
                this.FinalCalCulation(back.match_id, back.market_id);
            }
            else {
                var filteredTeam = this.BackLayArray.filter(function (element) {
                    return element.match_id === back.match_id && element.market_id === back.market_id;
                });
                for (var i = 0; i < filteredTeam.length; i++) {
                    this.FinalCalCulation(filteredTeam[i].match_id, filteredTeam[i].market_id);
                }
                if (filteredTeam.length == 0) {
                    this.FinalCalCulation(back.match_id, back.market_id);
                }
            }

        }
        for (var i = 0; i < this.stakeIds.length; i++) {
            var ind = this.BackLayArray.findIndex(x => x.unique_id == this.stakeIds[i].UId)
            if (ind > -1) {
                this.stake2['field_' + this.stakeIds[i].UId] = 0;
                this.stake2['loss_' + this.stakeIds[i].UId] = 0;
                this.stake2['win_' + this.stakeIds[i].UId] = 0;
                this.CalCulateWinLoss(this.stakeIds[i].UId, back);
            }
            else {
                //this.RemainCalculation(this.stakeIds[i],back);
            }
        }

    }
    CalCulateWinLoss(UId, back) {

        var recorde = this.BackLayArray;
        var sum = 0;
        var isSame = true;
        for (var j = 0; j < recorde.length; j++) {
            var ind = recorde.findIndex(x => x.unique_id == UId)
            if (ind > -1) {
                if (recorde[j].unique_id == UId) {

                    if (isNaN(recorde[j].TWin) || recorde[j].TWin == undefined) {
                        recorde[j].TWin = 0;

                    }
                    if (isNaN(recorde[j].TLoss) || recorde[j].TLoss == undefined) {
                        recorde[j].TLoss = 0;

                    }
                    if (recorde[j].type == 1) {
                        recorde[j].Bwin = recorde[j].p_l;
                        recorde[j].Bloss = -recorde[j].stack;
                        //recorde[j].TWin+=recorde[j].Bwin 
                        //recorde[j].TLoss+=recorde[j].Bloss

                    }
                    else {
                        recorde[j].Lwin = recorde[j].stack;
                        recorde[j].Lloss = -recorde[j].p_l;
                        //recorde[j].TWin+=recorde[j].Lwin;
                        //recorde[j].TLoss+=recorde[j].Lloss;
                    }
                    //this.stake2['field_'+UId]+= recorde[j].Bwin + recorde[j].Lloss;
                    this.stake2['win_' + UId] += recorde[j].Bwin + recorde[j].Lloss;
                    this.stake2['loss_' + UId] += recorde[j].Bloss + recorde[j].Lwin;
                    this.SetWinLoss(recorde[j]);

                }
                else {
                    if (recorde[j].type == 1) {
                        recorde[j].Bwin = recorde[j].p_l;
                        recorde[j].Bloss = -recorde[j].stack;

                        //recorde[j].TWin+=recorde[j].Bwin 
                        //recorde[j].TLoss+=recorde[j].Bloss
                    }
                    else {
                        recorde[j].Lwin = recorde[j].stack;
                        recorde[j].Lloss = -recorde[j].p_l;
                        //recorde[j].TWin+=recorde[j].Lwin;
                        //recorde[j].TLoss+=recorde[j].Lloss;
                    }
                }
            }	//if end
            else {
                //this.stake2['field_'+UId]+=back.isback==0 ? -back.stake : back.stake;
            }

        }
    }
    SetWinLoss(team) {

        var ind = this.FinalTeam.findIndex(x => x.UId == team.unique_id);
        if (ind > -1) {
            this.FinalTeam[ind].placeName = team.placeName;
            this.FinalTeam[ind].TeamW = this.stake2['win_' + team.unique_id];
            this.FinalTeam[ind].TeamL = this.stake2['loss_' + team.unique_id];
            this.FinalCalCulation(this.FinalTeam[ind].MatchId, this.FinalTeam[ind].MarketId);
        }
    }
    FinalCalCulation(MatchId, MarketId) {

        var filteredTeam = this.FinalTeam.filter(function (element) {
            return element.MatchId === MatchId && element.MarketId === MarketId;
        });
        var filteredStakeIds = this.stakeIds.filter(function (element) {
            return element.MatchId === MatchId && element.MarketId === MarketId;
        });
        if (filteredTeam != undefined && filteredStakeIds != undefined) {
            this.FinalResult(filteredTeam, filteredStakeIds);
        }

    }


    FinalResult(FinalTeam, stakeIds) {
        if (FinalTeam.length == stakeIds.length) {
            for (var j = 0; j < FinalTeam.length; j++) {
                if (FinalTeam[j] != undefined) {
                    var totalLoss = 0;
                    for (var l = 0; l < FinalTeam.length; l++) {
                        if (l != j) {
                            totalLoss += FinalTeam[l].TeamL;
                        }

                    }

                    this.stake2['field_' + stakeIds[j].UId] = FinalTeam[j].TeamW + totalLoss;
                }
                else {
                    if (stakeIds[j] != undefined) {
                        var totalLoss = 0;
                        for (var l = 0; l < stakeIds.length; l++) {
                            if (l != j) {
                                totalLoss += FinalTeam[l].TeamL;
                            }

                        }

                        this.stake2['field_' + stakeIds[j].UId] = FinalTeam[j].TeamW + totalLoss;

                    }

                }
            }

        }
    }



    AddBackOrLay(obj) {

        this.arrayObj = obj;
        this.arrayObj.stack = 0;
        this.arrayObj.Lwin = 0;
        this.arrayObj.Lloss = 0;
        this.arrayObj.Bwin = 0;
        this.arrayObj.Bloss = 0;

        this.arrayObj.unique_id = obj.selectionId + "_" + obj.match_id + "_" + obj.market_id;

        this.BackLayArray = [];
        this.BackLayArray.push(this.arrayObj);
        for (var j = 0; j < this.stakeIds.length; j++) {
            this.stake2['field_' + this.stakeIds[j].UId] = 0;
            this.stake2['field_' + this.stakeIds[j].UId] = 0;
            this.stake2['loss_' + this.stakeIds[j].UId] = 0;
            this.stake2['win_' + this.stakeIds[j].UId] = 0;
        }
        for (var t = 0; t < this.FinalTeam.length; t++) {
            this.FinalTeam[t].TeamW = 0;
            this.FinalTeam[t].TeamL = 0;
        }

    }

    removeBackLay(back) {

        var ind1 = this.BackLayArray.findIndex(x => x.unique_id == back.unique_id);
        if (ind1 > -1) {

            this.BackLayArray.splice(ind1, 1);
            if (this.stakeIds != undefined) {
                this.CalculateProfitLoss(back, 0);

            }

        }

    }

    getbal = null;
    getBalance = function () {
        if (this.getbal != null) {
            clearTimeout(this.getbal);
            this.getbal = null;
        }
        this.getbal = setTimeout(() => {

            this.loginservice.getbalance().subscribe((response) => {
                if (!this._sessionService.internetAvaliable) {
                    this._sessionService.internetAvaliable = true;
                }

                if (!response.error) {
                    var result = response.data;

                    this._sessionService.set('avater', result.avatar);
                    this._sessionService.set('liability', result.liability);
                    this._sessionService.set('balance', result.balance);
                    this._sessionService.set('bonus_balance', result.bonus_balance);
                    this._sessionService.set('profit_loss', result.profit_loss);
                    this._sessionService.set('freechips', result.freechips);
                    this._sessionService.set('timezone_value', result.timezone_value);
                    this._sessionService.set('site_message', result.site_message);
                }
                this.callBalance = 2;
                this.getBalance();
            }, (error) => {
                this._sessionService.printLog(error.error);
                if (error.status == 401) {
                    if (this.route.url != "/home") {
                        this._sessionService.notifier.notify('error', error.error.message);
                        this.route.navigate(['/home']);
                    }
                    return;
                }
                this.callBalance = 2;
                this.getBalance();
                if (error.error instanceof ProgressEvent) {
                    if (error.status == 0) {
                        if (this._sessionService.internetAvaliable) {
                            this._sessionService.internetAvaliable = false;

                        }
                        return;
                    }
                }
                if (!this._sessionService.internetAvaliable) {
                    this._sessionService.internetAvaliable = true;
                }

            })
        }, this.callBalance == 1 ? 0 : 15000);

    }


    public needBlink(data, selectionPosition, backlayposition, type) {
        if (!this._sessionService.oddsBlinkAvailable) {
            return '';
        }
        if (isNullOrUndefined(data) || isNullOrUndefined(data.runner_json)) {
            return '';
        }
        if (data.runner_json.length <= selectionPosition) {
            return '';
        }

        if (isNullOrUndefined(data.runner_json[selectionPosition].ex)) {
            return '';
        }

        if (type == 'back') {
            if (isNullOrUndefined(data.runner_json[selectionPosition].ex.availableToBack)) {
                return '';
            }

            if (data.runner_json[selectionPosition].ex.availableToBack.length <= backlayposition) {
                return '';
            }

            if (isNullOrUndefined(data.runner_json[selectionPosition].ex.availableToBack[backlayposition].priceChanged)) {
                return '';
            }

            var change = data.runner_json[selectionPosition].ex.availableToBack[backlayposition].priceChanged;
            if (change != 0) {

                setTimeout(() => {
                    data.runner_json[selectionPosition].ex.availableToBack[backlayposition].priceChanged = 0;
                }, 200);

                if (change == 1) {
                    return 'bg-blink';
                } else if (change == 2) {
                    return 'bg-blink';
                } else {
                    return '';
                }
                // if (change == 1) {
                //     return 'bg-blue-blink';
                // } else if (change == 2) {
                //     return 'bg-red-blink';
                // } else {
                //     return '';
                // }
            }
            return '';

        } else if (type == 'lay') {
            if (isNullOrUndefined(data.runner_json[selectionPosition].ex.availableToLay)) {
                return '';
            }

            if (data.runner_json[selectionPosition].ex.availableToLay.length <= backlayposition) {
                return '';
            }

            if (isNullOrUndefined(data.runner_json[selectionPosition].ex.availableToLay[backlayposition].priceChanged)) {
                return '';
            }

            var change = data.runner_json[selectionPosition].ex.availableToLay[backlayposition].priceChanged;
            if (change != 0) {
                setTimeout(() => {
                    data.runner_json[selectionPosition].ex.availableToLay[backlayposition].priceChanged = 0;
                }, 200);

                if (change == 1) {
                    return 'bg-blink';
                } else if (change == 2) {
                    return 'bg-blink';
                } else {
                    return '';
                }
            }
            return '';
        }

        return 0;

    }




}