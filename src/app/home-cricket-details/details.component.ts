import { Component, OnInit, OnDestroy } from "@angular/core";
import { SessionService } from "../service/session.service";
import { SportServiceService } from "../service/sport-service.service";
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RouterEvent,
} from "@angular/router";
import { filter } from "rxjs/operators";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { DetailsService } from "./details.services";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { browserRefresh } from "../app.component";
import { LoginServiceService } from "../service/login-service.service";
import { isNullOrUndefined, isString } from "util";
import { log } from "console";
import { environment } from "../../environments/environment";

declare var $: any;
@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent implements OnInit, OnDestroy {
  IsEmail = null;
  loginTypeOtp;
  login_form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });
  IsRegistration = "Y";
  IsRegistrationShow = false;
  isValidFormSubmitted = null;
  time = new Date();
  intervalId;
  oneClickShow = false;
  matchScore: NodeJS.Timer = null;
  callType: any = 1;
  scoreMatch: any = [];
  MatchBetList: any = [];
  matchForCricket: any;
  matchSession: any;
  sessionType = 1;
  loading = false;
  matchOddsShow = true;
  bookMakerShow = true;
  betFairMarketShow = true;
  isActiveClassAll = true;
  isActiveClassMO = false;
  isActiveClassBM = false;
  isActiveClassO = false;
  _serverTime: any;
  cricketBetMatchMarkets: any = [];
  BookerMakerMarket: any = [];
  BookerMakerMarketManual: any = [];
  BookerMakerMarketData: any = [];
  betFairMarket: any = [];
  cupBetUserSportsDetails: any = [];
  UserOneClickStack: any = [];
  safeSrc: SafeResourceUrl = null;
  PlayTv1 = "";
  PlayTv2 = "";
  PlayTv3 = "";
  PlayTv4 = "";
  matchStatus = "";
  providerList = null;
  safeGrapicSrc: SafeResourceUrl;
  matchStack: any = [];
  isEditStack = false;
  showModal: boolean;
  isShow: any;
  isBetFairbet: any;
  sportsList = null;
  isSessionBet: any;
  isSessionEditStack = false;
  isBetFairEditStack = false;
  isOneEdit = false;
  isOneActive: any;
  selectedOneClick = 0;
  fancyList: any = [];
  showScorePosition = -1;
  sportID = null;
  searchMatch: any = [];
  activeClassB = "";
  activeClassR = "";
  activeClassA = "";
  activeClassD = "";
  activeClassBB = "";
  activeClassP = "";
  scoreMatchData: any = [];
  whatsapp = "";
  telegram = "";
  instagram = "";
  twitter = "";
  isScoreActive = 0;
  siteMessage = "";
  bottomSocialLink: any = [];
  showRegModal: boolean;
  otpShow = false;
  isUser = false;
  mobilenumber = "";
  settingData: any = [];
  signUpStatus: any;
  siteTitle = "";
  sitelogo = "";
  sitefavicon = "";
  adminLink = "";
  isShowBM: any;
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
    public _cricketServices: DetailsService,
    private sanitizer: DomSanitizer,
    private loginservice: LoginServiceService,
    public _sportService: SportServiceService,
    public route: Router
  ) {
    this.MatchBetList.MatchAndBetfair = [];
    this.MatchBetList.MatchFancy = [];
    //this.getMatchScoreBySportAndMatchId();
    //this.getMatchBetAndFancyBetList();
    this.callType = 1;
  }

  newPassword;
  confPassword;
  unamePattern = "^[a-zA-Z0-9]+$";
  namePattern = "^[a-zA-Z ]*$";
  mobnumPattern = new RegExp("^((\\+91-?)|0)?[0-9]{10}$");
  emailPattern = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
  passwordPattern = new RegExp(
    "(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}"
  );

  register_form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.namePattern),
    ]),
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.emailPattern),
    ]),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.mobnumPattern),
    ]),
    username: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.unamePattern),
    ]),
    newPassword: new FormControl(null, [Validators.required]),
    confPassword: new FormControl(null, [Validators.required]),
    otp: new FormControl(null, [Validators.required]),
    ageagree: new FormControl(null, [Validators.required]),
    referralid: new FormControl(""),
  });
  isValidFormSubmittedR = null;

  ngOnDestroy() {
    if (this.pipSub != null) {
      this.pipSub.unsubscribe();
    }
  }
  // ngAfterViewInit() {
  //   this.setupPageScripts();
  //   this.setupPageScript();
  // }
  // setupPageScript() {
  //   let elementRef = document.getElementById('login_div');
  //   let s = document.createElement('script');
  //   s.src = './assets/js/custom.js';
  //   s.async = true;
  //   elementRef.appendChild(s);
  // }

  // setupPageScripts() {
  //   let appScript = document.createElement("script");
  //   appScript.type = "text/javascript";
  //   appScript.async = true;
  //   appScript.text = '$(document).ready(function($) {$(this).scrollTop(0);});';
  //   document.body.appendChild(appScript);

  // }
  pipSub: any = null;

  ngOnInit() {
    // if (browserRefresh) {
    //   this._sessionService.gotoLoginPage();
    //   return;
    // }
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.pipSub = this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.safeSrc = null;
        this.PlayTv1 = "";
        this.PlayTv2 = "";
        this.PlayTv3 = "";
        this.PlayTv4 = "";
        this.safeGrapicSrc = null;
        this.fancyList = [];
        this.cricketBetMatchMarkets = [];
        this.BookerMakerMarket = [];
        this.BookerMakerMarketManual = [];
        this.BookerMakerMarketData = [];
        this.betFairMarket = [];
        this.scoreMatch = [];
        this.scoreMatchData = [];
        this.MatchBetList.MatchAndBetfair = [];
        this.MatchBetList.MatchFancy = [];
        //this.getMatchScoreBySportAndMatchId();
        this.getScoreBySportId();
        //this.getMatchBetAndFancyBetList();
        this._sportService.callBalance = 1;
        //this._sportService.getBalance();
        this.callType = 1;
      });

    this._sportService.oneClickShow = false;
    this.MatchBetList.MatchAndBetfair = [];
    this.MatchBetList.MatchFancy = [];
    this._sportService.isShowOneClick = true;
    //this.GetCricketMarketList();
    this.getMatchScoreBySportAndMatchId();
    this.getSessionByMatchId();
    //this.getScoreBySportId();
    this._sportService.callBalance = 1;
    //this._sportService.getBalance();

    this.callGetSportsList();
    //this.getProviderList();

    // if (this.route.url == '/casinos/blackjack') {
    //   this.activeClassB = 'active';
    // } else if (this.route.url == '/casinos/roulette') {
    //   this.activeClassR = 'active';
    // } else if (this.route.url == '/casinos/andar-bahar') {
    //   this.activeClassA = 'active';
    // } else if (this.route.url == '/casinos/dragon-tiger') {
    //   this.activeClassD = 'active';
    // } else if (this.route.url == '/casinos/baccarat') {
    //   this.activeClassBB = 'active';
    // } else if (this.route.url == '/casinos/poker') {
    //   this.activeClassP = 'active';
    // }

    //this.getSettingData();
    this.getDefaultSetting();
    this.adminLink = environment.admindomain;
  }

  items = [
    {
      name: "Home",
      link: "/home",
      imageUrl: "./assets/img/home.svg",
      isActive: false,
    },
    {
      name: "InPlay",
      link: "/inplay-matches",
      imageUrl: "./assets/img/inplay.svg",
      isActive: false,
    },
    {
      name: "Casino",
      link: "/casinos/games/roulette",
      imageUrl: "./assets/img/mini_games.gif",
      isActive: false,
    },
    {
      name: "Menu",
      link: "#",
      imageUrl: "./assets/img/menu.svg",
      isActive: false,
    },
  ];

  toggleActive(item: any) {
    // Toggle isActive property of clicked item
    item.isActive = !item.isActive;

    // Remove isActive property from other items
    this.items.forEach((i) => {
      if (i !== item) {
        i.isActive = false;
      }
    });
  }
  getDefaultSetting() {
    this._sportService.getDefaultSetting().subscribe(
      (data) => {
        var result = data.data;
        if (isNullOrUndefined(result)) {
          return;
        } else {
          this.settingData = result;
          for (var index in this.settingData) {
            if (this.settingData[index].key == "radheyexch.site_title") {
              this._sessionService.set(
                "sitetitle",
                this.settingData[index].value
              );
            }
            if (this.settingData[index].key == "radheyexch.site_logo") {
              this._sessionService.set(
                "sitelogo",
                this.settingData[index].value
              );
            }
            if (this.settingData[index].key == "radheyexch.site_message") {
              this._sessionService.set(
                "siteMessage",
                this.settingData[index].value
              );
            }
            if (this.settingData[index].key == "radheyexch.FAVICON") {
              this._sessionService.set(
                "sitefavicon",
                this.settingData[index].value
              );
            }
            if (this.settingData[index].key == "radheyexch.sign_up_status") {
              this._sessionService.set(
                "sign_up_status",
                this.settingData[index].value
              );
            }
          }
        }
        this.siteTitle = this._sessionService.get("sitetitle");
        this.siteMessage = this._sessionService.get("siteMessage");
        this.sitelogo = this._sessionService.get("sitelogo");
        this.sitefavicon = this._sessionService.get("sitefavicon");
        this.signUpStatus = this._sessionService.get("sign_up_status");
      },
      (error) => {
        if (error.error instanceof ProgressEvent) {
          if (error.status == 0) {
            //this._sessionService.notifier.notify('error', "Internet not available.");
            return;
          }
        }
      }
    );
  }
  isNumber(value) {
    if (!Number.isNaN(value)) {
      if (Number.isInteger(value)) {
        return value;
      } else {
        return value;
      }
    } else {
      return "--";
    }
  }

  showAllMarkets(show) {
    if (show == "all") {
      this.matchOddsShow = true;
      this.bookMakerShow = true;
      this.betFairMarketShow = true;
      this.isActiveClassAll = true;
      this.isActiveClassMO = false;
      this.isActiveClassBM = false;
      this.isActiveClassO = false;
    } else if (show == "matchOddsShow") {
      this.matchOddsShow = true;
      this.bookMakerShow = false;
      this.betFairMarketShow = false;
      this.isActiveClassAll = false;
      this.isActiveClassMO = true;
      this.isActiveClassBM = false;
      this.isActiveClassO = false;
    } else if (show == "bookmakers") {
      this.matchOddsShow = false;
      this.bookMakerShow = true;
      this.betFairMarketShow = false;
      this.isActiveClassAll = false;
      this.isActiveClassMO = false;
      this.isActiveClassBM = true;
      this.isActiveClassO = false;
    } else if (show == "other") {
      this.matchOddsShow = false;
      this.bookMakerShow = false;
      this.betFairMarketShow = true;
      this.isActiveClassAll = false;
      this.isActiveClassMO = false;
      this.isActiveClassBM = false;
      this.isActiveClassO = true;
    } else {
      this.matchOddsShow = true;
      this.bookMakerShow = true;
      this.betFairMarketShow = true;
      this.isActiveClassAll = true;
      this.isActiveClassMO = true;
      this.isActiveClassBM = true;
      this.isActiveClassO = true;
    }
  }
  getSettingData() {
    this._sessionService.getSettingData().subscribe(
      (data) => {
        this.bottomSocialLink = data.data;
        this.whatsapp = this.bottomSocialLink[3].value;
        this.telegram = this.bottomSocialLink[4].value;
        this.twitter = this.bottomSocialLink[5].value;
        this.instagram = this.bottomSocialLink[6].value;
      },
      (error) => {}
    );
  }
  resetSport() {
    this.closeMenu();
  }
  closeMenu() {
    $(".sidenav2").removeClass("active");
    $(".sports-drop-bx").removeClass("active");
    $(".my-tree li a.active").removeClass("active");
  }
  show() {
    this.showModal = true; // Show-Hide Modal Check
  }
  hide() {
    this.showModal = false;
  }

  getProviderList() {
    this._cricketServices.getProviderList().subscribe(
      (data) => {
        this.providerList = data.data;
      },
      (error) => {}
    );
  }
  callGetSportsList() {
    var sdata = { limit: 10, pageno: 1 };
    this._cricketServices.GetSports(sdata).subscribe(
      (data) => {
        this.sportsList = data.data;
      },
      (error) => {}
    );
  }

  GoToListPage(sport) {
    if (sport.sport_id > 0) {
      this._sessionService.destroy("sport_id");
      this._sessionService.set("sport_id", sport.sport_id);
      if (this._sessionService.get("sport_id") != null) {
        this.sportID = this._sessionService.get("sport_id");
      } else {
        this.sportID = 4;
      }
      this.route.navigate(["detail/" + this.sportID]);
      //this.getseiresMatchsList(this.sportID);
      this.callType = 1;
    }
  }
  searchExchange(e) {
    if (e.target.value != "") {
      this.loading = true;
      this.getSearchExchanges(e.target.value);
    } else {
      this.searchMatch = [];
    }
  }

  getSearchExchanges(teamname) {
    var sdata = { team_name: teamname };
    this._sportService.getSearchExchange(sdata).subscribe(
      (data) => {
        this.loading = false;
        if (!data.error) {
          var result = data.data;
          if (!isNullOrUndefined(result)) {
            this.searchMatch = result;
          }
        } else {
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  getSR(type) {
    if (type == "p1") {
      if (parseInt(this.scoreMatch[0].p1b) > 0) {
        var sr =
          (100 * parseInt(this.scoreMatch[0].p1r)) /
          parseInt(this.scoreMatch[0].p1b);
        return sr.toFixed(2);
      } else {
        return "0";
      }
    }
    if (type == "p2") {
      if (this.scoreMatch[0].p2b > 0) {
        var sr =
          (100 * parseInt(this.scoreMatch[0].p2r)) /
          parseInt(this.scoreMatch[0].p2b);
        return sr.toFixed(2);
      } else {
        return "0";
      }
    }
  }
  getCRR(type) {
    var scoreData = "";
    var over = "0";
    if (type == "p1") {
      if (this.scoreMatch[2].score == "") {
        scoreData = "0";
      } else {
        scoreData = this.scoreMatch[2].score;
      }

      if (this.scoreMatch[2].ballsdone == "") {
        over = "0";
      } else {
        var q = parseInt(this.scoreMatch[2].ballsdone) / 6;
        var r = parseInt(this.scoreMatch[2].ballsdone) % 6;
        over = q.toString().split(".")[0] + "." + r;
      }
      var currentRR = parseInt(scoreData) / parseInt(over);
    }

    if (type == "p2") {
      if (this.scoreMatch[2].score2 == "") {
        scoreData = "0";
      } else {
        scoreData = this.scoreMatch[2].score2;
      }

      if (this.scoreMatch[2].ballsdone2 == "") {
        over = "0";
      } else {
        var q = parseInt(this.scoreMatch[2].ballsdone2) / 6;
        var r = parseInt(this.scoreMatch[2].ballsdone2) % 6;
        over = q.toString().split(".")[0] + "." + r;
      }
      var currentRR = parseInt(scoreData) / parseInt(over);
    }
    return !isNaN(currentRR) ? currentRR.toFixed(2) : "0.00";
  }
  getScroboard(type) {
    var scoreData = "";

    var currentBattingTeam = this.scoreMatch[1].st;

    var team1Name = this.scoreMatch[2].team1;
    var team2Name = this.scoreMatch[2].team2;

    if (type == "p1") {
      if (currentBattingTeam != team1Name) {
        type = "p2";
      }
    } else if (type == "p2") {
      if (currentBattingTeam == team2Name) {
        type = "p1";
      }
    }

    if (type == "p1") {
      if (this.scoreMatch[2].score == "") {
        scoreData = "0";
      } else {
        scoreData = this.scoreMatch[2].score;
      }

      if (this.scoreMatch[2].wicket == "") {
        scoreData += "/0";
      } else {
        scoreData += "/" + this.scoreMatch[2].wicket;
      }

      if (this.scoreMatch[2].ballsdone == "") {
        scoreData += " (0 ov)";
      } else {
        var q = parseInt(this.scoreMatch[2].ballsdone) / 6;
        var r = parseInt(this.scoreMatch[2].ballsdone) % 6;
        scoreData += " (" + q.toString().split(".")[0] + "." + r + " ov)";
      }
    } else if (type == "p2") {
      if (this.scoreMatch[2].score2 == "") {
        scoreData = "0";
      } else {
        scoreData = this.scoreMatch[2].score2;
      }

      if (this.scoreMatch[2].wicket2 == "") {
        scoreData += "/0";
      } else {
        scoreData += "/" + this.scoreMatch[2].wicket2;
      }

      if (this.scoreMatch[2].ballsdone2 == "") {
        scoreData += " (0 ov)";
      } else {
        var q = parseInt(this.scoreMatch[2].ballsdone2) / 6;
        var r = parseInt(this.scoreMatch[2].ballsdone2) % 6;
        scoreData += " (" + q.toString().split(".")[0] + "." + r + " ov)";
      }
    }

    return scoreData;
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
  updateMatchStack(fancyData) {
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
              this.isShow = -1;
              this.isBetFairbet = -1;
              this.isBetFairEditStack = false;
              if (this.isSessionEditStack) {
                this.isSessionEditStack = false;
                fancyData.isBackBox = 0;
                fancyData.isbackClass = "";
                fancyData.isLayBox = 0;
                this.isSessionBet = -1;
                this._sportService.removeBackLay(fancyData);
              }

              //  this.GetCupBetsMarketList();
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
    try {
      if (this.matchForCricket != null) {
        clearTimeout(this.matchForCricket);
      }
      if (
        this._sessionService.get("match_id") != undefined &&
        this._sessionService.get("sport_id") != undefined
      ) {
        this.matchForCricket = setTimeout(
          () => {
            if (this.route.url == "/detail") {
              var sdata = {
                match_id: this._sessionService.get("match_id"),
                sport_id: this._sessionService.get("sport_id"),
              };
              this._cricketServices.getScoreBySportAndMatchId(sdata).subscribe(
                (data) => {
                  if (!data.error) {
                    var result = data.data;
                    if (isNullOrUndefined(result.odds.match_id)) {
                      this._sessionService.gotoDashboard();
                      return;
                    }
                    this._serverTime = data.currentTime;
                    if (this.safeGrapicSrc == null) {
                      this.safeGrapicSrc =
                        this.sanitizer.bypassSecurityTrustResourceUrl(
                          "https://stream.1ex99.in/sportRadarScore?eventId=" +
                            result.odds.match_id
                        );
                      this.isScoreActive = 1;
                    }
                    if (!isNullOrUndefined(result.odds.match_id)) {
                      //this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result.MatchDetails.MainTV);
                      this.safeSrc =
                        this.sanitizer.bypassSecurityTrustResourceUrl(
                          "https://stream.1ex99.in/tv2?EventId=" +
                            result.odds.match_id
                        );
                    } else {
                      if (!isNullOrUndefined(result.odds.tv_id)) {
                        if (this.safeSrc == null) {
                          this.safeSrc =
                            this.sanitizer.bypassSecurityTrustResourceUrl(
                              "https://stream.1ex99.in/tv2?EventId=" +
                                result.odds.tv_id
                            );
                        }
                      }
                    }
                    if (result.odds != null) {
                      if (this.callType == 1) {
                        this.cricketBetMatchMarkets = result.odds;
                        if (result.bm.market_id != undefined) {
                          this.BookerMakerMarket = result.bm;
                        } else {
                          this.BookerMakerMarket = null;
                        }

                        if (result.bmo.market_id != undefined) {
                          this.BookerMakerMarketManual = result.bmo;
                        } else {
                          this.BookerMakerMarketManual = null;
                        }

                        this.setcupBetMatchData(result.odds);
                        if (this.BookerMakerMarket != null) {
                          this.setcupBetMatchDataBook(result.bm);
                        }
                        if (this.BookerMakerMarketManual != null) {
                          this.setcupBetMatchDataBookManual(result.bmo);
                        }
                        for (
                          let i = 0;
                          i < this.cricketBetMatchMarkets.runner_json.length;
                          i++
                        ) {
                          this._sportService.AssignKeyInit(
                            this.cricketBetMatchMarkets.runner_json[i]
                              .selectionId,
                            this.cricketBetMatchMarkets.match_id,
                            this.cricketBetMatchMarkets.market_id
                          );
                        }
                        if (this.BookerMakerMarket != null) {
                          for (
                            let i = 0;
                            i < this.BookerMakerMarket.runner_json.length;
                            i++
                          ) {
                            this._sportService.AssignKeyInit(
                              this.BookerMakerMarket.runner_json[i].selectionId,
                              this.BookerMakerMarket.match_id,
                              this.BookerMakerMarket.market_id
                            );
                          }
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
                        if (this.cricketBetMatchMarkets == undefined) {
                          this.cricketBetMatchMarkets = result.odds;
                        } else if (
                          this.cricketBetMatchMarkets.market_id !=
                          result.odds.market_id
                        ) {
                          this.cricketBetMatchMarkets = result.odds;
                        }

                        if (
                          this.BookerMakerMarket == undefined ||
                          this.BookerMakerMarket == null
                        ) {
                          if (result.bm.market_id != undefined) {
                            this.BookerMakerMarket = result.bm;
                          } else {
                            this.BookerMakerMarket = null;
                          }
                        } else if (
                          this.BookerMakerMarket.market_id !=
                          result.bm.market_id
                        ) {
                          this.BookerMakerMarket = result.bm;
                        }
                        /**********BookerMakerMarketManual */
                        if (
                          this.BookerMakerMarketManual == undefined ||
                          this.BookerMakerMarketManual == null
                        ) {
                          if (result.bmo.market_id != undefined) {
                            this.BookerMakerMarketManual = result.bmo;
                          } else {
                            this.BookerMakerMarketManual = null;
                          }
                        } else if (
                          this.BookerMakerMarketManual.market_id !=
                          result.bmo.market_id
                        ) {
                          this.BookerMakerMarketManual = result.bmo;
                        }

                        this.setcupBetMatchData(result.odds);
                        if (this.BookerMakerMarket != null) {
                          this.setcupBetMatchDataBook(result.bm);
                        }

                        if (this.BookerMakerMarketManual != null) {
                          this.setcupBetMatchDataBookManual(result.bmo);
                        }
                      }
                    } else {
                      this.cricketBetMatchMarkets = [];
                      this.BookerMakerMarket = null;
                      this.BookerMakerMarketManual = null;
                    }
                    if (result.others != null) {
                      if (this.callType == 1) {
                        this.betFairMarket = result.others;
                        for (var i = 0; i < result.others.length; i++) {
                          this.setBetfairMatchData(result.others[i], i);
                          for (
                            let j = 0;
                            j < result.others[i].runner_json.length;
                            j++
                          ) {
                            this._sportService.AssignKeyInit(
                              result.others[i].runner_json[j].selectionId,
                              result.others[i].match_id,
                              result.others[i].market_id
                            );
                          }
                        }
                      } else {
                        if (this.betFairMarket.length == 0) {
                          this.betFairMarket = result.others;
                        } else if (
                          this.betFairMarket.length != result.others.length
                        ) {
                          this.betFairMarket = result.others;
                        } else if (
                          this.betFairMarket.market_id !=
                          result.others.market_id
                        ) {
                          this.betFairMarket = result.others;
                        }

                        for (var i = 0; i < result.others.length; i++) {
                          this.setBetfairMatchData(result.others[i], i);
                        }
                      }
                    } else {
                      this.betFairMarket = [];
                    }
                    this.sportID = this._sessionService.get("sport_id");
                    this.callType = 2;
                    this.getMatchScoreBySportAndMatchId();
                  }
                },
                (error) => {
                  this.callType = 2;
                  this.getMatchScoreBySportAndMatchId();
                }
              );
            }
          },
          this.callType == 1 ? 0 : 1000
        );
      } else {
        this.route.navigate(["/home"]);
      }
    } catch (e) {
      this.callType = 1;
      this.GetCricketMarketList();
    }
  }
  setcupBetMatchData(result) {
    try {
      if (result != null) {
        var cupBetMatch = result;
        this.cricketBetMatchMarkets.matchVolumn = cupBetMatch.matchVolumn;
        this.cricketBetMatchMarkets.BetAllowTimeBefore =
          cupBetMatch.BetAllowTimeBefore;
        this.cricketBetMatchMarkets.InplayStatus = cupBetMatch.InplayStatus;
        this.cricketBetMatchMarkets.IsBetAllow = cupBetMatch.IsBetAllow;
        this.cricketBetMatchMarkets.SportName = cupBetMatch.SportName;
        this.cricketBetMatchMarkets.SportmaxOddsLimt =
          cupBetMatch.SportmaxOddsLimt;
        this.cricketBetMatchMarkets.SportminOddsLimt =
          cupBetMatch.SportminOddsLimt;
        this.cricketBetMatchMarkets.backRateDiff = cupBetMatch.backRateDiff;
        this.cricketBetMatchMarkets.favMatchID = cupBetMatch.favMatchID;
        this.cricketBetMatchMarkets.layRateDiff = cupBetMatch.layRateDiff;
        this.cricketBetMatchMarkets.sportGraphic = cupBetMatch.sportGraphic;
        this.cricketBetMatchMarkets.sportScore = cupBetMatch.sportScore;
        this.cricketBetMatchMarkets.sportShowLastResult =
          cupBetMatch.sportShowLastResult;
        this.cricketBetMatchMarkets.sportShowTV = cupBetMatch.sportShowTV;
        this.cricketBetMatchMarkets.start_date = cupBetMatch.start_date;
        this.cricketBetMatchMarkets.adminMessage = cupBetMatch.adminMessage;

        var btBefor = this.cricketBetMatchMarkets.BetAllowTimeBefore;
        if (
          this.cricketBetMatchMarkets.start_date - btBefor >
          this._serverTime
        ) {
          this.cricketBetMatchMarkets.isDetail = false;
          var timeStamp = this._sportService.timeDifference(
            (this.cricketBetMatchMarkets.start_date - btBefor) * 1000,
            this._serverTime * 1000
          );

          this.cricketBetMatchMarkets.remainTime = timeStamp;
        } else {
          this.cricketBetMatchMarkets.isDetail = true;
          this.cricketBetMatchMarkets.remainTime = "Inplay";
        }
        if (
          cupBetMatch.runner_json != null &&
          cupBetMatch.runner_json != "null"
        ) {
          for (let i = 0; i < cupBetMatch.runner_json.length; i++) {
            var indx = this.cricketBetMatchMarkets.runner_json.findIndex(
              (x) => x.selectionId == cupBetMatch.runner_json[i].selectionId
            );
            if (indx > -1) {
              this.cricketBetMatchMarkets.runner_json[indx].GameStatus =
                cupBetMatch.runner_json[i].GameStatus;
              this.cricketBetMatchMarkets.runner_json[indx].WinAndLoss =
                cupBetMatch.runner_json[i].WinAndLoss;
              if (
                this.cricketBetMatchMarkets.runner_json[indx].ex
                  .availableToBack != undefined &&
                this.cricketBetMatchMarkets.runner_json[indx].ex.availableToBack
                  .length > 0
              ) {
                for (
                  var r = 0;
                  r <
                  this.cricketBetMatchMarkets.runner_json[indx].ex
                    .availableToBack.length;
                  r++
                ) {
                  try {
                    var oldBackBhav =
                      this.cricketBetMatchMarkets.runner_json[indx].ex
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
                      this.cricketBetMatchMarkets.runner_json[
                        indx
                      ].ex.availableToBack[r].price =
                        cupBetMatch.runner_json[i].ex.availableToBack[r].price;
                      this.cricketBetMatchMarkets.runner_json[
                        indx
                      ].ex.availableToBack[r].priceChanged =
                        newBackBhav.priceChanged;
                    }
                  } catch (e) {
                    // if (this.cricketBetMatchMarkets.runner_json[indx].ex.availableToBack[r] == undefined) {
                    this.cricketBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToBack[r].price = "--";
                    // }
                  }

                  try {
                    this.cricketBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToBack[r].size =
                      cupBetMatch.runner_json[i].ex.availableToBack[r].size;
                  } catch (e) {
                    // if (this.cricketBetMatchMarkets.runner_json[indx].ex.availableToBack[r] == undefined) {
                    this.cricketBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToBack[r].size = "--";
                    // }
                  }
                }
                if (
                  this.cricketBetMatchMarkets.runner_json[indx].ex
                    .availableToBack.length < 3
                ) {
                  var j =
                    3 -
                    this.cricketBetMatchMarkets.runner_json[indx].ex
                      .availableToBack.length;
                  var len =
                    this.cricketBetMatchMarkets.runner_json[indx].ex
                      .availableToBack.length;
                  for (let t = len; t < 3; t++) {
                    var data = { price: "--", size: "--" };

                    this.cricketBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToBack.push(data);
                  }
                }
              } else {
                this.cricketBetMatchMarkets.runner_json[
                  indx
                ].ex.availableToBack = [];

                for (let t = 0; t < 3; t++) {
                  var data = { price: "--", size: "--" };

                  this.cricketBetMatchMarkets.runner_json[
                    indx
                  ].ex.availableToBack.push(data);
                }
              }
              if (
                this.cricketBetMatchMarkets.runner_json[indx].ex
                  .availableToLay != undefined &&
                this.cricketBetMatchMarkets.runner_json[indx].ex.availableToLay
                  .length > 0
              ) {
                for (
                  var r = 0;
                  r <
                  this.cricketBetMatchMarkets.runner_json[indx].ex
                    .availableToLay.length;
                  r++
                ) {
                  try {
                    var oldBackBhav =
                      this.cricketBetMatchMarkets.runner_json[indx].ex
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
                      this.cricketBetMatchMarkets.runner_json[
                        indx
                      ].ex.availableToLay[r].price =
                        cupBetMatch.runner_json[i].ex.availableToLay[r].price;

                      this.cricketBetMatchMarkets.runner_json[
                        indx
                      ].ex.availableToLay[r].priceChanged =
                        newBackBhav.priceChanged;
                    }
                  } catch (e) {
                    // if (this.cricketBetMatchMarkets.runner_json[indx].ex.availableToLay[r] == undefined) {
                    this.cricketBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToLay[r].price = "--";
                    // }
                  }

                  try {
                    this.cricketBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToLay[r].size =
                      cupBetMatch.runner_json[i].ex.availableToLay[r].size;
                  } catch (e) {
                    // if (this.cricketBetMatchMarkets.runner_json[indx].ex.availableToLay[r] == undefined) {
                    this.cricketBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToLay[r].size = "--";
                    // }
                  }
                }
                if (
                  this.cricketBetMatchMarkets.runner_json[indx].ex
                    .availableToLay.length < 3
                ) {
                  var j =
                    3 -
                    this.cricketBetMatchMarkets.runner_json[indx].ex
                      .availableToLay.length;
                  var len =
                    this.cricketBetMatchMarkets.runner_json[indx].ex
                      .availableToLay.length;
                  for (let t = len; t < 3; t++) {
                    var data = { price: "--", size: "--" };

                    this.cricketBetMatchMarkets.runner_json[
                      indx
                    ].ex.availableToLay.push(data);
                  }
                }
              } else {
                this.cricketBetMatchMarkets.runner_json[
                  indx
                ].ex.availableToLay = [];
                for (var t = 0; t < 3; t++) {
                  var data = { price: "--", size: "--" };
                  this.cricketBetMatchMarkets.runner_json[
                    indx
                  ].ex.availableToLay.push(data);
                }
              }
            }
          }
        }
      }
      //console.log(this.cricketBetMatchMarkets);
    } catch (e) {}
  }
  setcupBetMatchDataBook(result) {
    try {
      if (result != null) {
        var cupBetMatch = result;
        this.BookerMakerMarket.matchVolumn = cupBetMatch.matchVolumn;
        this.BookerMakerMarket.BetAllowTimeBefore =
          cupBetMatch.BetAllowTimeBefore;
        this.BookerMakerMarket.InplayStatus = cupBetMatch.InplayStatus;
        this.BookerMakerMarket.IsBetAllow = cupBetMatch.IsBetAllow;
        this.BookerMakerMarket.SportName = cupBetMatch.SportName;
        this.BookerMakerMarket.SportmaxOddsLimt = cupBetMatch.SportmaxOddsLimt;
        this.BookerMakerMarket.SportminOddsLimt = cupBetMatch.SportminOddsLimt;
        this.BookerMakerMarket.backRateDiff = cupBetMatch.backRateDiff;
        this.BookerMakerMarket.favMatchID = cupBetMatch.favMatchID;
        this.BookerMakerMarket.layRateDiff = cupBetMatch.layRateDiff;
        this.BookerMakerMarket.sportGraphic = cupBetMatch.sportGraphic;
        this.BookerMakerMarket.sportScore = cupBetMatch.sportScore;
        this.BookerMakerMarket.sportShowLastResult =
          cupBetMatch.sportShowLastResult;
        this.BookerMakerMarket.sportShowTV = cupBetMatch.sportShowTV;
        this.BookerMakerMarket.start_date = cupBetMatch.start_date;
        this.BookerMakerMarket.adminMessage = cupBetMatch.adminMessage;

        var btBefor = this.BookerMakerMarket.BetAllowTimeBefore;
        if (this.BookerMakerMarket.start_date - btBefor > this._serverTime) {
          this.BookerMakerMarket.isDetail = false;
          var timeStamp = this._sportService.timeDifference(
            (this.BookerMakerMarket.start_date - btBefor) * 1000,
            this._serverTime * 1000
          );

          this.BookerMakerMarket.remainTime = timeStamp;
        } else {
          this.BookerMakerMarket.isDetail = true;
          this.BookerMakerMarket.remainTime = "Inplay";
        }
        if (
          cupBetMatch.runner_json != null &&
          cupBetMatch.runner_json != "null"
        ) {
          for (let i = 0; i < cupBetMatch.runner_json.length; i++) {
            var indx = this.BookerMakerMarket.runner_json.findIndex(
              (x) => x.selectionId == cupBetMatch.runner_json[i].selectionId
            );
            if (indx > -1) {
              this.BookerMakerMarket.runner_json[indx].GameStatus =
                cupBetMatch.runner_json[i].GameStatus;
              this.BookerMakerMarket.runner_json[indx].WinAndLoss =
                cupBetMatch.runner_json[i].WinAndLoss;
              if (
                this.BookerMakerMarket.runner_json[indx].ex.availableToBack !=
                  undefined &&
                this.BookerMakerMarket.runner_json[indx].ex.availableToBack
                  .length > 0
              ) {
                for (
                  var r = 0;
                  r <
                  this.BookerMakerMarket.runner_json[indx].ex.availableToBack
                    .length;
                  r++
                ) {
                  try {
                    var oldBackBhav =
                      this.BookerMakerMarket.runner_json[indx].ex
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
                      this.BookerMakerMarket.runner_json[
                        indx
                      ].ex.availableToBack[r].price =
                        cupBetMatch.runner_json[i].ex.availableToBack[r].price;

                      this.BookerMakerMarket.runner_json[
                        indx
                      ].ex.availableToBack[r].priceChanged =
                        newBackBhav.priceChanged;
                    }
                    if (
                      isNaN(
                        this.BookerMakerMarket.runner_json[indx].ex
                          .availableToBack[r].price
                      )
                    ) {
                      this.BookerMakerMarket.runner_json[
                        indx
                      ].ex.availableToBack[r].price = "--";
                    }
                  } catch (e) {
                    this.BookerMakerMarket.runner_json[indx].ex.availableToBack[
                      r
                    ].price = "--";
                  }

                  try {
                    this.BookerMakerMarket.runner_json[indx].ex.availableToBack[
                      r
                    ].size =
                      cupBetMatch.runner_json[i].ex.availableToBack[r].size;
                  } catch (e) {
                    this.BookerMakerMarket.runner_json[indx].ex.availableToBack[
                      r
                    ].size = "--";
                  }
                }
                if (
                  this.BookerMakerMarket.runner_json[indx].ex.availableToBack
                    .length < 3
                ) {
                  var j =
                    3 -
                    this.BookerMakerMarket.runner_json[indx].ex.availableToBack
                      .length;
                  var len =
                    this.BookerMakerMarket.runner_json[indx].ex.availableToBack
                      .length;
                  for (let t = len; t < 3; t++) {
                    var data = { price: "--", size: "--" };

                    this.BookerMakerMarket.runner_json[
                      indx
                    ].ex.availableToBack.push(data);
                  }
                }
              } else {
                this.BookerMakerMarket.runner_json[indx].ex.availableToBack =
                  [];

                for (let t = 0; t < 3; t++) {
                  var data = { price: "--", size: "--" };

                  this.BookerMakerMarket.runner_json[
                    indx
                  ].ex.availableToBack.push(data);
                }
              }
              if (
                this.BookerMakerMarket.runner_json[indx].ex.availableToLay !=
                  undefined &&
                this.BookerMakerMarket.runner_json[indx].ex.availableToLay
                  .length > 0
              ) {
                for (
                  var r = 0;
                  r <
                  this.BookerMakerMarket.runner_json[indx].ex.availableToLay
                    .length;
                  r++
                ) {
                  try {
                    var oldBackBhav =
                      this.BookerMakerMarket.runner_json[indx].ex
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
                      this.BookerMakerMarket.runner_json[
                        indx
                      ].ex.availableToLay[r].price =
                        cupBetMatch.runner_json[i].ex.availableToLay[r].price;

                      this.BookerMakerMarket.runner_json[
                        indx
                      ].ex.availableToLay[r].priceChanged =
                        newBackBhav.priceChanged;
                    }

                    if (
                      isNaN(
                        this.BookerMakerMarket.runner_json[indx].ex
                          .availableToLay[r].price
                      )
                    ) {
                      this.BookerMakerMarket.runner_json[
                        indx
                      ].ex.availableToLay[r].price = "--";
                    }
                  } catch (e) {
                    this.BookerMakerMarket.runner_json[indx].ex.availableToLay[
                      r
                    ].price = "--";
                  }

                  try {
                    this.BookerMakerMarket.runner_json[indx].ex.availableToLay[
                      r
                    ].size =
                      cupBetMatch.runner_json[i].ex.availableToLay[r].size;
                  } catch (e) {
                    this.BookerMakerMarket.runner_json[indx].ex.availableToLay[
                      r
                    ].size = "--";
                  }
                }
                if (
                  this.BookerMakerMarket.runner_json[indx].ex.availableToLay
                    .length < 3
                ) {
                  var j =
                    3 -
                    this.BookerMakerMarket.runner_json[indx].ex.availableToLay
                      .length;
                  var len =
                    this.BookerMakerMarket.runner_json[indx].ex.availableToLay
                      .length;
                  for (let t = len; t < 3; t++) {
                    var data = { price: "--", size: "--" };

                    this.BookerMakerMarket.runner_json[
                      indx
                    ].ex.availableToLay.push(data);
                  }
                }
              } else {
                this.BookerMakerMarket.runner_json[indx].ex.availableToLay = [];
                for (var t = 0; t < 3; t++) {
                  var data = { price: "--", size: "--" };
                  this.BookerMakerMarket.runner_json[
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
  getScoreBySportId() {
    if (this.matchScore != null) {
      clearTimeout(this.matchScore);
    }

    if (
      this._sessionService.get("match_id") != undefined &&
      this._sessionService.get("sport_id") != undefined
    ) {
      this.matchScore = setTimeout(
        () => {
          if (this.route.url == "/detail") {
            var sdata = {
              match_id: this._sessionService.get("match_id"),
              sport_id: this._sessionService.get("sport_id"),
            };
            this._cricketServices
              .getScoreBySportId(this._sessionService.get("match_id"))
              .subscribe(
                (data) => {
                  if (!data.error) {
                    if (!isNullOrUndefined((this.scoreMatch = data.data))) {
                      if (this.scoreMatch.length > 0) {
                        if (this.scoreMatch.length > 1) {
                          this.scoreMatch[0].totalOver = Math.ceil(
                            parseInt(this.scoreMatch[2].ballsdone) / 6
                          );
                        }
                      }
                    } else {
                      this.scoreMatch = [];
                    }
                  }
                  this.getScoreBySportId();
                },
                (error) => {
                  this.getScoreBySportId();
                }
              );
          }
        },
        this.callType == 1 ? 100 : 5000
      );
    } else {
      this.route.navigate(["/home"]);
    }
  }
  // getMatchBetAndFancyBetList() {
  //   console.log('HITESH2');
  //   if (this._sessionService.get('match_id') != undefined && this._sessionService.get('sport_id') != undefined) {

  //     if (this.route.url == '/detail-cricket') {
  //       var sdata = { 'limit': 10, 'match_id': this._sessionService.get('match_id'), 'market_id': '0', 'fancy_id': 0, 'pageno': 1 };
  //       this._sportService.getBetsByMatchFancyORMarketeId(sdata).subscribe(data => {
  //         if (!data.error) {
  //           this.MatchBetList = data.data;
  //           //this.getMatchBetAndFancyBetList();
  //         }
  //       }, error => {
  //       });
  //     }

  //   }
  //   else {
  //     this.route.navigate(["/home"]);
  //   }
  // }

  getColor(inv) {
    if (parseInt(inv) >= 0) {
      if (parseInt(inv) > 0) {
        if (parseInt(inv) == 4) {
          return "#325deb"; //BLUE
        } else if (parseInt(inv) == 6) {
          return "#4ec258"; //GREEN
        }
        return "#9c9c9c"; //GRAY
      } else {
        return "#9c9c9c"; //GRAY
      }
    } else if (inv == "W") {
      return "red"; //RED
    } else {
      return "#e67914"; //ORANGE
    }
  }

  getScoreboardOverlayMessage(message: String) {
    if (message.toLowerCase().indexOf("break") !== -1) {
      return message;
    } else if (message.toLowerCase().indexOf("stumps") !== -1) {
      return message;
    } else if (message.toLowerCase().indexOf("won") !== -1) {
      return message;
    } else if (message.toLowerCase().indexOf("stop") !== -1) {
      return message;
    }

    return "";
  }

  GetCricketMarketList() {
    try {
      if (this.route.url == "/detail") {
        var sdata = {
          match_id: this._sessionService.get("match_id"),
          sport_id: this._sessionService.get("sport_id"),
        };
        this._cricketServices
          .GetLiveTvAndScore(
            this._sessionService.get("match_id"),
            this._sessionService.get("sport_id")
          )
          .subscribe(
            (data) => {
              if (!data.error) {
                var result = data.data;
                if (isNullOrUndefined(result)) {
                  this.route.navigate(["home"]);
                  return;
                }
                if (result != null) {
                  if (this.safeSrc == null) {
                    this.safeSrc =
                      this.sanitizer.bypassSecurityTrustResourceUrl(
                        result.MatchDetails.PlayTv1
                      );
                    this.isScoreActive = 1;
                  }
                  if (this.safeGrapicSrc == null) {
                    this.safeGrapicSrc =
                      this.sanitizer.bypassSecurityTrustResourceUrl(
                        "https://stream.1ex99.in/sportRadarScore?eventId=" +
                          result.MatchDetails.match_id
                      );
                    this.isScoreActive = 1;
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
                  }
                  // if (this.safeGrapicSrc == null && this.safeSrc == null) {
                  //   if (!isNullOrUndefined(result.scoreUrl) && !isNullOrUndefined(result.streamingUrl)) {
                  //     this.safeGrapicSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result.scoreUrl);
                  //     this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result.streamingUrl);
                  //   } else if (isNullOrUndefined(result.scoreUrl) && !isNullOrUndefined(result.streamingUrl)) {
                  //     this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result.streamingUrl);
                  //   } else if (!isNullOrUndefined(result.scoreUrl) && isNullOrUndefined(result.streamingUrl)) {
                  //     this.safeGrapicSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result.scoreUrl);
                  //   }
                  // }
                }
              }
            },
            (error) => {
              this.GetCricketMarketList();
            }
          );
      }
    } catch (e) {
      this.GetCricketMarketList();
    }
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
          this.betFairMarket[ind].start_date = cupBetMatch.start_date;
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
                      // if (this.betFairMarket[ind].runner_json[indx].ex.availableToLay[r] == undefined) {
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
                      // if (this.betFairMarket[ind].runner_json[indx].ex.availableToLay[r] == undefined) {
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
            return result.toFixed(2);
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
            return result.toFixed(2);
          }
        } else {
          return "--";
        }
      } else if (type == "size") {
        if (isNaN(value)) {
          return "--";
        }
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

  getSessionByMatchId() {
    this.matchSession = setTimeout(
      () => {
        if (this.route.url == "/detail") {
          var sdata = {
            match_id: this._sessionService.get("match_id"),
          };
          this._cricketServices
            .getSessionByMatchId(this._sessionService.get("match_id"))
            .subscribe(
              (data) => {
                if (!data.error) {
                  var result = data.data;
                  if (result != null) {
                    var sessionList = result;
                    if (this.sessionType == 1) {
                      this.fancyList = sessionList;
                    } else {
                      if (sessionList.length != this.fancyList.length) {
                        this.fancyList = sessionList;
                      } else {
                        for (var s = 0; s < this.fancyList.length; s++) {
                          var indx = sessionList.findIndex(
                            (x) => x.SelectionId == sessionList[s].SelectionId
                          );
                          if (indx > -1) {
                            if (
                              sessionList[indx].BackPrice1 >
                              this.fancyList[s].BackPrice1
                            ) {
                              this.fancyList[s].backpriceChanged = 1;
                            } else if (
                              sessionList[indx].BackPrice1 <
                              this.fancyList[s].BackPrice1
                            ) {
                              this.fancyList[s].backpriceChanged = 2;
                            } else {
                              this.fancyList[s].backpriceChanged = 0;
                            }

                            if (
                              sessionList[indx].LayPrice1 >
                              this.fancyList[s].LayPrice1
                            ) {
                              this.fancyList[s].laypriceChanged = 1;
                            } else if (
                              sessionList[indx].LayPrice1 <
                              this.fancyList[s].LayPrice1
                            ) {
                              this.fancyList[s].laypriceChanged = 2;
                            } else {
                              this.fancyList[s].laypriceChanged = 0;
                            }

                            this.fancyList[s].BackPrice1 =
                              sessionList[indx].BackPrice1;
                            this.fancyList[s].BackSize1 =
                              sessionList[indx].BackSize1;
                            this.fancyList[s].LayPrice1 =
                              sessionList[indx].LayPrice1;
                            this.fancyList[s].LaySize1 =
                              sessionList[indx].LaySize1;
                            this.fancyList[s].inplayStatus =
                              sessionList[indx].inplayStatus;
                            this.fancyList[s].scorePostion =
                              sessionList[indx].scorePostion;
                            this.fancyList[s].adminMessage =
                              sessionList[indx].adminMessage;
                            this.fancyList[s].minStack =
                              sessionList[indx].minStack;
                            this.fancyList[s].maxStack =
                              sessionList[indx].maxStack;
                            this.fancyList[s].maxProfit =
                              sessionList[indx].maxProfit;
                            this.fancyList[s].BetAllowTimeBefore =
                              sessionList[indx].BetAllowTimeBefore;
                            this.fancyList[s].start_date =
                              sessionList[indx].start_date;

                            var btBefor = this.fancyList[s].BetAllowTimeBefore;
                            if (
                              this.fancyList[s].start_date - btBefor >
                              this._serverTime
                            ) {
                              this.fancyList[s].isDetail = false;
                              var timeStamp = this._sportService.timeDifference(
                                (this.fancyList[s].start_date - btBefor) * 1000,
                                this._serverTime * 1000
                              );
                              this.fancyList[s].remainTime = timeStamp;
                            } else {
                              this.fancyList[s].isDetail = true;
                              this.fancyList[s].remainTime = "Inplay";
                            }
                          } else {
                            this.fancyList[s].BackPrice1 = "";
                            this.fancyList[s].BackSize1 = "";
                            this.fancyList[s].LayPrice1 = "";
                            this.fancyList[s].LaySize1 = "";
                            this.fancyList[s].inplayStatus = "";
                            this.fancyList[s].isDetail = true;
                          }
                        }
                      }
                    }
                  } else {
                    this.fancyList = [];
                  }
                  this.sessionType = 2;
                  this.getSessionByMatchId();
                }
              },
              (error) => {
                this.sessionType = 2;
                this.getSessionByMatchId();
              }
            );
        }
      },
      this.sessionType == 1 ? 0 : 1000
    );
  }

  public needFancyBlink(data, type) {
    if (!this._sessionService.oddsBlinkAvailable) {
      return "";
    }
    if (isNullOrUndefined(data)) {
      return "";
    }

    if (type == "back") {
      if (isNullOrUndefined(data.backpriceChanged)) {
        return "";
      }

      var change = data.backpriceChanged;
      if (change != 0) {
        setTimeout(() => {
          data.backpriceChanged = 0;
        }, 200);

        if (change == 1) {
          return "bg-blue-blink";
        } else if (change == 2) {
          return "bg-red-blink";
        } else {
          return "";
        }
      }
      return "";
    } else if (type == "lay") {
      if (isNullOrUndefined(data.laypriceChanged)) {
        return "";
      }

      var change = data.laypriceChanged;
      if (change != 0) {
        setTimeout(() => {
          data.laypriceChanged = 0;
        }, 200);

        if (change == 1) {
          return "bg-blue-blink";
        } else if (change == 2) {
          return "bg-red-blink";
        } else {
          return "";
        }
      }
      return "";
    }

    return 0;
  }

  login = function () {
    this.isValidFormSubmitted = false;
    if (this.login_form.invalid) {
      return true;
    } else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var loginDetail = this.login_form.value;
      var data = {
        user_name: loginDetail.username,
        password: loginDetail.password,
      };
      this.loginservice.loginSave(data).subscribe(
        (response) => {
          if (!response.error) {
            this._sessionService.set("slug", response.data.token);
            this._sessionService.set("userName", response.data.user_name);
            if (
              !isNullOrUndefined(response.data.is_rules_displayed) &&
              response.data.is_rules_displayed != ""
            ) {
              this._sessionService.set(
                "is_rules_displayed",
                response.data.is_rules_displayed
              );
              this._sessionService.set("ruleType", response.data.ruleType);
            }

            this.getBalance();
          } else {
            this._sessionService.notifier.notify("error", response.message);
          }

          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify(
                "error",
                "Internet not available."
              );
            }
          }
        }
      );
    }
  };

  getBalance = function () {
    this.loginservice.getbalance().subscribe(
      (response) => {
        if (!response.error) {
          var result = response.data;
          this._sessionService.set("avater", result.avatar);
          this._sessionService.set("liability", result.liability);
          this._sessionService.set("balance", result.balance);
          this._sessionService.set("bonus_balance", result.bonus_balance);
          this._sessionService.set("profit_loss", result.profit_loss);
          this._sessionService.set("freechips", result.freechips);
          this._sessionService.set("timezone_value", result.timezone_value);
          this._sessionService.set("site_message", result.site_message);
          //this._sessionService.notifier.notify('success', 'Login Successfull');
          window.location.href =
            "https://" + environment.domain + "/userdashboard";
          // window.location.href = 'http://localhost:4200/userdashboard';
          //this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        this.getBalance();
      }
    );
  };

  CheckUserExist = function (e) {
    if (e.target.value != "" && e.target.value.length > 5) {
      var data = {
        username: e.target.value,
      };
      this.loading = true;
      this.loginservice.IsUserExist(data).subscribe(
        (response) => {
          if (!response.error) {
            this._sessionService.notifier.notify("success", response.message);
            this.isUser = true;
          } else {
            this._sessionService.notifier.notify("error", response.message);
            this.isUser = false;
          }
          this.loading = false;
        },
        (error) => {
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
          this.loading = false;
        }
      );
    }
  };
  registerSave = function () {
    this.isValidFormSubmitted = false;
    if (this.register_form.invalid || !this.isUser) {
      return;
    } else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj = this.register_form.value;
      var data = {
        name: obj.name,
        username: obj.username,
        email: obj.email,
        mobile: obj.mobile,
        //device_type: 'W',
        password: obj.newPassword,
        confirmpassword: obj.newPassword,
        referralid: obj.referralid,
      };
      this.loginservice.saveUser(data).subscribe(
        (response) => {
          if (!response.error) {
            this._sessionService.notifier.notify("success", response.message);
            this.formReset();
            this.IsRegistrationShow = false;
          } else {
            this._sessionService.notifier.notify("error", response.message);
          }
          this.loading = false;
        },
        (error) => {
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
          this.loading = false;
        }
      );
    }
  };
  formReset() {
    this.isValidFormSubmitted = null;
    this.register_form.reset();
  }

  // Only AlphaNumeric with Some Characters [-_ ]
  keyPressAlphaNumericWithCharacters(event) {
    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  timeConverter(UNIX_timestamp) {
    var timeZone = "19800";
    var c = parseInt(timeZone);
    var date = new Date(UNIX_timestamp * 1000);
    var localUtcMillisec =
      date.getTime() + date.getTimezoneOffset() * 60 * 1000 + c * 1000;
    date = new Date(localUtcMillisec);
    return date;
  }

  openSideMenu() {
    $("body").toggleClass("mobile-show");
  }

  closeSideMenu() {
    $("body").removeClass("mobile-show");
  }
  onlyNumber = function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };
  loginPage() {
    this.route.navigate(["/login"]);
  }
  showModalSign() {
    //this.showModalSignup = true; // Show-Hide Modal Check
    $("#singupPopup").modal("show");
    this.hideModalLogin();
    this.formReset();
  }
  showModalLog() {
    //this.showModalLogin = true; // Show-Hide Modal Check
    $("#loginPopup").modal("show");
    this.hideModalSignup();
    this.formReset();
  }
  hideModalSignup() {
    //this.showModalSignup = false;
    $("#singupPopup").modal("hide");
  }
  hideModalLogin() {
    //this.showModalLogin = false;
    $("#loginPopup").modal("hide");
  }
  showReg() {
    this.showRegModal = true; // Show-Hide Modal Check
  }
  hideReg() {
    this.showRegModal = false;
  }
  CheckUserNameExist = function (e) {
    if (e.target.value != "" && e.target.value.length > 5) {
      var data = {
        username: e.target.value,
      };
      this.loading = true;
      this.loginservice.CheckUserNameExist(data).subscribe(
        (response) => {
          if (!response.error) {
            this._sessionService.notifier.notify("success", response.message);
          } else {
            this._sessionService.notifier.notify("error", response.message);
            this.isUser = false;
          }
          this.loading = false;
        },
        (error) => {
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
          this.loading = false;
        }
      );
    }
  };

  showHidePassword() {
    if ($("#show_hide_password").attr("type") == "text") {
      $("#show_hide_password").attr("type", "password");
      $(".Passcode-visible i").addClass("fa-eye-slash");
      $(".Passcode-visible i").removeClass("fa-eye");
    } else if ($("#show_hide_password").attr("type") == "password") {
      $("#show_hide_password").attr("type", "text");
      $(".Passcode-visible i").removeClass("fa-eye-slash");
      $(".Passcode-visible i").addClass("fa-eye");
    }
  }
  sendOtp(mobile) {
    if (mobile != "") {
      var data = {
        mobile: mobile,
      };
      this.loading = true;
      this.otpShow = true;
      this.loginservice.sendOtp(data).subscribe(
        (response) => {
          if (!response.error) {
            this._sessionService.notifier.notify("success", response.message);
            this.isUser = false;
            this.mobilenumber = mobile;
          } else {
            this._sessionService.notifier.notify("error", response.message);
            this.isUser = false;
          }
          this.mobilenumber = mobile;
          this.loading = false;
        },
        (error) => {
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
          this.loading = false;
        }
      );
    }
  }

  resendOtp() {
    this.sendOtp(this.mobilenumber);
  }

  CheckValidOtp = function (e) {
    if (e.target.value != "") {
      var data = {
        mobile: this.mobilenumber,
        otp: e.target.value,
      };
      this.loading = true;
      this.loginservice.CheckValidOtp(data).subscribe(
        (response) => {
          if (!response.error) {
            this._sessionService.notifier.notify("success", response.message);
            this.isUser = true;
            $(".otpvalid").html("");
          } else {
            $(".otpvalid").html(response.message);
            //this._sessionService.notifier.notify('error', response.message);
            this.isUser = false;
          }
          this.loading = false;
        },
        (error) => {
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
          this.loading = false;
        }
      );
    }
  };

  CheckUserMobileExist = function () {
    let mobileNumber = $("#phone").val();
    if (mobileNumber != "") {
      var data = { mobile: mobileNumber };
      this.loading = true;
      this.loginservice.CheckUserMobileExist(data).subscribe(
        (response) => {
          if (!response.error) {
            //this._sessionService.notifier.notify('success', response.message);
            $(".existnumber").html("");
            this.sendOtp(mobileNumber);
          } else {
            $(".existnumber").html(response.message);
            //this._sessionService.notifier.notify('error', response.message);
            this.isUser = false;
          }
          this.loading = false;
        },
        (error) => {
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
          this.loading = false;
        }
      );
    }
  };
  GoToDetailPage(sport) {
    //if (sport.IsBetAllow == 'Y') {
    this._sportService.callType = 1;
    if (sport.sport_id == 4) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.route.navigate(["/cricket-details"]);
    } else if (sport.sport_id == 1) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.route.navigate(["/soccer-details"]);
    } else if (sport.sport_id == 2) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.route.navigate(["/tennis-details"]);
    } else if (sport.sport_id == this._sessionService.casino_id_XPG) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this._sessionService.set("match_name", sport.name);
      this.route.navigate(["/lobbygame"]);
    }
    // }
    // else {
    //   this.route.navigate(["/dashboard"]);
    // }
  }
  setBetBoxBetFair(type, cuprenners, betfair) {
    this.isShow = -1;
    this.isSessionBet = -1;
    this.isShowBM = -1;
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
        //this.saveSportBetData(cuprenners, betfair);
      }

      this.isBetFairbet = -1;
    } else {
      this.isBetFairEditStack = false;
    }
  }
  setBetBoxForSession(type, cuprenners) {
    this.isShow = -1;
    this.isBetFairbet = -1;
    this.isSessionBet = -1;
    this.isShowBM = -1;
    if (type == "back") {
      cuprenners.isbackClass = "isbackclass";
      cuprenners.islayClass = "";
      cuprenners.isBackBox = 1;
      cuprenners.isLayBox = 0;
      cuprenners.odds = cuprenners.BackPrice1;
      cuprenners.size = cuprenners.BackSize1;
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
      cuprenners.type = "1";
    } else if (type == "lay") {
      cuprenners.isbackClass = "";
      cuprenners.islayClass = "islayclass";
      cuprenners.isLayBox = 1;
      cuprenners.isBackBox = 0;
      cuprenners.odds = cuprenners.LayPrice1;
      cuprenners.size = cuprenners.LaySize1;
      cuprenners.type = "0";
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
    }
    cuprenners.stack = 0;
    cuprenners.market_id = this.cricketBetMatchMarkets.market_id;
    cuprenners.match_id = this.cricketBetMatchMarkets.match_id;
    this._sportService.AddBackOrLay(cuprenners);
    if (this._sportService.oneClickShow) {
      if (this.selectedOneClick == 0) {
        this._sessionService.notifier.notify(
          "error",
          "Please select one click stack."
        );
      } else {
        cuprenners.stack = this.selectedOneClick;
        //this.saveSportBetData(cuprenners, 'session');
      }

      this.isShow = -1;
    } else {
      this.isEditStack = false;
      this.isSessionEditStack = false;
    }
  }
  setBetBox(type, cuprenners) {
    this.isShow = -1;
    this.isBetFairbet = -1;
    this.isSessionBet = -1;
    this.isShowBM = -1;
    if (type == "back") {
      cuprenners.isbackClass = "isbackclass";
      cuprenners.islayClass = "";
      cuprenners.isBackBox = 1;
      cuprenners.isLayBox = 0;
      cuprenners.odds = this.retrunValue(
        "back",
        this.cricketBetMatchMarkets,
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
        this.cricketBetMatchMarkets,
        cuprenners.ex.availableToLay[0].price
      );
      cuprenners.type = "0";
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
    }
    cuprenners.stack = 0;
    cuprenners.market_id = this.cricketBetMatchMarkets.market_id;
    cuprenners.match_id = this.cricketBetMatchMarkets.match_id;
    this._sportService.AddBackOrLay(cuprenners);
    if (this._sportService.oneClickShow) {
      if (this.selectedOneClick == 0) {
        this._sessionService.notifier.notify(
          "error",
          "Please select one click stack."
        );
      } else {
        cuprenners.stack = this.selectedOneClick;
        //this.saveSportBetData(cuprenners, 0);
      }

      this.isShow = -1;
    } else {
      this.isEditStack = false;
    }
  }
  setBetBoxBook(type, cuprenners) {
    this.isShow = -1;
    this.isBetFairbet = -1;
    this.isSessionBet = -1;
    if (type == "back") {
      cuprenners.isbackClass = "isbackclass";
      cuprenners.islayClass = "";
      cuprenners.isBackBox = 1;
      cuprenners.isLayBox = 0;
      cuprenners.odds = this.retrunValue(
        "back",
        this.BookerMakerMarket,
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
        this.BookerMakerMarket,
        cuprenners.ex.availableToLay[0].price
      );
      cuprenners.type = "0";
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
    }
    cuprenners.stack = 0;
    cuprenners.market_id = this.BookerMakerMarket.market_id;
    cuprenners.match_id = this.BookerMakerMarket.match_id;
    this._sportService.AddBackOrLay(cuprenners);
    if (this._sportService.oneClickShow) {
      if (this.selectedOneClick == 0) {
        this._sessionService.notifier.notify(
          "error",
          "Please select one click stack."
        );
      } else {
        cuprenners.stack = this.selectedOneClick;
        //this.saveSportBetData(cuprenners, 0);
      }

      this.isShowBM = -1;
    } else {
      this.isEditStack = false;
    }
  }
}
