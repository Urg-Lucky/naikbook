import { Component, OnInit, AfterViewInit, Injectable } from '@angular/core';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { SessionService } from "../service/session.service";
import { LoginServiceService } from "../service/login-service.service";
import { Router } from '@angular/router'
import { SportServiceService } from '../service/sport-service.service';
import { isNullOrUndefined } from 'util';
import { browserRefresh } from '../app.component';
import { DashboardService } from '../dashboard/dashboard.service';

declare const $: any;

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
  IsEmail = null;
  loginTypeOtp;
  loading = false;
  newPassword;
  confPassword;
  changePass_form = new FormGroup({
    curPassword: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confPassword: new FormControl(null, [Validators.required]),

  })
  isValidFormSubmitted = null;
  mobilenumber = '';
  emailSet = '';
  states: any;
  cities: any;
  isDashboard = '';
  constructor(private _dashboardService: DashboardService, private router: Router, private _sessionService: SessionService, public _sportService: SportServiceService) { }

  ngOnInit() {
    if (browserRefresh) {
      this._sessionService.gotoLoginPage();
      return;
    }
    this._sportService.callBalance = 1;
    this._sportService.getBalance();
    //this.callGlobalSetting();
    //this.getStateList();
    if (this.router.url == '/dashboard') {
      this.isDashboard = 'dash_yes';
    } else {
      this.isDashboard = 'dash_no';
    }
  }

  ngAfterViewInit() {
    //this._sessionService.loadTawkScriptChat();
    //this.setupPageScript();
    //this.loadScriptHtml2();
  }
  // setupPageScript() {
  //   let elementRef = document.getElementById('login_div');
  //   let s = document.createElement('script');
  //   s.src = './assets/js/custom.js';
  //   s.async = true;
  //   elementRef.appendChild(s);
  // }

  changePassSave = function () {

    this.isValidFormSubmitted = false;
    if (this.changePass_form.invalid) {
      return;
    }
    else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj = this.changePass_form.value;
      var data = {
        "oldPassword": obj.curPassword,
        "confirmNewPassword": obj.newPassword,
        "newPassword": obj.newPassword
      }

      this._dashboardService.changePassword(data).subscribe(response => {

        if (!response.error) {
          this._sessionService.notifier.notify('success', response.message);
          $("#changePassword").removeClass('openpopUp');
          $("#changePassword").addClass('closepopUp');
          this.formReset();
        }
        else {
          this._sessionService.notifier.notify('error', response.message);
        }
        this.loading = false;
      }, (error) => {
        this.loading = false;
        this._sessionService.printLog(error.error);
        if (error.error instanceof ProgressEvent) {
          if (error.status == 0) {
            this._sessionService.notifier.notify('error', "Internet not available.");
            return;
          }
        }
        if (error.error) {
          this._sessionService.notifier.notify('error', error.error.message);
        }
      })
    }
  }

  formReset() {
    this.changePass_form.reset();
  }

  onlyNumber = function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
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

  showHidePassword(type) {
    if (type == 'current') {
      if ($('#curPassword').attr("type") == "text") {
        $('#curPassword').attr('type', 'password');
        $('.Passcode-visibleC i').addClass("fa-eye-slash");
        $('.Passcode-visibleC i').removeClass("fa-eye");
      } else if ($('#curPassword').attr("type") == "password") {
        $('#curPassword').attr('type', 'text');
        $('.Passcode-visibleC i').removeClass("fa-eye-slash");
        $('.Passcode-visibleC i').addClass("fa-eye");
      }
    } else if (type == 'new') {
      if ($('#newPassword').attr("type") == "text") {
        $('#newPassword').attr('type', 'password');
        $('.Passcode-visibleN i').addClass("fa-eye-slash");
        $('.Passcode-visibleN i').removeClass("fa-eye");
      } else if ($('#newPassword').attr("type") == "password") {
        $('#newPassword').attr('type', 'text');
        $('.Passcode-visibleN i').removeClass("fa-eye-slash");
        $('.Passcode-visibleN i').addClass("fa-eye");
      }
    } else if (type == 'confirm') {
      if ($('#confPassword').attr("type") == "text") {
        $('#confPassword').attr('type', 'password');
        $('.Passcode-visibleCN i').addClass("fa-eye-slash");
        $('.Passcode-visibleCN i').removeClass("fa-eye");
      } else if ($('#confPassword').attr("type") == "password") {
        $('#confPassword').attr('type', 'text');
        $('.Passcode-visibleCN i').removeClass("fa-eye-slash");
        $('.Passcode-visibleCN i').addClass("fa-eye");
      }
    }
  }
}
