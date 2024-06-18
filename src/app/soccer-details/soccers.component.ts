import { Component, OnInit, OnDestroy } from "@angular/core";
import { SessionService } from "../service/session.service";
import { SportServiceService } from "../service/sport-service.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { SoccersService } from "./soccers.services";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { browserRefresh } from "../app.component";
import { isNullOrUndefined } from "util";

declare var $: any;
@Component({
  selector: "app-details",
  templateUrl: "./soccers.component.html",
  styleUrls: ["./soccers.component.css"],
})
export class SoccersComponent implements OnInit, OnDestroy {
  oneClickShow = false;
  matchScore: NodeJS.Timer = null;
  callType: any = 1;
  scoreMatch: any = null;
  MatchBetList: any = [];
  matchForSoccer: any;
  loading = false;
  _serverTime: any;
  soccerBetMatchMarkets: any = [];
  cupBetUserSportsDetails: any = [];
  UserOneClickStack: any = [];
  BookerMakerMarketManual: any = null;
  safeSrc: SafeResourceUrl = null;
  PlayTv1 = "";
  PlayTv2 = "";
  PlayTv3 = "";
  PlayTv4 = "";
  safeGrapicSrc: SafeResourceUrl;
  isBetFairbet: any;
  isBetFairEditStack = false;
  matchStack: any = [];
  isEditStack = false;
  isShow: any;
  isShowBM: any;
  isOneEdit = false;
  isOneActive: any;
  selectedOneClick = 0;
  betFairMarket: any = [];
  matchOddsShow = true;
  bookMakerShow = true;
  betFairMarketShow = true;
  isActiveClassAll = true;
  isActiveClassMO = false;
  isActiveClassO = false;
  isActiveClassBM = false;
  isDashboard = "";
  siteMessage = "";
  oneClickStackUpdate = new FormGroup({
    stackvalue1: new FormControl("", [Validators.required, Validators.min(1)]),
    stackvalue2: new FormControl("", [Validators.required, Validators.min(1)]),
    stackvalue3: new FormControl("", [Validators.required, Validators.min(1)]),
  });
  oneMatchStack = new FormGroup({
    matchStack1: new FormControl(null, [
      Validators.required,
      Validators.min(1),
    ]),
    matchStack2: new FormControl(null, [
      Validators.required,
      Validators.min(1),
    ]),
    matchStack3: new FormControl(null, [
      Validators.required,
      Validators.min(1),
    ]),
    matchStack4: new FormControl(null, [
      Validators.required,
      Validators.min(1),
    ]),
    matchStack5: new FormControl(null, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  constructor(
    public _sessionService: SessionService,
    public _cricketServices: SoccersService,
    private sanitizer: DomSanitizer,
    public _sportService: SportServiceService,
    public route: Router
  ) {
    this.MatchBetList.MatchAndBetfair = [];
    this.MatchBetList.MatchFancy = [];
    this.callType = 1;
    //this.getMatchScoreBySportAndMatchId();
    this.getMatchBetAndFancyBetList();
  }

  ngOnDestroy() {
    if (this.pipSub != null) {
      this.pipSub.unsubscribe();
    }
  }

  pipSub: any = null;

  ngOnInit() {
    if (browserRefresh) {
      this._sessionService.gotoLoginPage();
      return;
    }
    this.showAllMarkets("all");
    this._sportService.oneClickShow = false;
    this.pipSub = this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.safeSrc = null;
        this.PlayTv1 = "";
        this.PlayTv2 = "";
        this.PlayTv3 = "";
        this.PlayTv4 = "";
        this.safeGrapicSrc = null;
        this.soccerBetMatchMarkets = [];
        this.scoreMatch = [];
        this.MatchBetList = [];
        this.betFairMarket = [];
        this.BookerMakerMarketManual = null;
        this.MatchBetList.MatchAndBetfair = [];
        this.MatchBetList.MatchFancy = [];
        this.callType = 1;
        //this.getMatchScoreBySportAndMatchId();
        this.getMatchBetAndFancyBetList();
        this._sportService.callBalance = 1;
        this._sportService.getBalance();
      });
    this._sportService.isShowOneClick = true;
    this.GetSoccerMarketList();
    this._sportService.callBalance = 1;
    this._sportService.getBalance();

    if (this.route.url == "/dashboard") {
      this.isDashboard = "dash_yes";
    } else {
      this.isDashboard = "dash_no";
    }
    this.siteMessage = this._sessionService.get("site_message");
  }

  updateOdds(type, cuprenners) {
    if (type == "min") {
      if (cuprenners.odds > 0) {
        cuprenners.odds = (parseFloat(cuprenners.odds) - 0.01).toFixed(2);
      }
    } else if (type == "max") {
      cuprenners.odds = (parseFloat(cuprenners.odds) + 0.01).toFixed(2);
    }
    this.updatePL(cuprenners);
  }

  updateMatchStack() {
    if (!this.oneMatchStack.invalid) {
      this._sportService._loading = true;
      var stackDetail = this.oneMatchStack.value;
      var matchStack =
        stackDetail.matchStack1 +
        "," +
        stackDetail.matchStack2 +
        "," +
        stackDetail.matchStack3 +
        "," +
        stackDetail.matchStack4 +
        "," +
        stackDetail.matchStack5;
      var isduplicate = this.checkDuplicate(matchStack);
      if (isduplicate) {
        this._sessionService.notifier.notify(
          "error",
          "Duplicate value is not allow."
        );
        this._sportService._loading = false;
      } else {
        let tdata = {
          one_click_stack: "0",
          match_stack: matchStack,
          sport_id: this._sessionService.get("sport_id"),
        };
        this.UserOneClickStack = tdata.one_click_stack.split(",");
        this._sportService.updateOneClickStack(tdata).subscribe(
          (data) => {
            if (!data.error) {
              this._sessionService.notifier.notify(
                "success",
                "Successfully Updated"
              );
              this.isEditStack = false;
              this.isBetFairEditStack = false;
              this.isShow = -1;
              this.isBetFairbet = -1;
            }
            this._sportService._loading = false;
          },
          (error) => {
            this._sportService._loading = false;
            this._sessionService.printLog(error.error);
            if (error.error instanceof ProgressEvent) {
              if (error.status == 0) {
                this._sessionService.notifier.notify(
                  "error",
                  "Internet not available."
                );
                return;
              }
            }
            this._sessionService.notifier.notify("error", error.message);
          }
        );
      }
    }
  }

  checkDuplicate(matchStack) {
    var isexist = false;
    var arrStack = matchStack.split(",");
    var arr = [];
    for (let i = 0; i < arrStack.length; i++) {
      arr.push(parseInt(arrStack[i]));
    }
    var sorted_arr = arr.sort();
    for (var i = 0; i < arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        isexist = true;
        return isexist;
      }
    }
  }
  getMatchScoreBySportAndMatchId() {
    if (this.matchScore != null) {
      clearTimeout(this.matchScore);
    }

    if (
      this._sessionService.get("match_id") != undefined &&
      this._sessionService.get("sport_id") != undefined
    ) {
      this.matchScore = setTimeout(
        () => {
          if (this.route.url == "/soccer-details") {
            var sdata = {
              match_id: this._sessionService.get("match_id"),
              sport_id: this._sessionService.get("sport_id"),
            };
            this._sportService.getScoreBySportAndMatchId(sdata).subscribe(
              (data) => {
                if (!data.error) {
                  if (data.data != null && data.data.length > 0) {
                    this.scoreMatch = data.data[0];
                  }
                  this.getMatchScoreBySportAndMatchId();
                }
              },
              (error) => {
                this.getMatchScoreBySportAndMatchId();
              }
            );
          }
        },
        this.callType == 1 ? 0 : 1000
      );
    } else {
      this.route.navigate(["/dashboard"]);
    }
  }

