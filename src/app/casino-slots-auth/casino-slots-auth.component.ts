import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { browserRefresh } from '../app.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CasinoSlotsAuthService } from './casino-slots-auth.services';
import { filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginServiceService } from "../service/login-service.service";
import { environment } from '../../environments/environment';

declare var $: any;
declare var apg_95481486_2e31_454b_bc94_b0c32624a772: any;

@Component({
  selector: 'app-casino-slots-auth',
  templateUrl: './casino-slots-auth.component.html',
  styleUrls: ['./casino-slots-auth.component.css']
})
export class CasinoSlotsAuthComponent implements OnInit, OnDestroy {
  safeSrc: SafeHtml = null;
  loading = false;
  lobbyName = '';
  data;
  casinoMenu = [];
  casinoGames = [];
  sportID = null;
  sportsList = null;
  showModal: boolean;
  isLobbyShow = false;
  _egamings = '';
  _egamings2 = '';
  _betgames = '';
  _betgames2 = '';
  _betDiv = '';
  activeClass4 = '';
  activeClass2 = '';
  activeClass5 = '';
  _mainbetgames = '';
  pokerGame = '';
  _overFlow = '';
  IspokerGame = false;
  providerList = null;
  time = new Date();
  IsEmail = null;
  loginTypeOtp;
  showCasino = true;

  login_form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })
  IsRegistration = 'Y';
  IsRegistrationShow = false;
  isValidFormSubmitted = null;
  activeClass = '';
  mobileMenu: any;
  activeClass1 = '';
  activeClass3 = '';
  whatsapp = '';
  telegram = '';
  instagram = '';
  twitter = '';
  bottomSocialLink: any = [];
  banner: any;
  bannerMobile: any;
  isValidFormSubmittedR = null;
  constructor(private _sessionService: SessionService,
    public _casinislotsService: CasinoSlotsAuthService,
    private sanitizer: DomSanitizer,
    private _sportService: SportServiceService,
    private loginservice: LoginServiceService,
    public route: Router, private router: ActivatedRoute) {
    this._sportService.isShowOneClick = false;
  }

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
    ageagree: new FormControl(null, [Validators.required])
  })
  pipSub: any = null;
  ngOnDestroy() {
    if (this.pipSub != null) {
      this.pipSub.unsubscribe();
    }

  }

  ngOnInit() {
    let gamename = this.router.snapshot.params['gamename'];
    this.pipSub = this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this._sportService.callBalance = 1;
    });

    this._sportService.callBalance = 1;
    //let gamename = 'roulette';
    if (this.route.url == '/casino/games/slots') {
      gamename = 'JiLi';
    }
    if (gamename == 'virtual') {
      this.showCasino = false;
    }
    this.GetCasinoList(gamename);
    this.getBanner();
    this.getBannerMobile();
  }

  ngAfterViewInit() {
  }

  getBanner() {
    var sdata = { 'domain_id': 1 };
    this._sportService.getBanner(sdata).subscribe(data => {
      var result = data.data;
      if (isNullOrUndefined(result)) {
        return;
      } else {
        this.banner = result;
      }
    }, (error) => {

    })
  }

  getBannerMobile() {
    var sdata = { 'domain_id': 1 };
    this._sportService.getBannerMobile(sdata).subscribe(data => {
      var result = data.data;
      if (isNullOrUndefined(result)) {
        return;
      } else {
        this.bannerMobile = result;
      }
    }, (error) => {

    })
  }
  resetSport() {
    this.closeMenu();
  }
  closeMenu() {
    $(".sidenav2").removeClass('active');
    $(".sports-drop-bx").removeClass('active');
    $('.my-tree li a.active').removeClass('active');
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
      this.route.navigate(['detail/' + this.sportID]);
    }
  }

  callGetSportsList() {
    var sdata = { 'limit': 10, 'pageno': 1 };
    this._casinislotsService.GetSports(sdata).subscribe(data => {
      this.sportsList = data.data;
    }, (error) => {

    })
  }
  searchCasino = function (e) {
    if (e.target.value != "") {
      this.loading = true;
      this.getSearchCasino(e.target.value);
    }
  }
  getSearchCasino(gamename) {
    var sdata = { 'category': gamename, 'limit': 1000 };
    this._casinislotsService.getCasinoSlots(sdata).subscribe(data => {
      this.loading = false;
      if (!data.error) {
        var result = data.data;
        if (!isNullOrUndefined(result)) {
          this.casinoGames = result;
        }
      } else {

      }
    }, error => {
      this.loading = false;
    });
  }
  getProviderList() {
    this._casinislotsService.getProviderList().subscribe(data => {
      this.providerList = data.data;
    }, (error) => {

    })
  }

  GetCasinoList(gamename) {
    try {
      this.loading = true;
      $(".single-slider").removeClass('active');
      var sdata = { 'category': gamename, 'limit': 1000 };
      this._casinislotsService.getCasinoSlots(sdata).subscribe(data => {
        this.loading = false;
        if (!data.error) {

          var result = data.data;
          if (!isNullOrUndefined(result)) {
            this.casinoGames = result;
            $("." + gamename).addClass('active');
          }
        } else {

        }
      }, error => {
        this.loading = false;
      });

    }
    catch (e) {
      this.loading = false;
    }

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
        confirmpassword: obj.newPassword
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

  showHidePassword() {
    if ($('#show_hide_password').attr("type") == "text") {
      $('#show_hide_password').attr('type', 'password');
      $('.Passcode-visible i').addClass("fa-eye-slash");
      $('.Passcode-visible i').removeClass("fa-eye");
    } else if ($('#show_hide_password').attr("type") == "password") {
      $('#show_hide_password').attr('type', 'text');
      $('.Passcode-visible i').removeClass("fa-eye-slash");
      $('.Passcode-visible i').addClass("fa-eye");
    }
  }


  onlyNumber = function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
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

  GoToLobbyPage(sport) {
    if (sport.sport_id == this._sessionService.casino_id_EVOLUTIONS2) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this._sessionService.set('game_id', sport.game_id);
      this._sessionService.set('game_name', sport.game_name);
      this._sessionService.set('provider_name', sport.provider_name);
      //this.route.navigate(['/lobbygame']);
      window.location.href = "https://" + environment.domain + '/lobbygame';
      //window.location.href = 'http://localhost:4200/lobbygame';
    }
  }

  casinoLobby(gameId, gameName) {
    this._sessionService.set('gameName', gameName);
    this._sessionService.set('game_id', gameId);
    window.location.href = "https://" + environment.domain + '/lobbygame2';
    //window.location.href = 'http://localhost:4200/lobbygame2';
  }
}
