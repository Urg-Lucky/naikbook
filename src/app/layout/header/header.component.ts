import { Component, OnInit, AfterViewInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";

import { Router } from "@angular/router";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { HeaderService } from "./header.service";
import { SessionService } from "../../service/session.service";
import { SportServiceService } from "../../service/sport-service.service";
import { DashboardService } from "src/app/dashboard/dashboard.service";
import { isNullOrUndefined } from "util";
import { environment } from "../../../environments/environment";

declare var $;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  name = "Angular";
  constructor(
    private _Service: HeaderService,
    public _sessionService: SessionService,
    private sanitizer: DomSanitizer,
    private route: Router,
    public _sportService: SportServiceService,
    private _dashboardService: DashboardService
  ) {
    //this.name = _Service.val;
  }
  ngAfterViewInit() {}

  time = new Date();
  intervalId;
  rulescmsContent: any = "";
  rulescmsTitle: any = "RULES";
  ruleAutoLoad: boolean = true;
  ruleType = this._sessionService.get("ruleType");
  siteMessage = "";
  isDW = -1;
  loginData: any;
  profiledata: any;
  SportData: any;
  selectedTime: any;
  timeList: any;
  loading: any;
  walletdata: any;
  showKnowMore: any;
  file: any;
  IsActive: any;
  newPassword;
  confPassword;
  isValidFormSubmitted = null;
  isSidebarHome = false;
  isDashboard = "";
  isActiveClassInplay = "";
  isActiveClassUpcomming = "";
  isActiveClassDashboard = "";
  isHeaderShow = true;
  searchMatch: any = [];
  bonusBalance = 0;
  isSearchBarShow = false;
  role = ["D", "SA", "A"];
  settingData: any = [];
  signUpStatus: any;
  siteTitle = "";
  sitelogo = "";
  sitefavicon = "";
  adminLink = "";
  changePass_form = new FormGroup({
    curPassword: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
    confPassword: new FormControl(null, [Validators.required]),
  });
  deposit_form = new FormGroup({
    DAmount: new FormControl(null, [Validators.required]),
    DMessage: new FormControl(null, [Validators.required]),
  });
  withdrawal_form = new FormGroup({
    WAmount: new FormControl(null, [Validators.required]),
    WMessage: new FormControl(null, [Validators.required]),
  });
  support_form = new FormGroup({
    type: new FormControl(this.role[0], [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    file: new FormControl(null),
  });
  validateNumber(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    var value = evt.target.value;
    var dotcontains = value.indexOf(".") != -1;
    if (dotcontains) if (charCode == 46) return false;
    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    let input = String.fromCharCode(evt.charCode);
    const reg = /^\d+[.,]?\d{0,1}$/g;
    if (!reg.test(value) && value != "") {
      evt.preventDefault();
      return false;
    }
    if (value.indexOf(".") == -1) {
      if (value.length > 7) {
        evt.preventDefault();
        return false;
      }
    }
    return true;
  }
  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.bonusBalance = parseInt(this._sessionService.get("bonus_balance"));
    this.showKnowMore = true;
    this.timeList = [
      { name: "Asia/Kolkata +5:30", value: "19800" },
      { name: "Asia/Dubai +4:00", value: "14400" },
      { name: "Asia/Kabul +4:30", value: "16200" },
      { name: "Asia/Karachi +5:00", value: "18000" },
      { name: "Asia/Dhaka +6:00", value: "21600" },
      { name: "Asia/Singapore +8:00", value: "28800" },
    ];

    var alreadySelectedTime = this._sessionService.get("timezone_value");

    for (let index = 0; index < this.timeList.length; index++) {
      const element = this.timeList[index];
      if (element.value == alreadySelectedTime) {
        this.selectedTime = element.name;
        break;
      }
    }
    this.loginData = JSON.parse(this._sessionService.get("loginData"));

    setTimeout(() => {
      this.setupTimeZoneView();
    }, 500);
    this.GetSport();
    this.loadRules(true);
    this.getDefaultSetting();
    if (this.route.url == "/dashboard") {
      this.isDashboard = "dash_yes";
    } else if (this.route.url == "/cricket-details") {
      this.isDashboard = "dash_yes";
    } else if (this._sessionService.get("page_type") == "details") {
      this.isDashboard = "dash_yes";
    } else {
      this.isDashboard = "dash_no";
    }

    if (this.route.url == "/inplay") {
      this.isActiveClassInplay = "active";
    } else if (this.route.url == "/upcoming") {
      this.isActiveClassUpcomming = "active";
    } else if (this.route.url == "/dashboard") {
      this.isActiveClassDashboard = "active";
    }

    if (this.route.url == "/lobbygame" || this.route.url == "/lobbygame2") {
      this.isHeaderShow = false;
    }

    if (this.route.url == "/userdashboard") {
      this.isSearchBarShow = true;
    }
    this.adminLink = environment.admindomain;
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
  changeDashboard(sport, sportId) {
    if (this.route.url == "/dashboard") {
      this._sportService.resetSportData();
      this._sportService.GetSeriesBySportId(sport, true);
      this._sportService.GetMatchList(sportId, "home");
      this._sportService.sideBarSelectedSports = null;
    } else {
      this._sportService.sideBarSelectedSports = sport;
    }
    this.redirect();
  }
  changeDashboard2(sportId) {
    if (this.route.url == "/dashboard") {
      this._sportService.resetSportData();
      //this._sportService.GetSeriesBySportId(sport, true);
      this._sportService.callFun(sportId);
      this._sportService.callTab2("Casino", sportId);
      this._sportService.GetMatchList(sportId, "home");
      this._sportService.sideBarSelectedSports = null;
    }
    this.redirect();
  }
  redirect() {
    // if (this.route.url == "/inplay" || this.route.url == "/favorite" || this.route.url == "/my-markets" || this.route.url == "/cupbets"
    //   || this.route.url == "/cricket-details" || this.route.url == "/tennis-details" || this.route.url == "/soccer-details"
    //   || this.route.url == "/horse-details" || this.route.url == "/greyhound-details"  || this.route.url == "/my-bets" || this.route.url == "/profit-loss" || this.route.url == "/account-statement"
    //   || this.route.url == "/dwrequest-statement" || this.route.url == "/support-request"
    // ) {

    //   this.route.navigate(['dashboard']);
    // }

    if (this.route.url != "/dashboard") {
      this.route.navigate(["dashboard"]);
    }
  }
  GetSport() {
    //this.loading=true;
    var sdata = {
      limit: 10,
      pageno: 1,
    };
    this._sportService.getSports(sdata).subscribe(
      (data) => {
        if (!data.error) {
          this.SportData = data.data;
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
  loadRules(isAuto: boolean) {
    if (isAuto && !this.needShowRulesDialog()) {
      return;
    }

    this.ruleAutoLoad = isAuto;

    this._Service.getRules().subscribe(
      (response) => {
        if (!response.error) {
          if (!isNullOrUndefined(response.data)) {
            if (
              !isNullOrUndefined(response.data.rules) &&
              response.data.rules != ""
            ) {
              if (
                !isNullOrUndefined(response.data.title) &&
                response.data.title != ""
              ) {
                this.rulescmsTitle = response.data.title;
              }
              this.rulescmsContent = response.data.rules;
            }
          }
        }
      },
      (error) => {
        if (error.error instanceof ProgressEvent) {
          if (error.status == 0) {
            this._sessionService.notifier.notify(
              "error",
              "Internet not available."
            );
            return;
          }
        }
      }
    );
  }

  needShowRulesDialog() {
    let is_rules_displayed = this._sessionService.get("is_rules_displayed");
    if (!isNullOrUndefined(is_rules_displayed)) {
      if (this.ruleType === "EVERYTIME") {
        return true;
      } else if (this.ruleType === "NONE" || this.ruleType === "NOTDISPLAY") {
        return false;
      } else if (this.ruleType === "ONETIME" && is_rules_displayed === "N") {
        return true;
      }
    }
    return false;
  }

  onRulesOk() {
    this.rulescmsContent = "";
  }

  onRulesAccept() {
    this.rulescmsContent = "";
    let data = { is_rules_displayed: "Y" };
    this._Service.updateRules(data).subscribe(
      (response) => {
        if (!response.error) {
          this._sessionService.destroy("is_rules_displayed");
        }
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

  onRulesDecline() {
    if (confirm("Are you sure want to Decline.")) {
      localStorage.clear();
      this.route.navigate([""]);
    }
  }

  setupTimeZoneView() {
    $("#timezonoptionselector").each(function () {
      var classes = $(this).attr("class"),
        id = $(this).attr("id"),
        name = $(this).attr("name");
      var template = '<div class="' + classes + '">';
      template +=
        '<span class="custom-select-trigger">' +
        $(this).attr("name") +
        "</span>";
      template += '<div class="custom-options">';
      $(this)
        .find("option")
        .each(function () {
          if ($(this).html().trim() == name.trim()) {
            template +=
              '<span class="custom-option selection ' +
              $(this).attr("class") +
              '" data-value="' +
              $(this).attr("value") +
              '">' +
              $(this).html() +
              "</span>";
          } else {
            template +=
              '<span class="custom-option ' +
              $(this).attr("class") +
              '" data-value="' +
              $(this).attr("value") +
              '">' +
              $(this).html() +
              "</span>";
          }
        });
      template += "</div></div>";

      $(this).wrap('<div class="custom-select-wrapper"></div>');
      $(this).hide();
      $(this).after(template);
    });
    $(".custom-option:first-of-type").hover(
      function () {
        $(this).parents(".custom-options").addClass("option-hover");
      },
      function () {
        $(this).parents(".custom-options").removeClass("option-hover");
      }
    );
    $(".custom-select-trigger").on("click", function () {
      $("html").one("click", function () {
        $(".custom-select2").removeClass("opened");
      });
      $(this).parents(".custom-select2").toggleClass("opened");
      event.stopPropagation();
    });
    $(".custom-option").on("click", (e) => {
      $("#timezonoptionselector").value = $(e.target).data("value");
      $(e.target)
        .parents(".custom-select-wrapper")
        .find("select")
        .val($(e.target).data("value"));
      $(e.target)
        .parents(".custom-options")
        .find(".custom-option")
        .removeClass("selection");
      $(e.target).addClass("selection");
      $(e.target).parents(".custom-select2").removeClass("opened");
      $(e.target)
        .parents(".custom-select2")
        .find(".custom-select-trigger")
        .text($(e.target).text());

      this.updateTimeZone($(e.target).data("value"));
    });
  }
  myfun() {
    $("body").toggleClass("toggled");
  }
  hideWalletPop() {
    $(".toggleBalance").removeClass("newClass");
  }
  updateTimeZone(timezone) {
    let tzone = this.timeList.find((x) => x.value == timezone);
    var tdata = {
      time_zone: tzone.name,
      timezone_value: tzone.value,
    };
    this._Service.updateTimeZone(tdata).subscribe(
      (data) => {
        if (!data.error) {
          this._sessionService.set("timezone_value", timezone);
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  logout() {
    console.log("dasdasdasd");

    this.loading = true;
    if (confirm("Are you sure want to logout ")) {
      localStorage.clear();
      this._sportService.getbal = null;
      this.route.navigateByUrl("/home");
      // this._Service.logout().subscribe(data => {
      //     this.loading = false;
      //     if (!data.error) {
      //         localStorage.clear();
      //         this.route.navigate(['']);
      //     }
      // }, error => {
      //     this.loading = false;
      // })
    } else {
      this.loading = false;
    }
  }

  resetSport() {
    //this._sportService._selectedSport='All';
    //this._sportService.callTabName('All');
    //this._sportService.GetMatchList('');
    this.closeMenu();
  }
  closeMenu() {
    $(".sidenav2").removeClass("active");
    $(".sports-drop-bx").removeClass("active");
    $(".my-tree li a.active").removeClass("active");
  }

  goToChangePassword() {
    $("#changePassword").addClass("openpopUp");
    $("#changePassword").removeClass("closepopUp");
  }

  goToRules() {
    this.loadRules(false);
  }
  closePasswordnav() {
    $("#changePassword").removeClass("openpopUp");
    $("#changePassword").addClass("closepopUp");
    this.changePass_form.reset();
  }
  DWRequest = function (type) {
    this.isValidFormSubmitted = false;
    if (
      type == "D" ? this.deposit_form.invalid : this.withdrawal_form.invalid
    ) {
      return;
    } else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj =
        type == "D" ? this.deposit_form.value : this.withdrawal_form.value;
      var data = {
        amount: type == "D" ? obj.DAmount : obj.WAmount,
        description: type == "D" ? obj.DMessage : obj.WMessage,
        type: type,
      };
      this._Service.dwrequestSave(data).subscribe(
        (response) => {
          if (!response.error) {
            var msg =
              type == "D"
                ? "Deposit request successfully submitted."
                : "Withdrawal request successfully submitted.";
            this._sessionService.notifier.notify("success", msg);
            this.deposit_form.reset();
            this.withdrawal_form.reset();
            $("#pop_up_Withdrawal").removeClass("show");
            if (this.route.url == "/dwrequest-statement") {
              this._sessionService.getDWStatement();
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
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
        }
      );
    }
  };
  tfile;
  fileProgress(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    this.tfile = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(this.tfile);
      // this.support_form.get('image').setValue(this.tfile);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.file = reader.result;
      };
    }
  }
  SupportRequest() {
    const formData = new FormData();
    if (this.tfile) {
      formData.append("image", this.tfile);
    }

    this.isValidFormSubmitted = false;
    if (this.support_form.invalid) {
      return;
    } else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj = this.support_form.value;
      formData.append("message", obj.description);
      formData.append("access_user", obj.type);
      this._Service.userChatRequestSave(formData).subscribe(
        (response) => {
          if (!response.error) {
            var msg = "Support ticket successfully submitted.";
            this._sessionService.notifier.notify("success", msg);
            $("#pop_up_Support").removeClass("show");
            this.support_form.reset();
            this.file = null;
            this.tfile = null;
            if (this.route.url == "/support-request") {
              this._sessionService.getSupportStatement();
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
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
        }
      );
    }
  }
  changePassSave = function () {
    this.isValidFormSubmitted = false;
    if (this.changePass_form.invalid) {
      return;
    } else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj = this.changePass_form.value;
      var data = {
        oldPassword: obj.curPassword,
        confirmNewPassword: obj.newPassword,
        newPassword: obj.newPassword,
      };

      this._dashboardService.changePassword(data).subscribe(
        (response) => {
          if (!response.error) {
            this._sessionService.notifier.notify("success", response.message);
            $("#changePassword").removeClass("openpopUp");
            $("#changePassword").addClass("closepopUp");
            this.formReset();
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
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
        }
      );
    }
  };
  formReset() {
    this.changePass_form.reset();
    this.deposit_form.reset();
    this.withdrawal_form.reset();
    this.support_form.reset({ type: this.role[0] });
    this.isValidFormSubmitted = null;
    this.file = null;
    this.tfile = null;
  }

  IsFullScreen = 0;
  openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      this.IsFullScreen = 1;
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      this.IsFullScreen = 0;
    }
  }

  setActive(menuNo) {
    this.IsActive = menuNo;
  }

  openSideMenu() {
    $("body").toggleClass("mobile-show");
  }

  closeSideMenu() {
    $("body").removeClass("mobile-show");
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
      window.location.href =
        "https://" + environment.domain + "/cricket-details";
      //this.router.navigate(['/cricket-details']);
    } else if (sport.sport_id == 1) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href =
        "https://" + environment.domain + "/soccer-details";
      //this.route.navigate(['/soccer-details']);
    } else if (sport.sport_id == 2) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      window.location.href =
        "https://" + environment.domain + "/tennis-details";
      //this.route.navigate(['/tennis-details']);
    } else if (sport.sport_id == this._sessionService.casino_id_XPG) {
      this._sessionService.set("match_id", sport.match_id);
      this._sessionService.set("sport_id", sport.sport_id);
      this._sessionService.set("match_name", sport.name);
      window.location.href = "https://" + environment.domain + "/lobbygame";
      //this.route.navigate(['/lobbygame']);
    }
    // }
    // else {
    //   this.route.navigate(["/dashboard"]);
    // }
  }

  casinoLobby(gameId, gameName) {
    this._sessionService.set("gameName", gameName);
    this._sessionService.set("game_id", gameId);
    window.location.href = "https://" + environment.domain + "/lobbygame2";
    //window.location.href = 'http://localhost:4200/lobbygame2';
  }

  getDiamondCasino(gameid) {
    this._sessionService.set("gameId", gameid);
    window.location.href = "https://" + environment.domain + "/diamond-casino";
    //window.location.href = 'http://localhost:4200/diamond-casino';
    //this.route.navigate(['/diamond-casino']);
  }

  showPendingBets() {
    window.location.href = "https://" + environment.domain + "/pending-bets";
    //window.location.href = 'http://localhost:4200/pending-bets';
  }
}
