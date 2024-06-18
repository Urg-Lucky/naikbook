import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { SessionService } from "../service/session.service";
import { SportsListService } from "./home.service";
import { SportServiceService } from "../service/sport-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { isNullOrUndefined } from "util";
import { DatePipe } from "@angular/common";
import { log } from "console";
import { LoginServiceService } from "../service/login-service.service";
import { environment } from "../../environments/environment";

declare const $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: [],
})
export class HomeComponent implements OnInit, AfterViewInit {
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
  bannerMobile: any;
  casinoListData: any = [];
  casinoListDataByBlackjack: any = [];
  casinoListDataByRoulette: any = [];
  casinoListDataByBaccarat: any = [];
  casinoListDataBySlots: any = [];
  webMobileShow = 0;
  otpShow = false;
  isUser = false;
  mobilenumber = "";
  settingData: any = [];
  signUpStatus: any;
  siteTitle = "";
  sitelogo = "";
  sitefavicon = "";
  adminLink = "";
  currentPosition = 0;
  transitionDuration = "0.5s"; // Initial transition duration
  interval: any;
  slides: any;
  limit = 20;
  imagess: any;
  login_form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });
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
  isValidFormSubmitted = null;
  isValidFormSubmittedR = null;
  constructor(
    private sportsListService: SportsListService,
    private router: Router,
    private _sessionService: SessionService,
    public _sportService: SportServiceService,
    private route: ActivatedRoute,
    private loginservice: LoginServiceService,
    private imageslist: LoginServiceService,
    private logind: LoginServiceService,
    private bannerlist: LoginServiceService
  ) {}
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
  ngOnDestroy() {
    clearInterval(this.interval);
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
  ngOnInit() {
    localStorage.clear();
    this.startAutoSlide();

    this.callGetSportsList();
    this.getBanner();
    this.getBannerMobile();
    this.getCasinoListData();
    this.getCasinoListByBlackjack();
    this.getCasinoListByRoulette();
    this.getCasinoListByBaccarat();
    this.getCasinoListBySlots();
    this.getDefaultSetting();
    this.getseiresMatchsList();
    // let sport_id = this.route.snapshot.params['id'];
    // sport_id = sport_id > 0 ? sport_id : 4;
    //this.getseiresMatchsList(20, 4);
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
    // if (this.router.url == '/casinos/blackjack') {
    //   this.activeClassB = 'active';
    // } else if (this.router.url == '/casinos/roulette') {
    //   this.activeClassR = 'active';
    // } else if (this.router.url == '/casinos/andar-bahar') {
    //   this.activeClassA = 'active';
    // } else if (this.router.url == '/casinos/dragon-tiger') {
    //   this.activeClassD = 'active';
    // } else if (this.router.url == '/casinos/baccarat') {
    //   this.activeClassBB = 'active';
    // } else if (this.router.url == '/casinos/poker') {
    //   this.activeClassP = 'active';
    // }
    //this.getSettingData();

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

    var isSizeMatch = window.matchMedia("(min-width:768px)");
    if (!isSizeMatch.matches) {
      this.webMobileShow = 1;
    } else {
      this.webMobileShow = 0;
    }
    this.adminLink = environment.admindomain;
  }

  LoginFroms() {
    this.logind.Loginfrom(this.login_form.value).subscribe((dat: any) => {
      console.log("hello");
      // window.location.reload();
      console.log(dat);
    });
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
        this.siteMessage = this._sessionService.get("site_message");
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

  // loadScriptHtml() {

  //   let appScript = document.createElement("script");
  //   appScript.type = "text/javascript";
  //   appScript.async = true;
  //   appScript.text = "var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();(function(){ var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0];s1.async=true;s1.src='https://embed.tawk.to/6065ae9af7ce182709362201/1f26j444s'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0);})();";
  //   document.body.appendChild(appScript);
  // }

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

  GoToListPage(sport) {
    if (sport.sport_id > 0) {
      this._sessionService.destroy("sport_id");
      this.sportID = sport.sport_id;
      this.router.navigate(["event/" + sport.name + "/" + this.sportID]);
      this.getseiresMatchsList();
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
    //if (sport.IsBetAllow == 'Y') {
    this._sportService.callType = 1;
    if (sport.sport_id == 4) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 2003) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("market_id", sport.market_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 7) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("market_id", sport.market_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 4339) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("market_id", sport.market_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 1) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 2) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 7522) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 1477) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 5) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 6) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href = "https://" + environment.domain + "/detail";
      //this.router.navigate(['/detail']);
    } else if (sport.sport_id == 7511) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/detail"]);
    } else if (sport.sport_id == 6422) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/detail"]);
    } else if (
      sport.sport_id == this._sessionService.casino_id_t20 ||
      sport.sport_id == this._sessionService.casino_id_D_t20 ||
      sport.sport_id == this._sessionService.casino_id_H_t20
    ) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/teenpatti-t20"]);
    } else if (sport.sport_id == this._sessionService.casino_id_H_Muflis) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/teenpatti-muflis"]);
    } else if (sport.sport_id == this._sessionService.casino_id_H_Test) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/teenpatti-test"]);
    } else if (
      sport.sport_id == this._sessionService.casino_id_t1day ||
      sport.sport_id == this._sessionService.casino_id_D_t1day
    ) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/teenpatti-oneday"]);
    } else if (sport.sport_id == this._sessionService.casino_id_andarbahar) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/andarbahar"]);
    } else if (
      sport.sport_id == this._sessionService.casino_id_poker ||
      sport.sport_id == this._sessionService.casino_id_poker_T20
    ) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/poker"]);
    } else if (sport.sport_id == this._sessionService.casino_id_poker6player) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/poker-6player"]);
    } else if (sport.sport_id == this._sessionService.casino_id_32cards) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/32cards"]);
    } else if (sport.sport_id == this._sessionService.casino_id_hilow) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/hilow"]);
    } else if (
      sport.sport_id == this._sessionService.casino_id_7UpDown ||
      sport.sport_id == this._sessionService.casino_id_7UpDown_B ||
      sport.sport_id == this._sessionService.casino_id_7UpDown_H
    ) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/7updown"]);
    } else if (sport.sport_id == this._sessionService.casino_id_AAA) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
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
    }

    // }
    // else {
    //   this.router.navigate(["/dashboard"]);
    // }
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

  loginPage() {
    this.router.navigate(["/login"]);
  }

  login = function () {
    this.isValidFormSubmitted = false;

    this.loading = true;
    this.isValidFormSubmitted = true;
    var loginDetail = this.login_form.value;
    var username = $("#username").val();
    var password = $("#password").val();
    var data = {
      user_name: username,
      password: password,
    };
    this.loginservice.loginSave(data).subscribe(
      (response) => {
        if (!response.error) {
          this._sessionService.set("slug", response.data.token);
          this._sessionService.set("userName", response.data.user_name);
          this._sessionService.set(
            "user_front_menaul",
            response.data.user_front_menaul
          );
          this._sessionService.set("user_email", response.data.user_email);
          this._sessionService.set("user_id", response.data.user_id);
          this._sessionService.set("user_mobile", response.data.user_mobile);
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
          if (this._sessionService.get("userName") != "") {
            this.getBalance();
          }
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
          // window.location.href =
          //   "https://" + environment.domain + "/userdashboard";
            window.location.href = "http://localhost:4200/userdashboard";
          //this.router.navigate(['/userdashboard']);
        }
      },
      (error) => {
        this.getBalance();
      }
    );
  };

  // getBalance = function () {
  //   const token = "your_token_value_here";

  //      const headers = {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //   };

  //   this.http.post("your_endpoint_url_here", {}, { headers }).subscribe(
  //     (response) => {
  //       if (!response.error) {
  //         var result = response.data;
  //         this._sessionService.set("avater", result.avatar);
  //         this._sessionService.set("liability", result.liability);
  //         this._sessionService.set("balance", result.balance);
  //         this._sessionService.set("bonus_balance", result.bonus_balance);
  //         this._sessionService.set("profit_loss", result.profit_loss);
  //         this._sessionService.set("freechips", result.freechips);
  //         this._sessionService.set("timezone_value", result.timezone_value);
  //         this._sessionService.set("site_message", result.site_message);
  //         window.location.href =
  //           "https://" + environment.domain + "/userdashboard";
  //       }
  //     },
  //     (error) => {

  //       console.error(error);
  //       this.getBalance();
  //     }
  //   );
  // };

  showModalSign() {
    //this.showModalSignup = true; // Show-Hide Modal Check
    $("#singupPopup").modal("show");
    this.hideModalLogin();
    this.formReset();
  }

  showModalLog() {
    //this.showModalLogin = true; // Show-Hide Modal Check
    $("#loginModal").modal("show");
    this.hideModalSignup();
    this.formReset();
  }

  hideModalSignup() {
    //this.showModalSignup = false;
    $("#registerModal").modal("hide");
  }

  hideModalLogin() {
    //this.showModalLogin = false;
    $("#loginModal").modal("hide");
  }

  showReg() {
    this.showRegModal = true; // Show-Hide Modal Check
  }

  hideReg() {
    this.showRegModal = false;
  }

  formReset() {
    this.isValidFormSubmitted = null;
    this.register_form.reset();
    this.login_form.reset();
  }

  registerSave = function () {
    this.loading = true;
    this.isValidFormSubmittedR = true;
    var obj = this.register_form.value;
    var data = {
      name: environment.websiteName,
      username: obj.username,
      email: environment.websiteName + "@" + environment.domain,
      mobile: obj.mobile,
      //device_type: 'W',
      password: obj.newPassword,
      confirmpassword: obj.newPassword,
    };
    this.loginservice.SingUPd(data).subscribe(
      (response) => {
        this._sessionService.notifier.notify("success", response.message);
        this.formReset();
        this.hideModalSignup();

        //this.otpShow = false;
        this.login2(obj.username, obj.newPassword);
        //this.IsRegistrationShow = false;

        this._sessionService.notifier.notify("error", response.message);
        this.loading = false;
      },
      (error) => {
        if (error.error) {
          this._sessionService.notifier.notify("error", error.error.message);
        }
        this.loading = false;
      }
    );
  };

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
  login2(username, newPassword) {
    var data = {
      user_name: username,
      password: newPassword,
    };
    this.loginservice.loginSave(data).subscribe(
      (response) => {
        if (!response.error) {
          this._sessionService.set("slug", response.data.token);
          this._sessionService.set("userName", response.data.user_name);
          this._sessionService.set(
            "user_front_menaul",
            response.data.user_front_menaul
          );
          this._sessionService.set("user_email", response.data.user_email);
          this._sessionService.set("user_id", response.data.user_id);
          this._sessionService.set("user_mobile", response.data.user_mobile);
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
          if (this._sessionService.get("userName") != "") {
            this.getBalance();
          }
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
}
