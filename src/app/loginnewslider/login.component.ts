import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { SessionService } from "../service/session.service";
import { LoginServiceService } from "../service/login-service.service";
import { Router } from '@angular/router'
import { isNullOrUndefined } from 'util';
declare const $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  IsEmail = null;
  loginTypeOtp;
  loading = false;
  login_form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })
  IsRegistration = 'N';
  IsRegistrationShow = false;
  isValidFormSubmitted = null;
  constructor(private loginservice: LoginServiceService,
    private router: Router, private _sessionService: SessionService) { }

  ngOnInit() {

    localStorage.clear();
    //this.callGlobalSetting();



  }


  public loadJquerySlider() {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = "$(function(){jQuery('#maximage').maximage();});";
    script.async = true;
    script.defer = false;
    body.appendChild(script);
  }

  ngAfterViewInit() {
    this.loadJquerySlider();
    this._sessionService.loadTawkScriptChat();
  }
  newPassword;
  confPassword;
  unamePattern = "^[a-zA-Z ]*$";
  mobnumPattern = new RegExp("^((\\+91-?)|0)?[0-9]{10}$");
  emailPattern = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
  register_form = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.pattern(this.unamePattern)]),
    email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
    mobile: new FormControl(null, [Validators.required, Validators.pattern(this.mobnumPattern)]),
    username: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required]),
    confPassword: new FormControl(null, [Validators.required])
  })

  login = function () {
    this.isValidFormSubmitted = false;
    if (this.login_form.invalid) {
      return true;
    }
    else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var loginDetail = this.login_form.value
      var data = {
        user_name: loginDetail.username,
        password: loginDetail.password
      }
      this.loginservice.loginSave(data).subscribe((response) => {
        if (!response.error) {
          this._sessionService.set('slug', response.data.token);
          this._sessionService.set('userName', response.data.user_name);
          if (!isNullOrUndefined(response.data.is_rules_displayed) && response.data.is_rules_displayed != '') {
            this._sessionService.set('is_rules_displayed', response.data.is_rules_displayed);
            this._sessionService.set('ruleType', response.data.ruleType);
          }

          this.getBalance();

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
          }
        }
      });
    }

  }

  getBalance = function () {
    this.loginservice.getbalance().subscribe((response) => {
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
        this._sessionService.notifier.notify('success', 'Login Successfull');
        this.router.navigate(['/dashboard']);
      }
    }, (error) => {
      this.getBalance();
    })
  }
  isUser = true;
  CheckUserExist = function (e) {
    if (e.target.value != "" && e.target.value.length > 5) {
      var data = {
        username: e.target.value
      }
      this.loading = true;
      this.loginservice.IsUserExist(data).subscribe((response) => {
        if (!response.error) {
          this._sessionService.notifier.notify('success', response.message);
          this.isUser = true;
        }
        else {
          this._sessionService.notifier.notify('error', response.message);
          this.isUser = false;
        }
        this.loading = false;
      }, error => {
        if (error.error) {
          this._sessionService.notifier.notify('error', error.error.message);
        }
        this.loading = false;
      })
    }

  }
  registerSave = function () {

    this.isValidFormSubmitted = false;
    if (this.register_form.invalid || !this.isUser) {
      return;
    }
    else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj = this.register_form.value;
      var data = {
        name: obj.name,
        username: obj.username,
        email: obj.email,
        mobile: obj.mobile,
        password: obj.newPassword,
        confirmpassword: obj.confPassword
      }
      this.loginservice.saveUser(data).subscribe(response => {

        if (!response.error) {
          this._sessionService.notifier.notify('success', response.message);
          this.formReset();
          this.IsRegistrationShow = false;
        }
        else {
          this._sessionService.notifier.notify('error', response.message);
        }
        this.loading = false;
      }, error => {
        if (error.error) {
          this._sessionService.notifier.notify('error', error.error.message);
        }
        this.loading = false;
      })
    }
  }
  formReset() {
    this.isValidFormSubmitted = null;
    this.register_form.reset();
  }

  callGlobalSetting() {
    var c1; var c2; var c3;
    var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

    this.loginservice.globalSetting().subscribe(response => {

      if (!response.error) {
        if (response.data.length > 0) {

          var mainResult = response.data[0].register;
          var firstText = mainResult.substring(0, 1);
          var secondText = mainResult.substring(33, mainResult.length);
          var result = Base64.decode(firstText + secondText);

          this.IsRegistration = result;
        }

      }
      else {
        this._sessionService.notifier.notify('error', response.message);
      }
      this.loading = false;
    }, error => {
      if (error.error) {
        this._sessionService.notifier.notify('error', error.error.message);
      }
      this.loading = false;
    })
  }

  onlyNumber = function (e) {

    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  }

}
