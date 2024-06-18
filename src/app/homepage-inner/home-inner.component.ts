import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { SessionService } from "../service/session.service";
import { SportsListService } from "./home-inner.service";
import { SportServiceService } from "../service/sport-service.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { isNullOrUndefined } from "util";
import { DatePipe } from "@angular/common";
import { log } from "console";
import { browserRefresh } from "../app.component";
import { filter } from "rxjs/operators";
import { DashboardService } from "../dashboard/dashboard.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { environment } from "../../environments/environment";
import { LoginServiceService } from "../service/login-service.service";

declare const $: any;

@Component({
  selector: "app-home-inner",
  templateUrl: "./home-inner.component.html",
  styleUrls: [],
})
export class HomeInnerComponent implements OnInit, AfterViewInit {
  time = new Date();
  loading = false;
  HorseId = 7;
  GreyHoundId = 4339;
  newPassword;
  confPassword;
  isValidFormSubmitted = null;
  matchForCricket: any;
  inplayCount: any = 0;
  upcomingCount: any = 0;
  currentTime: any;
  sportIDS = null;
  callType: any = 1;
  isSidebarHome = false;
  isDesktop = false;
  isMobile = false;
  isSidebarDashboard = false;
  lobbyName = "";
  banner: any;
  bannerMobile: any;
  casinoListData: any = [];
  casinoListDataByBlackjack: any = [];
  casinoListDataByRoulette: any = [];
  casinoListDataByBaccarat: any = [];
  casinoListDataBySlots: any = [];
  safeSrc = null;
  settingData: any = [];
  signUpStatus: any;
  siteTitle = "";
  sitelogo = "";
  sitefavicon = "";
  adminLink = "";
  sportsList = null;
  currentPosition = 0;
  transitionDuration = "0.5s"; // Initial transition duration
  interval: any;
  slides: any;
  limit = 20;
  imagess: any;

