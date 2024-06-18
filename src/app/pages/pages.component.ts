import { Component, OnInit, AfterViewInit } from "@angular/core";
import { SessionService } from "../service/session.service";
import { LoginServiceService } from "../service/login-service.service";
import { browserRefresh } from "../app.component";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { PagesService } from "./pages.services";
import { filter } from "rxjs/operators";
import { isArray, isNullOrUndefined } from "util";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { SportServiceService } from "../service/sport-service.service";
import { environment } from "../../environments/environment";

declare var $: any;

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: [],
})
export class PagesComponent implements OnInit, AfterViewInit {
  time = new Date();
  outerPagesListData = null;
  mycmsContent: any = "";
  mycmsTitle = "";
  sportsList = null;
  providerList = null;
  whatsapp = "";
  telegram = "";
  instagram = "";
  twitter = "";
  pagename = "";
  bottomSocialLink: any = [];
  otpShow = false;
  isUser = false;
  mobilenumber = "";
  loading = false;
  searchMatch: any = [];
  settingData: any = [];
  signUpStatus: any;
  siteTitle = "";
  sitelogo = "";
  sitefavicon = "";
  adminLink = "";

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
    private loginservice: LoginServiceService,
    private router: Router,
    private _sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private PagesService: PagesService,
    public _sportService: SportServiceService
  ) {}

  ngOnInit() {
    this.callGetSportsList();
    this.pagename = this.activatedRoute.snapshot.params["pagename"];
    this.getOuterPagesDetails(this.pagename);
    this.getOuterPages();
    this.getDefaultSetting();
    //this.getProviderList();
    //this.getSettingData();
    this.adminLink = environment.admindomain;
  }
  ngAfterViewInit() {
    if (this.pagename == "support") {
      this.loadScriptHtml();
    }
  }
  loadScriptHtml() {
    let appScript = document.createElement("script");
    appScript.type = "text/javascript";
    appScript.async = true;
    appScript.text =
      "var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();(function(){ var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0];s1.async=true;s1.src='https://embed.tawk.to/65ab9b240ff6374032c2b8d3/1hkj5c2aa'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0);})();";
    document.body.appendChild(appScript);
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

  getProviderList() {
    this.PagesService.getProviderList().subscribe(
      (data) => {
        this.providerList = data.data;
      },
      (error) => {}
    );
  }
  callGetSportsList() {
    var sdata = { limit: 10, pageno: 1 };
    this.PagesService.GetSports(sdata).subscribe(
      (data) => {
        this.sportsList = data.data;
      },
      (error) => {}
    );
  }

  retryOuterPages() {
    setTimeout(() => {
      this.getOuterPages();
    }, 1000);
  }

  getOuterPages() {
    this.loginservice.getOuterPages().subscribe(
      (response) => {
        if (!response.error) {
          if (
            response.data != null &&
            isArray(response.data) &&
            response.data.length > 0
          ) {
            this.outerPagesListData = response.data;
          }
        } else {
          this.getOuterPages();
        }
      },
      (error) => {
        this.getOuterPages();
      }
    );
  }

  getOuterPagesDetails(cmsId) {
    var data = {
      id: cmsId,
    };

    this.loginservice.outerPagesDetails(data).subscribe(
      (response) => {
        if (!response.error) {
          if (response.data != null) {
            this.mycmsTitle = response.data.title;
            window.document.title = this.mycmsTitle;
            this.mycmsContent = response.data.body;
          }
        } else {
        }
      },
      (error) => {}
    );
  }

  openCmsPage(cms) {
    this.router.navigate(["/page/"], { queryParams: { id: cms.id } });
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

  formReset() {
    this.isValidFormSubmitted = null;
    this.register_form.reset();
    this.login_form.reset();
  }

  onlyNumber = function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };
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
      this.router.navigate(["/cricket-details"]);
    } else if (sport.sport_id == 1) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/soccer-details"]);
    } else if (sport.sport_id == 2) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this.router.navigate(["/tennis-details"]);
    } else if (sport.sport_id == this._sessionService.casino_id_XPG) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this._sessionService.set("match_name", sport.name);
      this.router.navigate(["/lobbygame"]);
    }
    // }
    // else {
    //   this.route.navigate(["/dashboard"]);
    // }
  }
}
