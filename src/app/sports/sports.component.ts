import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { SessionService } from "../service/session.service";
import { SportsListService } from "./sports.service";
import { SportServiceService } from "../service/sport-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { isNullOrUndefined } from "util";
import { DatePipe } from "@angular/common";
import { log } from "console";
import { LoginServiceService } from "../service/login-service.service";
import { environment } from "../../environments/environment";

declare const $: any;

@Component({
  selector: "app-sports",
  templateUrl: "./sports.component.html",
  styleUrls: [],
})
export class SportsComponent implements OnInit, AfterViewInit {
  time = new Date();
  intervalId;
  callType: any = 1;
  inplayCount: any = 0;
  upcomingCount: any = 0;
  matchForCricket: any;
  sportsList = null;
  providerList = null;
  matchesListInplay = [];
  matchesListUpComming = [];
  loading = false;
  sportID = null;
  sportIDS = null;
  currentTime: any;
  id: number;
  showModal: boolean;
  showRegModal: boolean;
  IsActive: any;
  _LeftMenuMatch: any = [];
  banner: any;
  bannerMobile: any;
  IsRegistrationShow = true;
  searchMatch: any = [];
  activeClassB = "";
  activeClassR = "";
  activeClassA = "";
  activeClassD = "";
  activeClassBB = "";
  activeClassP = "";
  whatsapp = "";
  telegram = "";
  instagram = "";
  twitter = "";
  siteMessage = "";
  bottomSocialLink: any = [];
  SportData: any;
  CupData: any;
  otpShow = false;
  isUser = false;
  mobilenumber = "";
  settingData: any = [];
  signUpStatus: any;
  siteTitle = "";
  sitelogo = "";
  sitefavicon = "";
  adminLink = "";

  isValidFormSubmitted = null;
  isValidFormSubmittedR = null;
  constructor(
    private sportsListService: SportsListService,
    private router: Router,
    private _sessionService: SessionService,
    public _sportService: SportServiceService,
    private route: ActivatedRoute,
    private loginservice: LoginServiceService
  ) {}

  ngOnInit() {
    //localStorage.clear();
    this.callGetSportsList();
    this.sportIDS = this.route.snapshot.params["id"];
    this.sportIDS = this.sportIDS > 0 ? this.sportIDS : 4;
    this.getseiresMatchsList(100, this.sportIDS);
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.siteMessage = "";
    this.getDefaultSetting();
    this.adminLink = environment.admindomain;
  }

  ngAfterViewInit() {
    //this._sessionService.loadTawkScriptChat();
    //this.loadScriptHtml();
  }

  // loadScriptHtml() {

  //   let appScript = document.createElement("script");
  //   appScript.type = "text/javascript";
  //   appScript.async = true;
  //   appScript.text = "var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();(function(){ var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0];s1.async=true;s1.src='https://embed.tawk.to/6065ae9af7ce182709362201/1f26j444s'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0);})();";
  //   document.body.appendChild(appScript);
  // }
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