  changePass_form = new FormGroup({
    curPassword: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required]),
    confPassword: new FormControl(null, [Validators.required]),
  });
  constructor(
    private _dashboardService: DashboardService,
    private sportsListService: SportsListService,
    private router: Router,
    private _sessionService: SessionService,
    public _sportService: SportServiceService,
    private sanitizer: DomSanitizer,
    private imageslist: LoginServiceService,
    private bannerlist: LoginServiceService
  ) {}

  ngOnDestroy() {
    if (this.pipSub != null) {
      this.pipSub.unsubscribe();
    }
  }

  pipSub: any = null;
  ngOnInit() {
    this.imageslist.getCasinoList().subscribe(
      (response) => {
        this.slides = response.data.liveCasinoList;
        // console.log(this.slides);
      },
      (error) => {
        // console.error(error);
      }
    );

    this.bannerlist.getbannerList().subscribe(
      (response) => {
        this.imagess = response.data;
        //  console.log(this.imagess);
      },
      (error) => {
        //        console.error(error);
      }
    );
    if (browserRefresh) {
      this._sessionService.gotoLoginPage();
      return;
    }
    this.callGetSportsList();
    this.getBanner();
    this.getBannerMobile();
    this.getCasinoListData();
    this.getCasinoListByBlackjack();
    this.getCasinoListByRoulette();
    this.getCasinoListByBaccarat();
    this.getCasinoListBySlots();
    this.closeMenu();
    this._sportService.getBalance();
    this.getseiresMatchsList();
    this.getDefaultSetting();
    if (this.router.url == "/userdashboard") {
      this.isSidebarHome = true;
    } else if (this.router.url == "/dashboard") {
      this.isSidebarDashboard = true;
    }
    this.adminLink = environment.admindomain;
  }

  ngAfterViewInit() {
    $(".game-slider").owlCarousel({
      items: 7,
      loop: false,
      autoplay: false,
      smartSpeed: 2700,
      margin: 5,
      dots: true,
      responsive: {
        320: {
          items: 3,
        },
        480: {
          items: 4,
        },
        576: {
          items: 3,
        },
        768: {
          items: 4,
        },
        1024: {
          items: 5,
        },
        1200: {
          items: 6,
        },
        1350: {
          items: 7,
        },
      },
    });
    $(".partner-slider").owlCarousel({
      items: 7,
      loop: false,
      autoplay: false,
      smartSpeed: 2700,
      margin: 15,
      dots: true,
      responsive: {
        320: {
          items: 3,
        },
        480: {
          items: 3,
        },
        576: {
          items: 4,
        },
        768: {
          items: 4,
        },
        1024: {
          items: 3,
        },
        1200: {
          items: 3,
        },
        1350: {
          items: 3,
        },
      },
    });
  }
  callGetSportsList() {
    var sdata = { limit: 10, pageno: 1 };
    this.sportsListService.GetSports(sdata).subscribe(
      (data) => {
        this.sportsList = data.data;
      },
      (error) => {}
    );
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
  getBanner() {
    var sdata = { domain_id: 1 };
    this._sportService.getBanner(sdata).subscribe(
      (data) => {
        var result = data.data;
        if (isNullOrUndefined(result)) {
          return;
        } else {
          this.banner = result;
        }
      },
      (error) => {}
    );
  }
  getBannerMobile() {
    var sdata = { domain_id: 1 };
    this._sportService.getBannerMobile(sdata).subscribe(
      (data) => {
        var result = data.data;
        if (isNullOrUndefined(result)) {
          return;
        } else {
          this.bannerMobile = result;
        }
      },
      (error) => {}
    );
  }
  closeMenu() {
    $(".sidenav2").removeClass("active");
    $(".sports-drop-bx").removeClass("active");
  }
  showModalComingSoon() {
    $("#comingsoonPopup").modal("show");
  }
  getseiresMatchsList() {
    if (this.router.url != "/detail-cricket") {
      var sdata = {
        limit: 100,
        pageno: 1,
        sport_id: 0,
        series_id: 0,
        type: "",
      };
      this.sportsListService.getseiresMatchsList(sdata).subscribe(
        (data) => {
          if (this.matchForCricket != null) {
            clearTimeout(this.matchForCricket);
          }

          if (!data.error) {
            var result = data;
            if (!isNullOrUndefined(result)) {
              //this._sportService.updateBetAllowTimeInResponse(result.UpCommingMatches)
              this._sportService.setMatchDataHome(result);
              this.currentTime = result.currentTime;
              this.inplayCount =
                this._sportService._ListMatchbySport.InplayMatches.length;
              this.upcomingCount =
                this._sportService._ListMatchbySport.UpCommingMatches.length;
            }
          }
          this._sportService._loading = false;

          this.matchForCricket = setTimeout(
            () => {
              this.getseiresMatchsList();
              this.callType++;
            },
            this.callType == 1 ? 0 : 15000
          );
          //this.sportsList = data;
        },
        (error) => {
          this.callType = 2;
          this.getseiresMatchsList();
        }
      );
    }
  }
  retrunValue(type, match, value) {
    if (match != "--") {
      if (type == "back") {
        if (value != undefined && value != "--" && value != "") {
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
        if (value != undefined && value != "--" && value != "") {
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
        if (value != undefined && value != "--" && value != "") {
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
  GoToDetailPage(sport) {
    if (sport.IsBetAllow == "Y") {
      this._sportService.callType = 1;
      if (sport.sport_id == 4) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        // window.location.href =
        //   "https://" + environment.domain + "/cricket-details";
        window.location.href = "http://localhost:4200/cricket-details";
        //this.router.navigate(['/cricket-details']);
      } else if (sport.sport_id == 2003) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        // window.location.href =
        //   "https://" + environment.domain + "/election-details";
        window.location.href = "http://localhost:4200/election-details";
        //this.router.navigate(['/election-details']);
      } else if (sport.sport_id == 7) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("market_id", sport.market_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        // window.location.href =
        //   "https://" + environment.domain + "/horse-details";
        window.location.href = "http://localhost:4200/horse-details";
        //this.router.navigate(['/horse-details']);
      } else if (sport.sport_id == 4339) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("market_id", sport.market_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        // window.location.href =
        //   "https://" + environment.domain + "/greyhound-details";
        window.location.href = "http://localhost:4200/greyhound-details";
        //this.router.navigate(['/greyhound-details']);
      } else if (sport.sport_id == 1) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        // window.location.href =
        //   "https://" + environment.domain + "/soccer-details";
        window.location.href = "http://localhost:4200/soccer-details";
        //this.router.navigate(['/soccer-details']);
      } else if (sport.sport_id == 2) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        // window.location.href =
        //   "https://" + environment.domain + "/tennis-details";
        window.location.href = "http://localhost:4200/tennis-details";
        //this.router.navigate(['/tennis-details']);
      } else if (
        sport.sport_id == this._sessionService.casino_id_t20 ||
        sport.sport_id == this._sessionService.casino_id_D_t20 ||
        sport.sport_id == this._sessionService.casino_id_H_t20
      ) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/teenpatti-t20"]);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Muflis) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/teenpatti-muflis"]);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Test) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/teenpatti-test"]);
      } else if (
        sport.sport_id == this._sessionService.casino_id_t1day ||
        sport.sport_id == this._sessionService.casino_id_D_t1day
      ) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/teenpatti-oneday"]);
      } else if (sport.sport_id == this._sessionService.casino_id_andarbahar) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/andarbahar"]);
      } else if (
        sport.sport_id == this._sessionService.casino_id_poker ||
        sport.sport_id == this._sessionService.casino_id_poker_T20
      ) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/poker"]);
      } else if (
        sport.sport_id == this._sessionService.casino_id_poker6player
      ) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/poker-6player"]);
      } else if (sport.sport_id == this._sessionService.casino_id_32cards) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/32cards"]);
      } else if (sport.sport_id == this._sessionService.casino_id_hilow) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/hilow"]);
      } else if (
        sport.sport_id == this._sessionService.casino_id_t20 ||
        sport.sport_id == this._sessionService.casino_id_D_t20 ||
        sport.sport_id == this._sessionService.casino_id_H_t20
      ) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/teenpatti-t20"]);
      } else if (
        sport.sport_id == this._sessionService.casino_id_dragon_tiger
      ) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/dragon-tiger"]);
      } else if (
        sport.sport_id == this._sessionService.casino_id_7UpDown ||
        sport.sport_id == this._sessionService.casino_id_7UpDown_B ||
        sport.sport_id == this._sessionService.casino_id_7UpDown_H
      ) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/7updown"]);
      } else if (sport.sport_id == this._sessionService.casino_id_AAA) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.router.navigate(["/aaa"]);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Passa) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this.router.navigate(["/passa"]);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Matka) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this.router.navigate(["/matka"]);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Matka) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this.router.navigate(["/matka"]);
      } else if (sport.sport_id == this._sessionService.casino_id_XPG) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("match_name", sport.name);
        this.router.navigate(["/lobbygame"]);
      } else if (
        sport.sport_id == this._sessionService.casino_id_EZUGI ||
        sport.sport_id == this._sessionService.casino_id_EVOLUTIONS
      ) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("match_name", sport.name);
        this.router.navigate(["/lobbygame2"]);
      } else if (sport.sport_id == this._sessionService.casino_id_LOTUS) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("match_name", sport.name);
        this.router.navigate(["/lobbygame3"]);
      } else if (sport.sport_id == this._sessionService.matkaMatchSportsId) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("match_name", sport.name);
        this.router.navigate(["/matka-detail"]);
      } else if (sport.sport_id == 2225) {
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("match_name", sport.name);
        this.router.navigate(["/titli-detail"]);
      }
    } else {
      this.router.navigate(["/dashboard"]);
    }
  }
  casinoLobbys(gameId, gameName) {
    this._sessionService.set("gameName", gameName);
    this._sessionService.set("game_id", gameId);
    try {
      this.loading = true;

      var sdata = { gameId: this._sessionService.get("game_id") };
      this._dashboardService.getGameLobby(sdata).subscribe(
        (data) => {
          this.loading = false;
          if (!data.error) {
            var result = data.data.url;
            this.lobbyName = this._sessionService.get("gameName");
            //window.open(result, "_blank");
            if (this.safeSrc == null) {
              if (result != "") {
                this.safeSrc =
                  this.sanitizer.bypassSecurityTrustResourceUrl(result);
                var frame = $("#lobby")[0];
                frame.contentWindow.location.replace(result);
              }
            }
          } else {
          }
        },
        (error) => {
          this.loading = false;
        }
      );
    } catch (e) {
      this.loading = false;
    }
    //this.route.navigate(['/lobbygame2']);
  }
  getCasinoListData() {
    var sdata = { limit: 20 };
    this.sportsListService.getCasinoList(sdata).subscribe(
      (data) => {
        var result = data.data;
        if (isNullOrUndefined(result)) {
          return;
        } else {
          this.casinoListData = result;
        }
      },
      (error) => {}
    );
  }

  getCasinoListByBlackjack() {
    var sdata = { category: "blackjack", limit: 20 };
    this.sportsListService.getCasinoListByCategory(sdata).subscribe(
      (data) => {
        var result = data.data;
        if (isNullOrUndefined(result)) {
          return;
        } else {
          this.casinoListDataByBlackjack = result;
        }
      },
      (error) => {}
    );
  }

  getCasinoListByRoulette() {
    var sdata = { category: "roulette", limit: 20 };
    this.sportsListService.getCasinoListByCategory(sdata).subscribe(
      (data) => {
        var result = data.data;
        if (isNullOrUndefined(result)) {
          return;
        } else {
          this.casinoListDataByRoulette = result;
        }
      },
      (error) => {}
    );
  }

  getCasinoListByBaccarat() {
    var sdata = { category: "baccarat", limit: 20 };
    this.sportsListService.getCasinoListByCategory(sdata).subscribe(
      (data) => {
        var result = data.data;
        if (isNullOrUndefined(result)) {
          return;
        } else {
          this.casinoListDataByBaccarat = result;
        }
      },
      (error) => {}
    );
  }

  getCasinoListBySlots() {
    var sdata = { category: "JiLi", limit: 20 };
    this.sportsListService.getCasinoListByCategory(sdata).subscribe(
      (data) => {
        var result = data.data;
        if (isNullOrUndefined(result)) {
          return;
        } else {
          this.casinoListDataBySlots = result;
        }
      },
      (error) => {}
    );
  }

  urlEncode(inputStr) {
    let outputStr = "";
    for (let i = 0; i < inputStr.length; i++) {
      if (inputStr[i] === " ") {
        outputStr += "%20";
      } else {
        outputStr += inputStr[i];
      }
    }
    return outputStr;
  }

  GoToLobbyPage(sport) {
    if (sport.sport_id == this._sessionService.casino_id_EVOLUTIONS2) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this._sessionService.set("game_id", sport.game_id);
      this._sessionService.set("game_name", sport.game_name);
      this._sessionService.set("provider_name", sport.provider_name);
      //  window.location.href = "https://" + environment.domain + "/lobbygame";
      window.location.href = "http://localhost:4200/lobbygame";
    }
  }

  casinoLobby(gameId, gameName) {
    this._sessionService.set("gameName", gameName);
    this._sessionService.set("game_id", gameId);
    //window.location.href = "https://" + environment.domain + "/lobbygame2";
    window.location.href = "http://localhost:4200/lobbygame2";
  }

  CheckSportExist(sId) {
    var isExist = false;
    if (this._sportService._ListMatchbySport.InplayMatches != undefined) {
      for (
        var i = 0;
        i < this._sportService._ListMatchbySport.InplayMatches.length;
        i++
      ) {
        if (
          this._sportService._ListMatchbySport.InplayMatches[i].sport_id == sId
        ) {
          isExist = true;
          break;
        }
      }
    }
    return isExist;
  }

  CheckSportUpcoming(sId) {
    var isExist = false;
    if (this._sportService._ListMatchbySport.UpCommingMatches != undefined) {
      for (
        var i = 0;
        i < this._sportService._ListMatchbySport.UpCommingMatches.length;
        i++
      ) {
        if (
          this._sportService._ListMatchbySport.UpCommingMatches[i].sport_id ==
          sId
        ) {
          isExist = true;
          break;
        }
      }
    }
    return isExist;
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.transitionDuration = "0s"; // Set transition duration to 0 for immediate transition
      this.currentPosition -= 100; // Adjust according to your banner width
      setTimeout(() => {
        this.transitionDuration = "0.5s"; // Set transition duration back to original after immediate transition
        if (this.currentPosition <= -100 * (this.slides.length - 1)) {
          this.currentPosition = 0;
        }
      }, 10); // Short delay before setting the transition duration back to allow the immediate transition to complete
    }, 1000); // Change slide every 5 seconds
  }

  pauseAutoSlide() {
    clearInterval(this.interval);
  }

  resumeAutoSlide() {
    this.startAutoSlide();
  }
}
