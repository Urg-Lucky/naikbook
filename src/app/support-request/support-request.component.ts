import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SupportRequestService } from './support-request.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../service/session.service';
import { browserRefresh } from '../app.component';
import { isNullOrUndefined } from 'util';
import { LoginServiceService } from '../service/login-service.service';
import { environment } from '../../environments/environment';

declare const $: any;

@Component({
  selector: 'app-support-request',
  templateUrl: './support-request.component.html',
  styleUrls: []
})
export class SupportRequestComponent implements OnInit, AfterViewInit {
  time = new Date();
  mycmsContent: any = "";
  mycmsTitle = "";
  loading = false;
  toDate;
  fromDate;
  toDateValue;
  fromDateValue;
  toDateValue1;
  fromDateValue1;
  selectedType = "A";
  selectedStatus = "A";
  public supportStatement: any = [];
  public SupportStatement: any = [];
  page: number = 1;
  SportData: any = [];
  CupData: any = [];
  isCancelShow = -1;
  cancelId = null;
  isValidFormSubmitted = null;
  cancel_form = new FormGroup({
    description: new FormControl(null, [Validators.required])
  })
  login_form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });
  newPassword;
  confPassword;
  unamePattern = "^[a-zA-Z0-9]+$";
  namePattern = "^[a-zA-Z ]*$";
  mobnumPattern = new RegExp("^((\\+91-?)|0)?[0-9]{10}$");
  emailPattern = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
  passwordPattern = new RegExp("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}");

  register_form = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.pattern(this.namePattern)]),
    email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
    mobile: new FormControl(null, [Validators.required, Validators.pattern(this.mobnumPattern)]),
    username: new FormControl(null, [Validators.required, Validators.pattern(this.unamePattern)]),
    newPassword: new FormControl(null, [Validators.required]),
    confPassword: new FormControl(null, [Validators.required]),
    //otp: new FormControl(null, [Validators.required]),
    ageagree: new FormControl(null, [Validators.required]),
    referralid: new FormControl('')
  })

  isValidFormSubmittedR = null;
  constructor(
    public _sessionService: SessionService,
    public _SupportRequestService: SupportRequestService,
    public _sportService: SportServiceService, public route: Router,
    private loginservice: LoginServiceService,
    private activatedRoute: ActivatedRoute) {
    this._sportService.isShowOneClick = false;


  }

  toTimestamp(strDate) {
    return this._sessionService.toTimestamp(strDate);
  }
  ngOnInit() {
    if (browserRefresh) {
      this._sessionService.gotoLoginPage();
      return;
    }

    this._sportService.callBalance = 1;
    this._sportService.getBalance();
    this.getOuterPagesDetails('support');
  }

  ngAfterViewInit() {
    this.loadScriptHtml();
  }
  loadScriptHtml() {
    let appScript = document.createElement("script");
    appScript.type = "text/javascript";
    appScript.async = true;
    appScript.text = "var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();(function(){ var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0];s1.async=true;s1.src='https://embed.tawk.to/65ab9b240ff6374032c2b8d3/1hkj5c2aa'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0);})();";
    document.body.appendChild(appScript);
  }
  getOuterPagesDetails(cmsId) {
    var data = {
      id: cmsId
    }

    this.loginservice.outerPagesDetails(data).subscribe(response => {
      if (!response.error) {
        if (response.data != null) {
          this.mycmsTitle = response.data.title;
          window.document.title = this.mycmsTitle;
          this.mycmsContent = response.data.body;

        }
      }
      else {

      }
    }, error => {

    });
  }

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
          this._sessionService.set('user_front_menaul', response.data.user_front_menaul);
          this._sessionService.set('user_email', response.data.user_email);
          this._sessionService.set('user_id', response.data.user_id);
          this._sessionService.set('user_mobile', response.data.user_mobile);
          if (!isNullOrUndefined(response.data.is_rules_displayed) && response.data.is_rules_displayed != '') {
            this._sessionService.set('is_rules_displayed', response.data.is_rules_displayed);
            this._sessionService.set('ruleType', response.data.ruleType);
          }
          if (this._sessionService.get('userName') != '') {
            this.getBalance();
          }

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
        //this._sessionService.notifier.notify('success', 'Login Successfull');
        window.location.href = "https://" + environment.domain + '/userdashboard';
        // window.location.href = 'http://localhost:4200/userdashboard';
        //this.router.navigate(['/userdashboard']);
      }
    }, (error) => {
      this.getBalance();
    })
  }

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
      }
      this.loginservice.saveUser(data).subscribe(response => {

        if (!response.error) {
          this._sessionService.notifier.notify('success', response.message);
          this.formReset();
          this.hideModalSignup();
          //this.otpShow = false;
          //this.login2(obj.username, obj.newPassword);
          //this.IsRegistrationShow = false;
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
        username: e.target.value
      }
      this.loading = true;
      this.loginservice.CheckUserNameExist(data).subscribe((response) => {
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

  showModalSign() {
    //this.showModalSignup = true; // Show-Hide Modal Check
    $("#singupPopup").modal('show');
    this.hideModalLogin();
    this.formReset();
  }

  showModalLog() {
    //this.showModalLogin = true; // Show-Hide Modal Check
    $("#loginModal").modal('show');
    this.hideModalSignup();
    this.formReset();
  }

  hideModalSignup() {
    //this.showModalSignup = false;
    $("#registerModal").modal('hide');
  }

  hideModalLogin() {
    //this.showModalLogin = false;
    $("#loginModal").modal('hide');
  }


  formReset() {
    this.isValidFormSubmitted = null;
    this.register_form.reset();
    this.login_form.reset();
  }

  onlyNumber = function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  }
}