  GoToListPage(sport) {
    if (sport.sport_id > 0) {
      this._sessionService.destroy("sport_id");
      this.sportID = sport.sport_id;
      this.router.navigate(["event/" + sport.name + "/" + this.sportID]);
      this.getseiresMatchsList(20, this.sportID);
      //this._sportService.GetSeriesBySportId(sport, true);
      //this.callType = 1;
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

  GoToDetailPage(sport) {
    if (sport.IsBetAllow == "Y") {
      this._sportService.callType = 1;
      if (sport.sport_id == 4) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        window.location.href =
          "https://" + environment.domain + "/cricket-details";
        //window.location.href = "http://localhost:4200/cricket-details";
        //this.router.navigate(['/cricket-details']);
      } else if (sport.sport_id == 2003) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        window.location.href =
          "https://" + environment.domain + "/election-details";
        //window.location.href = "http://localhost:4200/election-details";
        //this.router.navigate(['/election-details']);
      } else if (sport.sport_id == 7) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("market_id", sport.market_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        // window.location.href = "https://" + environment.domain + '/horse-details';
        window.location.href = "http://localhost:4200/horse-details";
        //this.router.navigate(['/horse-details']);
      } else if (sport.sport_id == 4339) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("market_id", sport.market_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        window.location.href =
          "https://" + environment.domain + "/greyhound-details";
        //window.location.href = "http://localhost:4200/greyhound-details";
        //this.router.navigate(['/greyhound-details']);
      } else if (sport.sport_id == 1) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        window.location.href =
          "https://" + environment.domain + "/soccer-details";
        //window.location.href = "http://localhost:4200/soccer-details";
        //this.router.navigate(['/soccer-details']);
      } else if (sport.sport_id == 2) {
        this._sessionService.set("match_id", sport.match_id);
        this._sessionService.set("sport_id", sport.sport_id);
        this._sessionService.set("page_type", "details");
        window.location.href =
          "https://" + environment.domain + "/tennis-details";
        //window.location.href = "http://localhost:4200/tennis-details";
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

  resetSport() {
    this.closeMenu();
  }

  closeMenu() {
    $(".sidenav2").removeClass("active");
    $(".sports-drop-bx").removeClass("active");
    $(".my-tree li a.active").removeClass("active");
  }

  getProviderList() {
    this.sportsListService.getProviderList().subscribe(
      (data) => {
        this.providerList = data.data;
      },
      (error) => {}
    );
  }
  // setupPageScript() {

  //   // tslint:disable-next-line: prefer-const
  //   let elementRef = document.getElementById('home-component-head');
  //   let s = document.createElement('script');
  //   s.src = './assets/css/font-awesome.min.css';
  //   s.async = true;
  //   elementRef.appendChild(s);

  // }
  // getBanner() {
  //   this._sportService.getBanner().subscribe(data => {
  //     var result = data.data;
  //     if (isNullOrUndefined(result)) {
  //       return;
  //     } else {
  //       this.banner = result;
  //     }
  //   }, (error) => {

  //   })
  // }

  callGetSportsList() {
    var sdata = { limit: 10, pageno: 1 };
    this.sportsListService.GetSports(sdata).subscribe(
      (data) => {
        this.sportsList = data.data;
      },
      (error) => {}
    );
  }

  resetMatch() {
    this._sportService._loading = true;
    this._sportService._ListMatchbySport.UpCommingMatches = [];
    this._sportService._ListMatchbySport.InplayMatches = [];
  }

  getseiresMatchsList(limit, sport_id) {
    if (this.router.url != "/detail-cricket") {
      var sdata = {
        limit: limit,
        pageno: 1,
        sport_id: sport_id,
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
          this.sportIDS = sport_id;
          this.matchForCricket = setTimeout(
            () => {
              this.getseiresMatchsList(limit, this.sportIDS);
              this.callType++;
            },
            this.callType == 1 ? 0 : 15000
          );
          //this.sportsList = data;
        },
        (error) => {
          this.callType = 2;
          this.getseiresMatchsList(limit, this.sportIDS);
        }
      );
    }
  }

  setActive(menuNo) {
    this.IsActive = menuNo;
  }

  GetMatchBySeriesId(series) {
    var sportID = series.sport_id;
    var sdata = {
      limit: 20,
      pageno: 1,
      sport_id: series.sport_id,
      series_id: series.series_id,
    };
    this.sportsListService.getMatchListBySeriesId(sdata).subscribe(
      (data) => {
        if (!data.error) {
          var result = data.data;
          if (!isNullOrUndefined(result)) {
            this._LeftMenuMatch = result;
          }
        }
      },
      (error) => {}
    );
    // if (this.router.url == "/home") {
    //   this._sportService._seriesId = series.series_id;
    //   this._sportService.callType = 1;
    //   this._sportService._LeftMenuMatch = [];
    //   this.sportsListService.GetMatchList(series.sport_id)
    // } else {
    //   for (let index = 0; index < this._sportService.SportList.length; index++) {
    //     if (this._sportService.SportList[index].sport_id == series.sport_id) {
    //       this._sportService.sideBarSelectedSeries = series;
    //       this._sportService.sideBarSelectedSports = this._sportService.SportList[index];
    //       this.router.navigate(['home']);
    //       break;
    //     }
    //   }
    // }
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

  CheckSportExistUpcoming(sId) {
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

  onlyNumber = function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  show() {
    this.showModal = true; // Show-Hide Modal Check
  }

  hide() {
    this.showModal = false;
  }

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    prevArrow: false,
    nextArrow: false,
    autoplay: true,
    autoplaySpeed: 1500,
  };

  timeConverter(UNIX_timestamp) {
    var timeZone = "19800";
    var c = parseInt(timeZone);
    var date = new Date(UNIX_timestamp * 1000);
    var localUtcMillisec =
      date.getTime() + date.getTimezoneOffset() * 60 * 1000 + c * 1000;
    date = new Date(localUtcMillisec);
    return date;
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

  GetSport() {
    //this.loading=true;
    var sdata = {
      limit: 10,
      pageno: 1,
    };
    this.sportsListService.GetSports(sdata).subscribe(
      (data) => {
        if (!data.error) {
          this.SportData = data.data;
          this.CupData = data.CupData;
          this._sportService.SportList = data.data;
          if (!isNullOrUndefined(data.DepositWidthrwalDetails)) {
            let DepositWidthrwalDetails = data.DepositWidthrwalDetails;
            if (
              !isNullOrUndefined(DepositWidthrwalDetails.DepositDescription)
            ) {
              this._sessionService.depositPlaceHolder =
                DepositWidthrwalDetails.DepositDescription;
            }
            if (
              !isNullOrUndefined(DepositWidthrwalDetails.PaymentInformation)
            ) {
              this._sessionService.accountInformation =
                DepositWidthrwalDetails.PaymentInformation;
            }

            if (
              !isNullOrUndefined(DepositWidthrwalDetails.WithdrawalDescription)
            ) {
              this._sessionService.withdrawlPlaceHolder =
                DepositWidthrwalDetails.WithdrawalDescription;
            }
          }
        }
      },
      (error) => {
        //this.loading=false;
      }
    );
  }

  openSideMenu() {
    $("body").toggleClass("mobile-show");
  }

  closeSideMenu() {
    $("body").removeClass("mobile-show");
  }
}
