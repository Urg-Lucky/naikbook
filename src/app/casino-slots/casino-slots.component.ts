import { Component, OnInit } from "@angular/core";
import { SessionService } from "../service/session.service";
import { SportServiceService } from "../service/sport-service.service";
import { browserRefresh } from "../app.component";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { CasinoSlotsService } from "./casino-slots.services";
import { filter } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { LoginServiceService } from "../service/login-service.service";
import { environment } from "../../environments/environment";

declare var $: any;
declare var apg_95481486_2e31_454b_bc94_b0c32624a772: any;

@Component({
  selector: "app-casino-slots",
  templateUrl: "./casino-slots.component.html",
  styleUrls: ["./casino-slots.component.css"],
})
export class CasinoSlotsComponent implements OnInit {
  time = new Date();
  IsEmail = null;
  loginTypeOtp;
  login_form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });
  IsRegistration = "Y";
  IsRegistrationShow = false;
  isValidFormSubmitted = null;

  loading = false;
  lobbyName = "";
  data;
  casinoMenu = [];
  casinoGames = [];
  sportID = null;
  sportsList = null;
  showModal: boolean;
  activeClass = "";
  activeClass4 = "";
  activeClass5 = "";
  mobileMenu: any;
  isLobbyShow = false;
  providerList = null;
  activeClass1 = "";
  activeClass2 = "";
  activeClass3 = "";
  whatsapp = "";
  telegram = "";
  instagram = "";
  twitter = "";
  bottomSocialLink: any = [];
  banner: any;
  bannerMobile: any;
  isValidFormSubmittedR = null;
  otpShow = false;
  isUser = false;
  mobilenumber = "";
  searchMatch: any = [];
  settingData: any = [];
  signUpStatus: any;
  siteTitle = "";
  sitelogo = "";
  sitefavicon = "";
  adminLink = "";

  constructor(
    private _sessionService: SessionService,
    public _casinislotsService: CasinoSlotsService,
    private sanitizer: DomSanitizer,
    private _sportService: SportServiceService,
    private loginservice: LoginServiceService,
    public route: Router,
    private router: ActivatedRoute
  ) {
    this._sportService.isShowOneClick = false;
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
  pipSub: any = null;
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
  ngOnInit() {
    let gamename = this.router.snapshot.params["gamename"];
    this.pipSub = this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this._sportService.callBalance = 1;
      });

    this._sportService.callBalance = 1;
    //let gamename = 'roulette';
    if (this.route.url == "/casinos/games/slots") {
      gamename = "JiLi";
    }
    this.GetCasinoList(gamename);
    this.getBanner();
    this.getBannerMobile();
    this.getDefaultSetting();
    this.adminLink = environment.admindomain;
  }

  ngAfterViewInit() {
    $(".partner-slider").owlCarousel({
      items: 13,
      loop: false,
      autoplay: false,
      smartSpeed: 2700,
      margin: 5,
      dots: true,
      responsive: {
        320: {
          items: 4,
        },
        480: {
          items: 5,
        },
        576: {
          items: 6,
        },
        768: {
          items: 10,
        },
        1024: {
          items: 10,
        },
        1200: {
          items: 13,
        },
        1350: {
          items: 13,
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
  resetSport() {
    this.closeMenu();
  }
  closeMenu() {
    $(".sidenav2").removeClass("active");
    $(".sports-drop-bx").removeClass("active");
    $(".my-tree li a.active").removeClass("active");
  }
  // parseHtmlScript($string) {
  //   var wrapper = document.createElement('div');
  //   wrapper.innerHTML = $string;
  //   return wrapper.getElementsByTagName("script")[0].innerHTML
  // }

  // private loadScriptHtml($string) {

  //   let appScript = document.createElement("script");
  //   appScript.type = "text/javascript";
  //   appScript.async = true;
  //   appScript.text = $string;
  //   document.body.appendChild(appScript);

  // }

  GoToListPage(sport) {
    if (sport.sport_id > 0) {
      this.sportID = sport.sport_id;
      this.route.navigate(["detail/" + this.sportID]);
    }
  }

  callGetSportsList() {
    var sdata = { limit: 10, pageno: 1 };
    this._casinislotsService.GetSports(sdata).subscribe(
      (data) => {
        this.sportsList = data.data;
      },
      (error) => {}
    );
  }
  searchCasino = function (e) {
    if (e.target.value != "") {
      this.loading = true;
      this.getSearchCasino(e.target.value);
    }
  };

  getProviderList() {
    this._casinislotsService.getProviderList().subscribe(
      (data) => {
        this.providerList = data.data;
      },
      (error) => {}
    );
  }

  GetCasinoList(gamename) {
    try {
      this.loading = true;
      $(".single-slider").removeClass("active");
      var sdata = { category: gamename, limit: 1000 };
      this._casinislotsService.getCasinoSlots(sdata).subscribe(
        (data) => {
          this.loading = false;
          if (!data.error) {
            var result = data.data;
            if (!isNullOrUndefined(result)) {
              this.casinoGames = result;
              $("." + gamename).addClass("active");
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
          //this.router.navigate(['/userdashboard']);
        }
      },
      (error) => {
        this.getBalance();
      }
    );
  };

  registerSave = function () {
    this.isValidFormSubmittedR = false;
    if (this.register_form.invalid) {
      return;
    } else {
      this.loading = true;
      this.isValidFormSubmittedR = true;
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
            this.hideModalSignup();
            //this.otpShow = false;
            //this.login2(obj.username, obj.newPassword);
            //this.IsRegistrationShow = false;
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

  timerForKeepAlive: any;
  removeTimeOut() {
    if (this.timerForKeepAlive != null) {
      window.clearTimeout(this.timerForKeepAlive);
      this.timerForKeepAlive = null;
    }
  }
  show() {
    this.showModal = true; // Show-Hide Modal Check
  }
  hide() {
    this.showModal = false;
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

  onlyNumber = function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

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
}
