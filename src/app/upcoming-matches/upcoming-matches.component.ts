import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { SessionService } from "../service/session.service";
import { LoginServiceService } from "../service/login-service.service";
import { UpcomingMatchesService } from './upcoming-matches.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router, ActivatedRoute } from '@angular/router'
import { isNullOrUndefined } from 'util';
declare const $: any;
@Component({
  selector: 'app-home',
  templateUrl: './upcoming-matches.component.html',
  styleUrls: ['./upcoming-matches.component.css']
})
export class UpcomingMatchesComponent implements OnInit, AfterViewInit, OnDestroy {
  IsEmail = null;
  loginTypeOtp;
  login_form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })
  IsRegistration = 'Y';
  IsRegistrationShow = false;
  isValidFormSubmitted = null;
  time = new Date();
  intervalId;
  providerList = null;
  callType: any = 1;
  matchForCricket: any;
  sportsList = null;
  matchesListInplay = [];
  matchesListInplaySport = [];
  matchesListUpComming = [];
  loading = false;
  sportID = null;
  sportIDS = null;
  activeClass = '';
  showModal: boolean;
  showRegModal: boolean;
  id: number;
  banner: any;
  searchMatch: any = []
  activeClassB = '';
  activeClassR = '';
  activeClassA = '';
  activeClassD = '';
  activeClassBB = '';
  activeClassP = '';
  whatsapp = '';
  telegram = '';
  instagram = '';
  twitter = '';
  siteMessage = '';
  bottomSocialLink: any = [];
  isValidFormSubmittedR = null;
  constructor(private sportsListService: UpcomingMatchesService, private router: Router, private loginservice: LoginServiceService,
    private route: ActivatedRoute, private _sessionService: SessionService, public _sportService: SportServiceService) { }

  newPassword;
  confPassword;
  unamePattern = "^[a-zA-Z0-9]+$";
  namePattern = "^[a-zA-Z ]*$";
  mobnumPattern = new RegExp("^((\\+91-?)|0)?[0-9]{10}$");
  statePattern = "^[a-zA-Z ]*$";
  cityPattern = "^[a-zA-Z ]*$";
  emailPattern = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
  passwordPattern = new RegExp("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}");

  register_form = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.pattern(this.namePattern)]),
    //email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
    mobile: new FormControl(null, [Validators.required, Validators.pattern(this.mobnumPattern)]),
    username: new FormControl(null, [Validators.required, Validators.pattern(this.unamePattern)]),
    newPassword: new FormControl(null, [Validators.required]),
    confPassword: new FormControl(null, [Validators.required]),
    //otp: new FormControl(null, [Validators.required]),
    ageagree: new FormControl(null, [Validators.required]),
    termagree: new FormControl(null, [Validators.required])
  })

  ngOnDestroy() {
    if (this.pipSub != null) {
      this.pipSub.unsubscribe();
    }
  }

  pipSub: any = null;
  ngOnInit() {
    localStorage.clear();
    this.callGetSportsList();

    let sport_id = this.route.snapshot.params['id'];
    sport_id = sport_id > 0 ? sport_id : 0;
    this.getseiresMatchsList(20, sport_id);
    // if (this.router.url == '/live-betting') {
    //   this.activeClass = 'active';
    // }
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.siteMessage = '';
  }

  ngAfterViewInit() {
    //this._sessionService.loadTawkScriptChat();
    //this.setupPageScript();
  }
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
  // setupPageScript() {

  //   // tslint:disable-next-line: prefer-const
  //   let elementRef = document.getElementById('inplay_div');
  //   let s = document.createElement('script');
  //   s.src = './assets/js/custom.js';
  //   s.async = true;
  //   elementRef.appendChild(s);
  // }

  GoToListPage(sport) {
    if (sport.sport_id > 0) {
      this._sessionService.destroy('sport_id');
      this.sportID = sport.sport_id;
      this.router.navigate(['detail/' + this.sportID]);
      this.getseiresMatchsList(20, this.sportID);
      this.callType = 1;
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
    var sdata = { 'team_name': teamname };
    this._sportService.getSearchExchange(sdata).subscribe(data => {
      this.loading = false;
      if (!data.error) {
        var result = data.data;
        if (!isNullOrUndefined(result)) {
          this.searchMatch = result;
        }
      } else {

      }
    }, error => {
      this.loading = false;
    });
  }
  GoToDetailPage(sport) {
    if (sport.IsBetAllow == 'Y') {
      this._sportService.callType = 1;
      if (sport.sport_id == 4) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/detail']);

      }
      else if (sport.sport_id == 7) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('market_id', sport.market_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/horse-details']);
      }
      else if (sport.sport_id == 4339) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('market_id', sport.market_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/greyhound-details']);
      }
      else if (sport.sport_id == 1) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/detail']);
      }
      else if (sport.sport_id == 2) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/detail']);
      } else if (sport.sport_id == this._sessionService.casino_id_t20
        || sport.sport_id == this._sessionService.casino_id_D_t20
        || sport.sport_id == this._sessionService.casino_id_H_t20) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/teenpatti-t20']);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Muflis) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/teenpatti-muflis']);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Test) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/teenpatti-test']);
      } else if (sport.sport_id == this._sessionService.casino_id_t1day
        || sport.sport_id == this._sessionService.casino_id_D_t1day) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/teenpatti-oneday']);
      } else if (sport.sport_id == this._sessionService.casino_id_andarbahar) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/andarbahar']);
      } else if (sport.sport_id == this._sessionService.casino_id_poker
        || sport.sport_id == this._sessionService.casino_id_poker_T20) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/poker']);
      } else if (sport.sport_id == this._sessionService.casino_id_poker6player) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/poker-6player']);
      } else if (sport.sport_id == this._sessionService.casino_id_32cards) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/32cards']);
      } else if (sport.sport_id == this._sessionService.casino_id_hilow) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/hilow']);
      } else if (sport.sport_id == this._sessionService.casino_id_7UpDown
        || sport.sport_id == this._sessionService.casino_id_7UpDown_B
        || sport.sport_id == this._sessionService.casino_id_7UpDown_H) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/7updown']);
      } else if (sport.sport_id == this._sessionService.casino_id_AAA) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/aaa']);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Passa) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/passa']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_H_Matka) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/matka']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_H_Matka) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.router.navigate(['/matka']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_XPG) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('match_name', sport.name);
        this.router.navigate(['/lobbygame']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_EZUGI ||
        sport.sport_id == this._sessionService.casino_id_EVOLUTIONS) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('match_name', sport.name);
        this.router.navigate(['/lobbygame2']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_LOTUS) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('match_name', sport.name);
        this.router.navigate(['/lobbygame3']);
      }

    }
    else {
      this.router.navigate(["/dashboard"]);
    }

  }

  resetSport() {
    this.closeMenu();
  }
  closeMenu() {
    $(".sidenav2").removeClass('active');
    $(".sports-drop-bx").removeClass('active');
    $('.my-tree li a.active').removeClass('active');
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
  // setupPageScript() {

  //   // tslint:disable-next-line: prefer-const
  //   let elementRef = document.getElementById('home-component-head');
  //   let s = document.createElement('script');
  //   s.src = './assets/css/font-awesome.min.css';
  //   s.async = true;
  //   elementRef.appendChild(s);

  // }
  callGetSportsList() {
    var sdata = { 'limit': 50, 'pageno': 1 };
    this.sportsListService.GetSports(sdata).subscribe(data => {
      this.sportsList = data.data;
    }, (error) => {

    })
  }
  public getSportsTabMinWidth() {
    var sportsList = this.sportsList;
    if (sportsList == undefined || sportsList == null || sportsList == "") {
      return 25;
    }
    if (sportsList.length >= 3) {
      return 16.50;
    } else if (sportsList.length == 2) {
      return 33.33;
    } else if (sportsList.length == 1) {
      return 50;
    } else if (sportsList.length == 0) {
      return 100;
    }
    return 25;

  }
  getseiresMatchsList(limit, sport_id) {

    var sdata = { "limit": limit, "pageno": 1, "sport_id": sport_id, "series_id": 0 };
    this.sportsListService.getseiresMatchsList(sdata).subscribe(data => {
      if (this.matchForCricket != null) {
        clearTimeout(this.matchForCricket);
      }
      if (!data.error) {
        var result = data;
        //console.log(result);
        if (!isNullOrUndefined(result)) {
          this._sportService.setMatchDataHome(result);
        }
        //console.log(this._sportService._ListMatchbySport.UpCommingMatches);

      }
      this.matchForCricket = setTimeout(() => {
        this.getseiresMatchsList(limit, sport_id);
        this.callType++;
      }, this.callType == 1 ? 0 : 15000);
      //this.sportsList = data;
    }, (error) => {

    })

  }


  GetInlayMatchList(sport_id) {

    var sdata = { "limit": 20, "pageno": 1, "sport_id": sport_id, "series_id": 0 };
    this.sportsListService.getseiresMatchsList(sdata).subscribe(data => {
      if (this.matchForCricket != null) {
        clearTimeout(this.matchForCricket);
      }
      this.matchForCricket = setTimeout(() => {
        if (!data.error) {
          var result = data.data;
          //console.log(result);
          if (!isNullOrUndefined(result)) {
            this.matchesListInplaySport = result.InplayMatches;
          }
        }
        let sportIDSs = this.route.snapshot.params['id'];
        if (sportIDSs != undefined) {
          this.sportIDS = sportIDSs;
        } else {
          this.sportIDS = 0;
        }
        this.GetInlayMatchList(sport_id);
        this.callType++;
      }, this.callType == 1 ? 0 : 1000);
      //this.sportsList = data;
    }, (error) => {

    })

  }

  CheckSportExist(sId) {
    var isExist = false;
    if (this._sportService._ListMatchbySport.UpCommingMatches != undefined) {
      for (var i = 0; i < this._sportService._ListMatchbySport.UpCommingMatches.length; i++) {
        if (this._sportService._ListMatchbySport.UpCommingMatches[i].sport_id == sId) {
          isExist = true;
          break;
        }
      }

    }
    return isExist;
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
        //this._sessionService.notifier.notify('success', 'Login Successfull');
        //this.router.navigate(['/dashboard']);
        window.location.href = 'https://lord999.com/dashboard';
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
        email: obj.username + '@gmail.com',
        mobile: obj.mobile,
        state: obj.state,
        city: obj.city,
        device_type: 'W',
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

  retrunValue(type, match, value) {
    if (match != "--") {
      if (type == 'back') {
        if (value != undefined && value != "--" && value != "") {
          var backRateDiff = match.backRateDiff;
          let result = (value + backRateDiff);
          if (result < 0) {
            return 0;
          }
          if (this.isInt(result)) {
            return result;
          }
          else {
            return result.toFixed(2);
          }

        }
        else {
          return "--";
        }
      }
      else if (type == 'lay') {

        if (value != undefined && value != "--" && value != "") {
          var layRateDiff = match.layRateDiff;
          let result = (value + layRateDiff);

          if (result < 0) {
            return 0;
          }

          if (this.isInt(result)) {
            return result;
          }
          else {
            return result.toFixed(2);
          }

        }
        else {
          return "--";
        }
      }
      else if (type == 'size') {
        if (value != undefined && value != "--" && value != "") {
          var matchvolume = parseFloat(match.matchVolumn);
          if (matchvolume > 0) {
            let result = value * matchvolume;
            if (this.isInt(result)) {
              return this.numFormatter(result);
            }
            else {
              return this.numFormatter(result);
            }
          }
          else {
            if (value == 0) {
              return value;
            } else {
              return this.numFormatter(value);
            }
          }
        }
        else {
          return "--";
        }
      }
    }
    else {
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
      return (number / 1000).toFixed(2) + 'K';
    }
    // millions
    else if (number >= 1000000 && number <= 999999999) {
      return (number / 1000000).toFixed(2) + 'M';
    }
    // billions
    else if (number >= 1000000000 && number <= 999999999999) {
      return (number / 1000000000).toFixed(2) + 'B';

    } else if (number >= 10000000000 && number <= 9999999999999) {
      return (number / 100000000000).toFixed(2) + 'T';

    } else if (number >= 100000000000 && number <= 9999999999999) {
      return (number / 100000000000).toFixed(2) + 'T';
    }
    else
      return number.toFixed(2);
  }

  isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }

  onlyNumber = function (e) {

    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  }

  show() {
    this.showModal = true; // Show-Hide Modal Check
  }
  hide() {
    this.showModal = false;
  }
  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": true,
    "prevArrow": false,
    "nextArrow": false,
    "autoplay": true
  };

  openSideMenu() {
    $('body').toggleClass('mobile-show');
  }

  closeSideMenu() {
    $('body').removeClass('mobile-show');
  }

  showModalSign() {
    //this.showModalSignup = true; // Show-Hide Modal Check
    $("#singupPopup").modal('show');
    this.hideModalLogin();
    this.formReset();
  }
  showModalLog() {
    //this.showModalLogin = true; // Show-Hide Modal Check
    $("#loginPopup").modal('show');
    this.hideModalSignup();
    this.formReset();
  }
  hideModalSignup() {
    //this.showModalSignup = false;
    $("#singupPopup").modal('hide');
  }
  hideModalLogin() {
    //this.showModalLogin = false;
    $("#loginPopup").modal('hide');
  }
  showReg() {
    this.showRegModal = true; // Show-Hide Modal Check
  }
  hideReg() {
    this.showRegModal = false;
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
}