  getMatchBetAndFancyBetList() {
    if (
      this._sessionService.get("match_id") != undefined &&
      this._sessionService.get("sport_id") != undefined
    ) {
      if (this.route.url == "/soccer-details") {
        var sdata = {
          limit: 10,
          match_id: this._sessionService.get("match_id"),
          market_id: "0",
          fancy_id: 0,
          pageno: 1,
        };
        this._sportService.getBetsByMatchFancyORMarketeId(sdata).subscribe(
          (data) => {
            if (!data.error) {
              this.MatchBetList = data.data;
            }
          },
          (error) => {}
        );
      }
    } else {
      this.route.navigate(["/dashboard"]);
    }
  }
  getColor(inv) {
    if (parseInt(inv) >= 0) {
      if (parseInt(inv) > 0) {
        return "green";
      } else {
        return "grey";
      }
    } else if (inv == "W") {
      return "red";
    }
  }
  updateDataOneClick() {
    this._sportService._loading = true;
    let tdata = {
      one_click_stack:
        this.oneClickStackUpdate.value.stackvalue1 +
        "," +
        this.oneClickStackUpdate.value.stackvalue2 +
        "," +
        this.oneClickStackUpdate.value.stackvalue3,
      match_stack: "0",
      sport_id: this._sessionService.get("sport_id"),
    };
    this.UserOneClickStack = tdata.one_click_stack.split(",");
    var oneStack =
      this.oneClickStackUpdate.value.stackvalue1 +
      "," +
      this.oneClickStackUpdate.value.stackvalue2 +
      "," +
      this.oneClickStackUpdate.value.stackvalue3;
    var isduplicate = this.checkDuplicate(oneStack);
    if (isduplicate) {
      this._sessionService.notifier.notify(
        "error",
        "Duplicate value is not allow."
      );
      this._sportService._loading = false;
    } else {
      this._sportService.updateOneClickStack(tdata).subscribe(
        (data) => {
          if (!data.error) {
            this._sessionService.notifier.notify(
              "success",
              "Successfully Updated"
            );
            this.selectedOneClick = 0;
            this.isOneActive = -1;
            this.GetSoccerMarketList();
            this._sportService._loading = false;
            this.isOneEdit = false;
          }
        },
        (error) => {
          this._sportService._loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify(
                "error",
                "Internet not available."
              );
              return;
            }
          }
          this._sessionService.notifier.notify("error", error.message);
        }
      );
    }
  }
  showAllMarkets(show) {
    if (show == "all") {
      this.matchOddsShow = true;
      this.betFairMarketShow = true;
      this.isActiveClassAll = true;
      this.isActiveClassMO = false;
      this.isActiveClassO = false;
      this.isActiveClassBM = false;
      this.bookMakerShow = true;
    } else if (show == "matchOddsShow") {
      this.matchOddsShow = true;
      this.bookMakerShow = false;
      this.betFairMarketShow = false;
      this.isActiveClassAll = false;
      this.isActiveClassMO = true;
      this.isActiveClassO = false;
      this.isActiveClassBM = false;
    } else if (show == "bookmakers") {
      this.matchOddsShow = false;
      this.betFairMarketShow = false;
      this.isActiveClassAll = false;
      this.isActiveClassMO = false;
      this.isActiveClassO = false;
      this.isActiveClassBM = true;
      this.bookMakerShow = true;
    } else if (show == "other") {
      this.matchOddsShow = false;
      this.betFairMarketShow = true;
      this.isActiveClassAll = false;
      this.isActiveClassMO = false;
      this.isActiveClassO = true;
      this.isActiveClassBM = false;
      this.bookMakerShow = false;
    } else {
      this.matchOddsShow = true;
      this.betFairMarketShow = true;
      this.isActiveClassAll = true;
      this.isActiveClassMO = true;
      this.isActiveClassO = true;
      this.isActiveClassBM = true;
      this.bookMakerShow = true;
    }
  }
  removeTimeOut() {
    window.clearTimeout(this.matchForSoccer);
    this.matchForSoccer = null;
  }
  getSelectTv(value) {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
  GetSoccerMarketList() {
    try {
      this.matchForSoccer = setTimeout(
        () => {
          if (this.route.url == "/soccer-details") {
            var sdata = {
              match_id: this._sessionService.get("match_id"),
              sport_id: this._sessionService.get("sport_id"),
            };
            this._cricketServices.GetSoccerMarketList(sdata).subscribe(
              (data) => {
                if (!data.error) {
                  var result = data.data;
                  if (isNullOrUndefined(result.MatchDetails.match_id)) {
                    this._sessionService.gotoDashboard();
                    return;
                  }

                  this._serverTime = data.currentTime;
                  this.cupBetUserSportsDetails = result.UserSportSettings[0];
                  this.matchStack =
                    this.cupBetUserSportsDetails.match_stack.split(",");
                  this.UserOneClickStack =
                    this.cupBetUserSportsDetails.one_click_stack.split(",");
                  if (result.MatchDetails != null) {
                    if (this.safeGrapicSrc == null) {
                      this.safeGrapicSrc =
                        this.sanitizer.bypassSecurityTrustResourceUrl(
                          "https://stream.1ex99.in/sportRadarScore?eventId=" +
                            result.MatchDetails.match_id
                        );
                    }

                    if (this.safeSrc == null) {
                      if (!isNullOrUndefined(result.MatchDetails.MainTV)) {
                        this.safeSrc =
                          this.sanitizer.bypassSecurityTrustResourceUrl(
                            result.MatchDetails.MainTV
                          );
                      }
                      if (!isNullOrUndefined(result.MatchDetails.match_id)) {
                        //this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result.MatchDetails.MainTV);
                        this.safeSrc =
                          this.sanitizer.bypassSecurityTrustResourceUrl(
                            "https://stream.1ex99.in/tv2?EventId=" +
                              result.MatchDetails.match_id
                          );
                      } else {
                        if (!isNullOrUndefined(result.MatchDetails.tv_id)) {
                          if (this.safeSrc == null) {
                            this.safeSrc =
                              this.sanitizer.bypassSecurityTrustResourceUrl(
                                "https://stream.1ex99.in/tv2?EventId=" +
                                  result.MatchDetails.tv_id
                              );
                          }
                        }
                        if (!isNullOrUndefined(result.MatchDetails.PlayTv1)) {
                          this.PlayTv1 = result.MatchDetails.PlayTv1;
                          if (this.safeSrc == null) {
                            this.safeSrc =
                              this.sanitizer.bypassSecurityTrustResourceUrl(
                                this.PlayTv1
                              );
                          }
                        }
                        if (result.MatchDetails.PlayTv2 != "") {
                          this.PlayTv2 = result.MatchDetails.PlayTv2;
                          if (this.safeSrc == null) {
                            this.safeSrc =
                              this.sanitizer.bypassSecurityTrustResourceUrl(
                                this.PlayTv2
                              );
                          }
                        }
                        if (result.MatchDetails.PlayTv3 != "") {
                          this.PlayTv3 = result.MatchDetails.PlayTv3;
                          if (this.safeSrc == null) {
                            this.safeSrc =
                              this.sanitizer.bypassSecurityTrustResourceUrl(
                                this.PlayTv3
                              );
                          }
                        }
                        if (result.MatchDetails.PlayTv4 != "") {
                          this.PlayTv4 = result.MatchDetails.PlayTv4;
                          if (this.safeSrc == null) {
                            this.safeSrc =
                              this.sanitizer.bypassSecurityTrustResourceUrl(
                                this.PlayTv4
                              );
                          }
                        }
                      }
                    }
                    if (this.callType == 1) {
                      this.soccerBetMatchMarkets = result.MatchDetails;
                      /************************* BookerMakerMarketManual **********************/
                      if (result.bm.market_id != undefined) {
                        this.BookerMakerMarketManual = result.bm;
                      } else {
                        this.BookerMakerMarketManual = null;
                      }

                      if (this.BookerMakerMarketManual != null) {
                        this.setcupBetMatchDataBookManual(result.bm);
                      }
                      // this.cupBetUserSportsDetails=result.UserSportSettings[0];
                      // this.UserOneClickStack=this.cupBetUserSportsDetails.one_click_stack.split(',');
                      this.setcupBetMatchData(result.MatchDetails);
                      for (
                        let i = 0;
                        i < this.soccerBetMatchMarkets.runner_json.length;
                        i++
                      ) {
                        this._sportService.AssignKeyInit(
                          this.soccerBetMatchMarkets.runner_json[i].selectionId,
                          this.soccerBetMatchMarkets.match_id,
                          this.soccerBetMatchMarkets.market_id
                        );
                      }

                      if (this.BookerMakerMarketManual != null) {
                        for (
                          let i = 0;
                          i < this.BookerMakerMarketManual.runner_json.length;
                          i++
                        ) {
                          this._sportService.AssignKeyInit(
                            this.BookerMakerMarketManual.runner_json[i]
                              .selectionId,
                            this.BookerMakerMarketManual.match_id,
                            this.BookerMakerMarketManual.market_id
                          );
                        }
                      }
                    } else {
                      if (this.soccerBetMatchMarkets == undefined) {
                        this.soccerBetMatchMarkets = result.MatchDetails;
                      } else if (
                        this.soccerBetMatchMarkets.market_id !=
                        result.MatchDetails.market_id
                      ) {
                        this.soccerBetMatchMarkets = result.MatchDetails;
                      }
                      this.setcupBetMatchData(result.MatchDetails);

                      /******************************** BookerMakerMarketManual *******************/
                      if (
                        this.BookerMakerMarketManual == undefined ||
                        this.BookerMakerMarketManual == null
                      ) {
                        if (result.bm.market_id != undefined) {
                          this.BookerMakerMarketManual = result.bm;
                        } else {
                          this.BookerMakerMarketManual = null;
                        }
                      } else if (
                        this.BookerMakerMarketManual.market_id !=
                        result.bm.market_id
                      ) {
                        this.BookerMakerMarketManual = result.bm;
                      }

                      if (this.BookerMakerMarketManual != null) {
                        this.setcupBetMatchDataBookManual(result.bm);
                      }
                    }
                  } else {
                    this.soccerBetMatchMarkets = [];
                  }
                  if (result.OtherMarketList != null) {
                    if (this.callType == 1) {
                      this.betFairMarket = result.OtherMarketList;
                      for (var i = 0; i < result.OtherMarketList.length; i++) {
                        this.setBetfairMatchData(result.OtherMarketList[i], i);
                        for (
                          let j = 0;
                          j < result.OtherMarketList[i].runner_json.length;
                          j++
                        ) {
                          this._sportService.AssignKeyInit(
                            result.OtherMarketList[i].runner_json[j]
                              .selectionId,
                            result.OtherMarketList[i].match_id,
                            result.OtherMarketList[i].market_id
                          );
                        }
                      }
                    } else {
                      if (this.betFairMarket.length == 0) {
                        this.betFairMarket = result.OtherMarketList;
                      } else if (
                        this.betFairMarket.length !=
                        result.OtherMarketList.length
                      ) {
                        this.betFairMarket = result.OtherMarketList;
                      } else if (
                        this.betFairMarket.market_id !=
                        result.OtherMarketList.market_id
                      ) {
                        this.betFairMarket = result.OtherMarketList;
                      }
                      for (var i = 0; i < result.OtherMarketList.length; i++) {
                        this.setBetfairMatchData(result.OtherMarketList[i], i);
                      }
                    }
                  } else {
                    this.betFairMarket = [];
                  }
                  this.callType = 2;
                  this.removeTimeOut();
                  this.GetSoccerMarketList();
                }
              },
              (error) => {
                this.callType = 2;
                this.removeTimeOut();
                this.GetSoccerMarketList();
              }
            );
          }
        },
        this.callType == 1 ? 0 : 1000
      );
    } catch (e) {
      this.callType = 1;
      this.GetSoccerMarketList();
    }
  }
  setcupBetMatchData(result) {
    try {
      if (result != null) {
        var cupBetMatch = result;
        this.soccerBetMatchMarkets.matchVolumn = cupBetMatch.matchVolumn;
        this.soccerBetMatchMarkets.BetAllowTimeBefore =
          cupBetMatch.BetAllowTimeBefore;
        this.soccerBetMatchMarkets.InplayStatus = cupBetMatch.InplayStatus;
        this.soccerBetMatchMarkets.IsBetAllow = cupBetMatch.IsBetAllow;
        this.soccerBetMatchMarkets.SportName = cupBetMatch.SportName;
        this.soccerBetMatchMarkets.SportmaxOddsLimt =
          cupBetMatch.SportmaxOddsLimt;
        this.soccerBetMatchMarkets.SportminOddsLimt =
          cupBetMatch.SportminOddsLimt;
        this.soccerBetMatchMarkets.backRateDiff = cupBetMatch.backRateDiff;
        this.soccerBetMatchMarkets.favMatchID = cupBetMatch.favMatchID;
        this.soccerBetMatchMarkets.layRateDiff = cupBetMatch.layRateDiff;
        this.soccerBetMatchMarkets.sportGraphic = cupBetMatch.sportGraphic;
        this.soccerBetMatchMarkets.sportScore = cupBetMatch.sportScore;
        this.soccerBetMatchMarkets.sportShowLastResult =
          cupBetMatch.sportShowLastResult;
        this.soccerBetMatchMarkets.sportShowTV = cupBetMatch.sportShowTV;
        this.soccerBetMatchMarkets.start_date = cupBetMatch.start_date;
        this.soccerBetMatchMarkets.adminMessage = cupBetMatch.adminMessage;

        var btBefor = this.soccerBetMatchMarkets.BetAllowTimeBefore;
        if (
          this.soccerBetMatchMarkets.start_date - btBefor >
          this._serverTime
        ) {
          this.soccerBetMatchMarkets.isDetail = false;
          var timeStamp = this._sportService.timeDifference(
            (this.soccerBetMatchMarkets.start_date - btBefor) * 1000,
            this._serverTime * 1000
          );

          this.soccerBetMatchMarkets.remainTime = timeStamp;
        } else {
          this.soccerBetMatchMarkets.isDetail = true;
          this.soccerBetMatchMarkets.remainTime = "Inplay";
        }
        if (
          cupBetMatch.runner_json != null &&
          cupBetMatch.runner_json != "null"
        ) {
          for (let i = 0; i < cupBetMatch.runner_json.length; i++) {
            var indx = this.soccerBetMatchMarkets.runner_json.findIndex(
              (x) => x.selectionId == cupBetMatch.runner_json[i].selectionId
            );
            if (indx > -1) {
              this.soccerBetMatchMarkets.runner_json[indx].WinAndLoss =
                cupBetMatch.runner_json[i].WinAndLoss;
              if (
                this.soccerBetMatchMarkets.runner_json[indx].ex
                  .availableToBack != undefined &&
                this.soccerBetMatchMarkets.runner_json[indx].ex.availableToBack
                  .length > 0
              ) {
                for (
                  var r = 0;
                  r <
                  this.soccerBetMatchMarkets.runner_json[indx].ex
                    .availableToBack.length;
                  r++
                ) {
                  try {
                    var oldBackBhav =
                      this.soccerBetMatchMarkets.runner_json[indx].ex
                        .availableToBack[r];
                    var newBackBhav =
                      cupBetMatch.runner_json[i].ex.availableToBack[r];
                    if (newBackBhav.price + "" != oldBackBhav.price + "") {
                      if (newBackBhav.price > oldBackBhav.price) {
                        newBackBhav.priceChanged = 1;
                      } else if (newBackBhav.price < oldBackBhav.price) {
                        newBackBhav.priceChanged = 2;
                      } else {
                        newBackBhav.priceChanged = 0;
                      }
                      this.soccerBetMatchMarkets.runner_json[
                        indx
                      ].ex.availableToBack[r].price =
                        cupBetMatch.runner_json[i].ex.availableToBack[r].price;
                      this.soccerBetMatchMarkets.runner_json[
                        indx
                      ].ex.availableToBack[r].priceChanged =
                        newBackBhav.priceChanged;
                    }
                  } catch (e) {
                    // if (this.soccerBetMatchMarkets.runner_json[indx].ex.availableToBack[r] == undefined) {
                    this.soccerBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToBack[r].price = "--";
                    // }
                  }

                  try {
                    this.soccerBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToBack[r].size =
                      cupBetMatch.runner_json[i].ex.availableToBack[r].size;
                  } catch (e) {
                    // if (this.soccerBetMatchMarkets.runner_json[indx].ex.availableToBack[r] == undefined) {
                    this.soccerBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToBack[r].size = "--";
                    // }
                  }
                }
                if (
                  this.soccerBetMatchMarkets.runner_json[indx].ex
                    .availableToBack.length < 3
                ) {
                  var len =
                    this.soccerBetMatchMarkets.runner_json[indx].ex
                      .availableToBack.length;
                  for (let t = len; t < 3; t++) {
                    var data = { price: "--", size: "--" };

                    this.soccerBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToBack.push(data);
                  }
                }
              } else {
                this.soccerBetMatchMarkets.runner_json[
                  indx
                ].ex.availableToBack = [];

                for (let t = 0; t < 3; t++) {
                  var data = { price: "--", size: "--" };

                  this.soccerBetMatchMarkets.runner_json[
                    indx
                  ].ex.availableToBack.push(data);
                }
              }
              if (
                this.soccerBetMatchMarkets.runner_json[indx].ex
                  .availableToLay != undefined &&
                this.soccerBetMatchMarkets.runner_json[indx].ex.availableToLay
                  .length > 0
              ) {
                for (
                  var r = 0;
                  r <
                  this.soccerBetMatchMarkets.runner_json[indx].ex.availableToLay
                    .length;
                  r++
                ) {
                  try {
                    var oldBackBhav =
                      this.soccerBetMatchMarkets.runner_json[indx].ex
                        .availableToLay[r];
                    var newBackBhav =
                      cupBetMatch.runner_json[i].ex.availableToLay[r];
                    if (newBackBhav.price + "" != oldBackBhav.price + "") {
                      if (newBackBhav.price > oldBackBhav.price) {
                        newBackBhav.priceChanged = 1;
                      } else if (newBackBhav.price < oldBackBhav.price) {
                        newBackBhav.priceChanged = 2;
                      } else {
                        newBackBhav.priceChanged = 0;
                      }
                      this.soccerBetMatchMarkets.runner_json[
                        indx
                      ].ex.availableToLay[r].price =
                        cupBetMatch.runner_json[i].ex.availableToLay[r].price;

                      this.soccerBetMatchMarkets.runner_json[
                        indx
                      ].ex.availableToLay[r].priceChanged =
                        newBackBhav.priceChanged;
                    }
                  } catch (e) {
                    // if(this.soccerBetMatchMarkets.runner_json[indx].ex.availableToLay[r]==undefined){
                    this.soccerBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToLay[r].price = "--";
                    // }
                  }

                  try {
                    this.soccerBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToLay[r].size =
                      cupBetMatch.runner_json[i].ex.availableToLay[r].size;
                  } catch (e) {
                    // if(this.soccerBetMatchMarkets.runner_json[indx].ex.availableToLay[r]==undefined){
                    this.soccerBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToLay[r].size = "--";
                    // }
                  }
                }
                if (
                  this.soccerBetMatchMarkets.runner_json[indx].ex.availableToLay
                    .length < 3
                ) {
                  var len =
                    this.soccerBetMatchMarkets.runner_json[indx].ex
                      .availableToLay.length;
                  for (let t = len; t < 3; t++) {
                    var data = { price: "--", size: "--" };

                    this.soccerBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToLay.push(data);
                  }
                }
              } else {
                this.soccerBetMatchMarkets.runner_json[indx].ex.availableToLay =
                  [];

                for (var t = 0; t < 3; t++) {
                  var data = { price: "--", size: "--" };
                  this.soccerBetMatchMarkets.runner_json[
                    indx
                  ].ex.availableToLay.push(data);
                }
              }
            }
          }
        }
      }
    } catch (e) {}
  }
  setcupBetMatchDataBookManual(result) {
    try {
      if (result != null) {
        var cupBetMatch = result;
        this.BookerMakerMarketManual.matchVolumn = cupBetMatch.matchVolumn;
        this.BookerMakerMarketManual.BetAllowTimeBefore =
          cupBetMatch.BetAllowTimeBefore;
        this.BookerMakerMarketManual.InplayStatus = cupBetMatch.InplayStatus;
        this.BookerMakerMarketManual.IsBetAllow = cupBetMatch.IsBetAllow;
        this.BookerMakerMarketManual.SportName = cupBetMatch.SportName;
        this.BookerMakerMarketManual.SportmaxOddsLimt =
          cupBetMatch.SportmaxOddsLimt;
        this.BookerMakerMarketManual.SportminOddsLimt =
          cupBetMatch.SportminOddsLimt;
        this.BookerMakerMarketManual.backRateDiff = cupBetMatch.backRateDiff;
        this.BookerMakerMarketManual.favMatchID = cupBetMatch.favMatchID;
        this.BookerMakerMarketManual.layRateDiff = cupBetMatch.layRateDiff;
        this.BookerMakerMarketManual.sportGraphic = cupBetMatch.sportGraphic;
        this.BookerMakerMarketManual.sportScore = cupBetMatch.sportScore;
        this.BookerMakerMarketManual.sportShowLastResult =
          cupBetMatch.sportShowLastResult;
        this.BookerMakerMarketManual.sportShowTV = cupBetMatch.sportShowTV;
        this.BookerMakerMarketManual.start_date = cupBetMatch.start_date;
        this.BookerMakerMarketManual.adminMessage = cupBetMatch.adminMessage;

        var btBefor = this.BookerMakerMarketManual.BetAllowTimeBefore;
        if (
          this.BookerMakerMarketManual.start_date - btBefor >
          this._serverTime
        ) {
          this.BookerMakerMarketManual.isDetail = false;
          var timeStamp = this._sportService.timeDifference(
            (this.BookerMakerMarketManual.start_date - btBefor) * 1000,
            this._serverTime * 1000
          );

          this.BookerMakerMarketManual.remainTime = timeStamp;
        } else {
          this.BookerMakerMarketManual.isDetail = true;
          this.BookerMakerMarketManual.remainTime = "Inplay";
        }
        if (
          cupBetMatch.runner_json != null &&
          cupBetMatch.runner_json != "null"
        ) {
          for (let i = 0; i < cupBetMatch.runner_json.length; i++) {
            var indx = this.BookerMakerMarketManual.runner_json.findIndex(
              (x) => x.selectionId == cupBetMatch.runner_json[i].selectionId
            );
            if (indx > -1) {
              this.BookerMakerMarketManual.runner_json[indx].GameStatus =
                cupBetMatch.runner_json[i].GameStatus;
              this.BookerMakerMarketManual.runner_json[indx].WinAndLoss =
                cupBetMatch.runner_json[i].WinAndLoss;
              if (
                this.BookerMakerMarketManual.runner_json[indx].ex
                  .availableToBack != undefined &&
                this.BookerMakerMarketManual.runner_json[indx].ex
                  .availableToBack.length > 0
              ) {
                for (
                  var r = 0;
                  r <
                  this.BookerMakerMarketManual.runner_json[indx].ex
                    .availableToBack.length;
                  r++
                ) {
                  try {
                    var oldBackBhav =
                      this.BookerMakerMarketManual.runner_json[indx].ex
                        .availableToBack[r];
                    var newBackBhav =
                      cupBetMatch.runner_json[i].ex.availableToBack[r];
                    newBackBhav.price = this.convertStringToNumber(
                      cupBetMatch.runner_json[i].ex.availableToBack[r].price
                    );
                    if (newBackBhav.price + "" != oldBackBhav.price + "") {
                      if (newBackBhav.price > oldBackBhav.price) {
                        newBackBhav.priceChanged = 1;
                      } else if (newBackBhav.price < oldBackBhav.price) {
                        newBackBhav.priceChanged = 2;
                      } else {
                        newBackBhav.priceChanged = 0;
                      }
                      this.BookerMakerMarketManual.runner_json[
                        indx
                      ].ex.availableToBack[r].price =
                        cupBetMatch.runner_json[i].ex.availableToBack[r].price;

                      this.BookerMakerMarketManual.runner_json[
                        indx
                      ].ex.availableToBack[r].priceChanged =
                        newBackBhav.priceChanged;
                    }
                    if (
                      isNaN(
                        this.BookerMakerMarketManual.runner_json[indx].ex
                          .availableToBack[r].price
                      )
                    ) {
                      this.BookerMakerMarketManual.runner_json[
                        indx
                      ].ex.availableToBack[r].price = "--";
                    }
                  } catch (e) {
                    this.BookerMakerMarketManual.runner_json[
                      indx
                    ].ex.availableToBack[r].price = "--";
                  }

                  try {
                    this.BookerMakerMarketManual.runner_json[
                      indx
                    ].ex.availableToBack[r].size =
                      cupBetMatch.runner_json[i].ex.availableToBack[r].size;
                  } catch (e) {
                    this.BookerMakerMarketManual.runner_json[
                      indx
                    ].ex.availableToBack[r].size = "--";
                  }
                }
                if (
                  this.BookerMakerMarketManual.runner_json[indx].ex
                    .availableToBack.length < 3
                ) {
                  var j =
                    3 -
                    this.BookerMakerMarketManual.runner_json[indx].ex
                      .availableToBack.length;
                  var len =
                    this.BookerMakerMarketManual.runner_json[indx].ex
                      .availableToBack.length;
                  for (let t = len; t < 3; t++) {
                    var data = { price: "--", size: "--" };

                    this.BookerMakerMarketManual.runner_json[
                      indx
                    ].ex.availableToBack.push(data);
                  }
                }
              } else {
                this.BookerMakerMarketManual.runner_json[
                  indx
                ].ex.availableToBack = [];

                for (let t = 0; t < 3; t++) {
                  var data = { price: "--", size: "--" };

                  this.BookerMakerMarketManual.runner_json[
                    indx
                  ].ex.availableToBack.push(data);
                }
              }
              if (
                this.BookerMakerMarketManual.runner_json[indx].ex
                  .availableToLay != undefined &&
                this.BookerMakerMarketManual.runner_json[indx].ex.availableToLay
                  .length > 0
              ) {
                for (
                  var r = 0;
                  r <
                  this.BookerMakerMarketManual.runner_json[indx].ex
                    .availableToLay.length;
                  r++
                ) {
                  try {
                    var oldBackBhav =
                      this.BookerMakerMarketManual.runner_json[indx].ex
                        .availableToLay[r];
                    var newBackBhav =
                      cupBetMatch.runner_json[i].ex.availableToLay[r];
                    newBackBhav.price = this.convertStringToNumber(
                      cupBetMatch.runner_json[i].ex.availableToLay[r].price
                    );
                    if (newBackBhav.price + "" != oldBackBhav.price + "") {
                      if (newBackBhav.price > oldBackBhav.price) {
                        newBackBhav.priceChanged = 1;
                      } else if (newBackBhav.price < oldBackBhav.price) {
                        newBackBhav.priceChanged = 2;
                      } else {
                        newBackBhav.priceChanged = 0;
                      }
                      this.BookerMakerMarketManual.runner_json[
                        indx
                      ].ex.availableToLay[r].price =
                        cupBetMatch.runner_json[i].ex.availableToLay[r].price;

                      this.BookerMakerMarketManual.runner_json[
                        indx
                      ].ex.availableToLay[r].priceChanged =
                        newBackBhav.priceChanged;
                    }

                    if (
                      isNaN(
                        this.BookerMakerMarketManual.runner_json[indx].ex
                          .availableToLay[r].price
                      )
                    ) {
                      this.BookerMakerMarketManual.runner_json[
                        indx
                      ].ex.availableToLay[r].price = "--";
                    }
                  } catch (e) {
                    this.BookerMakerMarketManual.runner_json[
                      indx
                    ].ex.availableToLay[r].price = "--";
                  }

                  try {
                    this.BookerMakerMarketManual.runner_json[
                      indx
                    ].ex.availableToLay[r].size =
                      cupBetMatch.runner_json[i].ex.availableToLay[r].size;
                  } catch (e) {
                    this.BookerMakerMarketManual.runner_json[
                      indx
                    ].ex.availableToLay[r].size = "--";
                  }
                }
                if (
                  this.BookerMakerMarketManual.runner_json[indx].ex
                    .availableToLay.length < 3
                ) {
                  var j =
                    3 -
                    this.BookerMakerMarketManual.runner_json[indx].ex
                      .availableToLay.length;
                  var len =
                    this.BookerMakerMarketManual.runner_json[indx].ex
                      .availableToLay.length;
                  for (let t = len; t < 3; t++) {
                    var data = { price: "--", size: "--" };

                    this.BookerMakerMarketManual.runner_json[
                      indx
                    ].ex.availableToLay.push(data);
                  }
                }
              } else {
                this.BookerMakerMarketManual.runner_json[
                  indx
                ].ex.availableToLay = [];
                for (var t = 0; t < 3; t++) {
                  var data = { price: "--", size: "--" };
                  this.BookerMakerMarketManual.runner_json[
                    indx
                  ].ex.availableToLay.push(data);
                }
              }
            }
          }
        }
      }
    } catch (e) {}
  }
  setBetfairMatchData(result, ind) {
    try {
      if (result != null) {
        var cupBetMatch = result;
        if (this.betFairMarket[ind].market_id != result.market_id) {
          this.betFairMarket[ind] = result;
        } else {
          this.betFairMarket[ind].matchVolumn = cupBetMatch.matchVolumn;
          this.betFairMarket[ind].BetAllowTimeBefore =
            cupBetMatch.BetAllowTimeBefore;
          this.betFairMarket[ind].InplayStatus = cupBetMatch.InplayStatus;
          this.betFairMarket[ind].IsBetAllow = cupBetMatch.IsBetAllow;
          this.betFairMarket[ind].SportName = cupBetMatch.SportName;
          this.betFairMarket[ind].SportmaxOddsLimt =
            cupBetMatch.SportmaxOddsLimt;
          this.betFairMarket[ind].SportminOddsLimt =
            cupBetMatch.SportminOddsLimt;
          this.betFairMarket[ind].backRateDiff = cupBetMatch.backRateDiff;
          this.betFairMarket[ind].favMatchID = cupBetMatch.favMatchID;
          this.betFairMarket[ind].layRateDiff = cupBetMatch.layRateDiff;
          this.betFairMarket[ind].sportGraphic = cupBetMatch.sportGraphic;
          this.betFairMarket[ind].sportScore = cupBetMatch.sportScore;
          this.betFairMarket[ind].sportShowLastResult =
            cupBetMatch.sportShowLastResult;
          this.betFairMarket[ind].sportShowTV = cupBetMatch.sportShowTV;
          this.betFairMarket[ind].start_date = cupBetMatch.start_date;
          this.betFairMarket[ind].adminMessage = cupBetMatch.adminMessage;
          this.betFairMarket[ind].marketMinStack = cupBetMatch.marketMinStack;
          this.betFairMarket[ind].marketMaxStack = cupBetMatch.marketMaxStack;
          this.betFairMarket[ind].marketMaxProfit = cupBetMatch.marketMaxProfit;

          var btBefor = this.betFairMarket[ind].BetAllowTimeBefore;
          if (this.betFairMarket[ind].start_date - btBefor > this._serverTime) {
            this.betFairMarket[ind].isDetail = false;
            var timeStamp = this._sportService.timeDifference(
              (this.betFairMarket[ind].start_date - btBefor) * 1000,
              this._serverTime * 1000
            );

            this.betFairMarket[ind].remainTime = timeStamp;
          } else {
            this.betFairMarket[ind].isDetail = true;
            this.betFairMarket[ind].remainTime = "Inplay";
          }
          if (
            cupBetMatch.runner_json != null &&
            cupBetMatch.runner_json != "null"
          ) {
            for (let i = 0; i < cupBetMatch.runner_json.length; i++) {
              var indx = this.betFairMarket[ind].runner_json.findIndex(
                (x) => x.selectionId == cupBetMatch.runner_json[i].selectionId
              );
              if (indx > -1) {
                this.betFairMarket[ind].runner_json[indx].WinAndLoss =
                  cupBetMatch.runner_json[i].WinAndLoss;
                if (
                  this.betFairMarket[ind].runner_json[indx].ex
                    .availableToBack != undefined &&
                  this.betFairMarket[ind].runner_json[indx].ex.availableToBack
                    .length > 0
                ) {
                  for (
                    var r = 0;
                    r <
                    this.betFairMarket[ind].runner_json[indx].ex.availableToBack
                      .length;
                    r++
                  ) {
                    try {
                      var oldBackBhav =
                        this.betFairMarket[ind].runner_json[indx].ex
                          .availableToBack[r];
                      var newBackBhav =
                        cupBetMatch.runner_json[i].ex.availableToBack[r];
                      if (newBackBhav.price + "" != oldBackBhav.price + "") {
                        if (newBackBhav.price > oldBackBhav.price) {
                          newBackBhav.priceChanged = 1;
                        } else if (newBackBhav.price < oldBackBhav.price) {
                          newBackBhav.priceChanged = 2;
                        } else {
                          newBackBhav.priceChanged = 0;
                        }
                        this.betFairMarket[ind].runner_json[
                          indx
                        ].ex.availableToBack[r].price =
                          cupBetMatch.runner_json[i].ex.availableToBack[
                            r
                          ].price;

                        this.betFairMarket[ind].runner_json[
                          indx
                        ].ex.availableToBack[r].priceChanged =
                          newBackBhav.priceChanged;
                      }
                    } catch (e) {
                      // if (this.betFairMarket[ind].runner_json[indx].ex.availableToBack[r] == undefined) {
                      this.betFairMarket[ind].runner_json[
                        indx
                      ].ex.availableToBack[r].price = "--";
                      // }
                    }

                    try {
                      this.betFairMarket[ind].runner_json[
                        indx
                      ].ex.availableToBack[r].size =
                        cupBetMatch.runner_json[i].ex.availableToBack[r].size;
                    } catch (e) {
                      // if (this.betFairMarket[ind].runner_json[indx].ex.availableToBack[r] == undefined) {
                      this.betFairMarket[ind].runner_json[
                        indx
                      ].ex.availableToBack[r].size = "--";
                      // }
                    }
                  }
                  if (
                    this.betFairMarket[ind].runner_json[indx].ex.availableToBack
                      .length < 3
                  ) {
                    var j =
                      this.betFairMarket[ind].runner_json[indx].ex
                        .availableToBack.length;
                    for (let t = j; t < 3; t++) {
                      var data = { price: "--", size: "--" };

                      this.betFairMarket[ind].runner_json[
                        indx
                      ].ex.availableToBack.push(data);
                    }
                  }
                } else {
                  this.betFairMarket[ind].runner_json[indx].ex.availableToBack =
                    [];

                  for (let t = 0; t < 3; t++) {
                    var data = { price: "--", size: "--" };

                    this.betFairMarket[ind].runner_json[
                      indx
                    ].ex.availableToBack.push(data);
                  }
                }
                if (
                  this.betFairMarket[ind].runner_json[indx].ex.availableToLay !=
                    undefined &&
                  this.betFairMarket[ind].runner_json[indx].ex.availableToLay
                    .length > 0
                ) {
                  for (
                    var r = 0;
                    r <
                    this.betFairMarket[ind].runner_json[indx].ex.availableToLay
                      .length;
                    r++
                  ) {
                    try {
                      var oldBackBhav =
                        this.betFairMarket[ind].runner_json[indx].ex
                          .availableToLay[r];
                      var newBackBhav =
                        cupBetMatch.runner_json[i].ex.availableToLay[r];
                      if (newBackBhav.price + "" != oldBackBhav.price + "") {
                        if (newBackBhav.price > oldBackBhav.price) {
                          newBackBhav.priceChanged = 1;
                        } else if (newBackBhav.price < oldBackBhav.price) {
                          newBackBhav.priceChanged = 2;
                        } else {
                          newBackBhav.priceChanged = 0;
                        }
                        this.betFairMarket[ind].runner_json[
                          indx
                        ].ex.availableToLay[r].price =
                          cupBetMatch.runner_json[i].ex.availableToLay[r].price;

                        this.betFairMarket[ind].runner_json[
                          indx
                        ].ex.availableToLay[r].priceChanged =
                          newBackBhav.priceChanged;
                      }
                    } catch (e) {
                      // if(this.betFairMarket[ind].runner_json[indx].ex.availableToLay[r]==undefined){
                      this.betFairMarket[ind].runner_json[
                        indx
                      ].ex.availableToLay[r].price = "--";
                      // }
                    }

                    try {
                      this.betFairMarket[ind].runner_json[
                        indx
                      ].ex.availableToLay[r].size =
                        cupBetMatch.runner_json[i].ex.availableToLay[r].size;
                    } catch (e) {
                      // if(this.betFairMarket[ind].runner_json[indx].ex.availableToLay[r]==undefined){
                      this.betFairMarket[ind].runner_json[
                        indx
                      ].ex.availableToLay[r].size = "--";
                      // }
                    }
                  }
                  if (
                    this.betFairMarket[ind].runner_json[indx].ex.availableToLay
                      .length < 3
                  ) {
                    var j =
                      this.betFairMarket[ind].runner_json[indx].ex
                        .availableToLay.length;
                    for (let t = j; t < 3; t++) {
                      var data = { price: "--", size: "--" };

                      this.betFairMarket[ind].runner_json[
                        indx
                      ].ex.availableToLay.push(data);
                    }
                  }
                } else {
                  this.betFairMarket[ind].runner_json[indx].ex.availableToLay =
                    [];

                  for (var t = 0; t < 3; t++) {
                    var data = { price: "--", size: "--" };
                    this.betFairMarket[ind].runner_json[
                      indx
                    ].ex.availableToLay.push(data);
                  }
                }
              }
            }
          }
        }
      }
    } catch (e) {}
  }
  setBetBoxBetFair(type, cuprenners, betfair) {
    this.isShow = -1;
    this.isBetFairbet = -1;
    if (type == "back") {
      cuprenners.isbackClass = "isbackclass";
      cuprenners.islayClass = "";
      cuprenners.isBackBox = 1;
      cuprenners.isLayBox = 0;
      cuprenners.odds = this.retrunValue(
        "back",
        betfair,
        cuprenners.ex.availableToBack[0].price
      );
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
      cuprenners.type = "1";
    } else if (type == "lay") {
      cuprenners.isbackClass = "";
      cuprenners.islayClass = "islayclass";
      cuprenners.isLayBox = 1;
      cuprenners.isBackBox = 0;
      cuprenners.odds = this.retrunValue(
        "lay",
        betfair,
        cuprenners.ex.availableToLay[0].price
      );
      cuprenners.type = "0";
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
    }
    cuprenners.stack = 0;
    cuprenners.market_id = betfair.market_id;
    cuprenners.match_id = betfair.match_id;
    this._sportService.AddBackOrLay(cuprenners);
    if (this._sportService.oneClickShow) {
      if (this.selectedOneClick == 0) {
        this._sessionService.notifier.notify(
          "error",
          "Please select one click stack."
        );
      } else {
        cuprenners.stack = this.selectedOneClick;
        this.saveSportBetData(cuprenners, betfair);
      }

      this.isBetFairbet = -1;
    } else {
      this.isBetFairEditStack = false;
    }
  }

  isBetAllowPopular(slist) {
    if (slist.BetAllowTimeBefore == 0 && slist.IsBetAllow == "Y") {
      return true;
    } else if (slist.BetAllowTimeBefore > 0 && slist.IsBetAllow == "Y") {
      if (slist.isDetail) {
        //(startDate-btBefor)<currentTime
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  updateStack(stack, updateStack) {
    updateStack.stack =
      parseFloat(stack) +
      parseFloat(updateStack.stack == null ? 0 : updateStack.stack);
    if (parseFloat(updateStack.odds) >= 0) {
      updateStack.p_l =
        parseFloat(updateStack.odds) * updateStack.stack - updateStack.stack;
    }
    if (this._sportService.stakeIds != undefined) {
      this._sportService.CalculateProfitLoss(updateStack, 1); //1 for add
    }
  }
  updatePL(updateStack) {
    if (parseFloat(updateStack.odds) >= 0) {
      updateStack.p_l =
        parseFloat(updateStack.odds) * updateStack.stack - updateStack.stack;
    }
    if (this._sportService.stakeIds != undefined) {
      this._sportService.CalculateProfitLoss(updateStack, 1); //1 for add
    }
  }
  setBetBox(type, soccerrunners) {
    this.isShow = -1;
    this.isBetFairbet = -1;
    if (type == "back") {
      soccerrunners.isbackClass = "isbackclass";
      soccerrunners.islayClass = "";
      soccerrunners.isBackBox = 1;
      soccerrunners.isLayBox = 0;
      soccerrunners.odds = this.retrunValue(
        "back",
        this.soccerBetMatchMarkets,
        soccerrunners.ex.availableToBack[0].price
      );
      if (soccerrunners.odds == "--") {
        soccerrunners.odds = 0;
      }
      soccerrunners.type = "1";
    } else if (type == "lay") {
      soccerrunners.isbackClass = "";
      soccerrunners.islayClass = "islayclass";
      soccerrunners.isLayBox = 1;
      soccerrunners.isBackBox = 0;
      soccerrunners.odds = this.retrunValue(
        "lay",
        this.soccerBetMatchMarkets,
        soccerrunners.ex.availableToLay[0].price
      );
      if (soccerrunners.odds == "--") {
        soccerrunners.odds = 0;
      }
      soccerrunners.type = "0";
    }
    soccerrunners.selectionName = soccerrunners.selectionName;
    soccerrunners.stack = 0;
    soccerrunners.market_id = this.soccerBetMatchMarkets.market_id;
    soccerrunners.match_id = this.soccerBetMatchMarkets.match_id;
    this._sportService.AddBackOrLay(soccerrunners);
    if (this._sportService.oneClickShow) {
      if (this.selectedOneClick == 0) {
        this._sessionService.notifier.notify(
          "error",
          "Please select one click stack."
        );
      } else {
        soccerrunners.stack = this.selectedOneClick;
        this.saveSportBetData(soccerrunners, 0);
      }

      this.isShow = -1;
    } else {
      this.isEditStack = false;
    }
  }
  saveSportBetData(soccerrunners, betfair) {
    if (soccerrunners.odds <= 0) {
      this._sessionService.notifier.notify(
        "error",
        "Odds must be grater than 0"
      );
    } else if (soccerrunners.stack <= 0) {
      this._sessionService.notifier.notify(
        "error",
        "Stack must be grater than 0"
      );
    } else {
      this._sportService._loading = true;
      var sdata = {
        match_id: this._sessionService.get("match_id"),
        market_id: soccerrunners.market_id,
        selection_id: soccerrunners.selectionId,
        odds: soccerrunners.odds.toString(),
        stack: parseInt(soccerrunners.stack),
        is_back: soccerrunners.type,
      };

      this._sportService.saveBetData(sdata).subscribe(
        (data) => {
          if (!data.error) {
            this._sessionService.notifier.notify("success", data.message);
            this.isShow = -1;
            this.isBetFairbet = -1;
            this.isShowBM = -1;
            this._sportService.callBalance = 1;
            this._sportService._loading = false;
            this._sportService.getBalance();
            this.getMatchBetAndFancyBetList();
            if (betfair == 0) {
              for (
                var r = 0;
                r < this.soccerBetMatchMarkets.runner_json.length;
                r++
              ) {
                this.soccerBetMatchMarkets.runner_json[r].WinAndLoss =
                  this.soccerBetMatchMarkets.runner_json[r].WinAndLoss +
                  this._sportService.stake2[
                    "field_" +
                      this.soccerBetMatchMarkets.runner_json[r].selectionId +
                      "_" +
                      this.soccerBetMatchMarkets.match_id +
                      "_" +
                      this.soccerBetMatchMarkets.market_id
                  ];
              }
            } else {
              for (var r = 0; r < betfair.runner_json.length; r++) {
                betfair.runner_json[r].WinAndLoss =
                  betfair.runner_json[r].WinAndLoss +
                  this._sportService.stake2[
                    "field_" +
                      betfair.runner_json[r].selectionId +
                      "_" +
                      betfair.match_id +
                      "_" +
                      betfair.market_id
                  ];
              }
            }

            this._sportService.removeBackLay(soccerrunners);
            this.getMatchBetAndFancyBetList();
          } else {
            this._sessionService.notifier.notify("error", data.message);
            this.isShow = -1;
            this.isBetFairbet = -1;
            this.isShowBM = -1;
            this._sportService._loading = false;
            if (betfair == 0) {
              for (
                var r = 0;
                r < this.soccerBetMatchMarkets.runner_json.length;
                r++
              ) {
                this.soccerBetMatchMarkets.runner_json[r].WinAndLoss =
                  this.soccerBetMatchMarkets.runner_json[r].WinAndLoss;
              }
            } else {
              for (var r = 0; r < betfair.runner_json.length; r++) {
                betfair.runner_json[r].WinAndLoss =
                  betfair.runner_json[r].WinAndLoss;
              }
            }

            this._sportService.removeBackLay(soccerrunners);
          }
          this._sportService._loading = false;
        },
        (error) => {
          this._sportService._loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify(
                "error",
                "Internet not available."
              );
              return;
            }
          }
          this._sessionService.notifier.notify("error", error.message);
        }
      );
    }
  }
  setBetBoxBookManual(type, cuprenners) {
    this.isShow = -1;
    this.isBetFairbet = -1;
    if (type == "back") {
      cuprenners.isbackClass = "isbackclass";
      cuprenners.islayClass = "";
      cuprenners.isBackBox = 1;
      cuprenners.isLayBox = 0;
      cuprenners.odds = this.retrunValue(
        "back",
        this.BookerMakerMarketManual,
        cuprenners.ex.availableToBack[0].price
      );
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
      cuprenners.type = "1";
    } else if (type == "lay") {
      cuprenners.isbackClass = "";
      cuprenners.islayClass = "islayclass";
      cuprenners.isLayBox = 1;
      cuprenners.isBackBox = 0;
      cuprenners.odds = this.retrunValue(
        "lay",
        this.BookerMakerMarketManual,
        cuprenners.ex.availableToLay[0].price
      );
      cuprenners.type = "0";
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
    }
    cuprenners.stack = 0;
    cuprenners.market_id = this.BookerMakerMarketManual.market_id;
    cuprenners.match_id = this.BookerMakerMarketManual.match_id;
    this._sportService.AddBackOrLay(cuprenners);
    if (this._sportService.oneClickShow) {
      if (this.selectedOneClick == 0) {
        this._sessionService.notifier.notify(
          "error",
          "Please select one click stack."
        );
      } else {
        cuprenners.stack = this.selectedOneClick;
        this.saveSportBetData(cuprenners, 0);
      }

      this.isShowBM = -1;
    } else {
      this.isEditStack = false;
    }
  }
  retrunValue(type, match, value) {
    if (match != "--") {
      if (type == "back") {
        if (value != undefined && value != "--") {
          var backRateDiff = match.backRateDiff;
          let result = value + backRateDiff;

          if (result < 0) {
            return 0;
          }
          if (this.isInt(result)) {
            return result;
          } else {
            return result;
          }
        } else {
          return "--";
        }
      } else if (type == "lay") {
        if (value != undefined && value != "--") {
          var layRateDiff = match.layRateDiff;
          let result = value + layRateDiff;

          if (result < 0) {
            return 0;
          }
          if (this.isInt(result)) {
            return result;
          } else {
            return result;
          }
        } else {
          return "--";
        }
      } else if (type == "size") {
        if (value != undefined && value != "--") {
          var matchvolume = parseFloat(match.matchVolumn);
          if (matchvolume > 0) {
            let result = value * matchvolume;
            if (this.isInt(result)) {
              return this.numFormatter(result);
            } else {
              return this.numFormatter(result);
            }
          } else {
            if (value == 0) {
              return value;
            } else {
              return this.numFormatter(value);
            }
          }
        } else {
          return "--";
        }
      }
    } else {
      return "--";
    }
  }
  isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }
  convertStringToNumber(input) {
    if (!input) return NaN;

    if (input.trim().length == 0) {
      return NaN;
    }
    return Number(input);
  }
  numFormatter(number) {
    // hundreds
    if (number <= 999) {
      return number.toFixed(2);
    }
    // thousands
    else if (number >= 1000 && number <= 999999) {
      return (number / 1000).toFixed(2) + "K";
    }
    // millions
    else if (number >= 1000000 && number <= 999999999) {
      return (number / 1000000).toFixed(2) + "M";
    }
    // billions
    else if (number >= 1000000000 && number <= 999999999999) {
      return (number / 1000000000).toFixed(2) + "B";
    } else if (number >= 10000000000 && number <= 9999999999999) {
      return (number / 100000000000).toFixed(2) + "T";
    } else if (number >= 100000000000 && number <= 9999999999999) {
      return (number / 100000000000).toFixed(2) + "T";
    } else return number.toFixed(2);
  }
  showOneClickDiv() {
    if (this._sportService.oneClickShow == false) {
      $("#oneClickBetting").attr("checked", true);
      this._sportService.oneClickShow = true;
    } else {
      $("#oneClickBetting").attr("checked", false);
      this._sportService.oneClickShow = false;
    }
  }
  updateRate(type, cuprenners) {
    if (type == "min") {
      if (cuprenners.stack > 0) {
        cuprenners.stack = (parseFloat(cuprenners.stack) - 0.01).toFixed(2);
      }
    } else if (type == "max") {
      cuprenners.stack = (parseFloat(cuprenners.stack) + 0.01).toFixed(2);
    }
    this.updatePL(cuprenners);
  }

  showTVDiv() {
    if (this._sportService.oneClickTV == false) {
      $("#oneClickTV").attr("checked", true);
      this._sportService.oneClickTV = true;
    } else {
      $("#oneClickTV").attr("checked", false);
      this._sportService.oneClickTV = false;
    }
  }
}
