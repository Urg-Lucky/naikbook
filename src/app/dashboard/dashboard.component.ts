import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { browserRefresh } from '../app.component';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = false;
  HorseId = 7;
  GreyHoundId = 4339;
  newPassword;
  confPassword;
  isValidFormSubmitted = null;
  matchForCricket: any;
  inplayCount: any = 0;
  upcomingCount: any = 0;
  currentTime: any;
  sportIDS = null;
  callType: any = 1;
  isDashboard = '';
  banner: any;
  bannerMobile: any;
  siteMessage = '';
  titliSport = { sport_id: 2225, name: 'Titli', IsBetAllow: 'Y' };

  changePass_form = new FormGroup({
    curPassword: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required]),
    confPassword: new FormControl(null, [Validators.required]),

  })
  constructor(private _dashboardService: DashboardService, public _sessionService: SessionService,
    private route: Router, public _sportService: SportServiceService) {
  }
  ngOnDestroy() {
    if (this.pipSub != null) {
      this.pipSub.unsubscribe();
    }

  }
  pipSub: any = null;
  ngOnInit() {
    if (browserRefresh) {
      this._sessionService.gotoLoginPage();
      return;
    }
    this.pipSub = this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
      this._sportService._selectedSport = '';
      this._sportService.callType = 1;
      //this._sportService.callTabName('');
      //this._sportService.GetMatchList(0, 'home');
      this._sportService.getseiresMatchsList(20, 4);
      this._sportService.getCasinoGames();
      this._sportService.callBalance = 1;
      this._sportService.getBalance();
    });
    this.closeMenu();
    if (this._sportService.sideBarSelectedSports != null) {
      this._sportService.resetSportData();
      if (this._sportService.sideBarSelectedSeries == null) {
        this._sportService.GetSeriesBySportId(this._sportService.sideBarSelectedSports, true);
      } else {
        this._sportService.GetSeriesBySportId(this._sportService.sideBarSelectedSports, false);
        this._sportService._seriesId = this._sportService.sideBarSelectedSeries.series_id;
        this._sportService._LeftMenuMatch = [];
      }

      //this._sportService.GetMatchList(this._sportService.sideBarSelectedSports.sport_id, 'home')
      this._sportService.getseiresMatchsList(20, 4);
      this._sportService.getCasinoGames();
      this._sportService.sideBarSelectedSports = null;
      this._sportService.sideBarSelectedSeries = null
    } else {
      this._sportService._selectedSport = '';
      this._sportService.callType = 1;

      //this._sportService.callTabName('');
      //this._sportService.GetMatchList(0, 'home');
      this._sportService.getseiresMatchsList(20, 4);
      this._sportService.getCasinoGames();
      this._sportService.isShowOneClick = false;
      this._sportService.callBalance = 1;
      this._sportService.getBalance();
    }

    if (this.route.url == '/dashboard') {
      this.isDashboard = 'dash_yes';
    } else {
      this.isDashboard = 'dash_no';
    }
    this.getBanner();
    this.getBannerMobile();
    $(".modal-backdrop").remove();
    this.siteMessage = this._sessionService.get('site_message');
  }

  closeMenu() {
    $(".sidenav2").removeClass('active');
    $(".sports-drop-bx").removeClass('active');
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
  retrunValue(type, match, value) {
    if (match != "--") {
      if (type == 'back') {
        if (value != undefined && value != "--") {
          var backRateDiff = match.backRateDiff;
          let result = (value + backRateDiff);
          if (result < 0) {
            return 0;
          }
          if (this.isInt(result)) {
            return result.toFixed(2);
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

        if (value != undefined && value != "--") {
          var layRateDiff = match.layRateDiff;
          let result = (value + layRateDiff);

          if (result < 0) {
            return 0;
          }

          if (this.isInt(result)) {
            return result.toFixed(2);
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
        if (value != undefined && value != "--") {
          var matchvolume = parseFloat(match.matchVolumn);
          if (matchvolume > 0) {
            let result = value * matchvolume;
            if (this.isInt(result)) {
              return result;
            }
            else {
              return result.toFixed(2);
            }
          }
          else {
            return value;
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

  isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }

  isBetAllowPopular(slist) {

    if (slist.BetAllowTimeBefore == 0 && slist.IsBetAllow == 'Y') {
      return true;
    }
    else if (slist.BetAllowTimeBefore > 0 && slist.IsBetAllow == 'Y') {

      if (slist.isDetail) //(startDate-btBefor)<currentTime
      {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  GoToDetailPage(sport) {
    if (sport.IsBetAllow == 'Y') {
      this._sportService.callType = 1;
      if (sport.sport_id == 4) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('page_type', 'details');
        window.location.href = "https://" + environment.domain + '/cricket-details';
        //this.route.navigate(['/cricket-details']);

      } else if (sport.sport_id == 2003) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('page_type', 'details');
        window.location.href = "https://" + environment.domain + '/election-details';
        //this.route.navigate(['/election-details']);
      }
      else if (sport.sport_id == 7) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('market_id', sport.market_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('page_type', 'details');
        this.route.navigate(['/horse-details']);
      }
      else if (sport.sport_id == 4339) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('market_id', sport.market_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('page_type', 'details');
        this.route.navigate(['/greyhound-details']);
      }
      else if (sport.sport_id == 1) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('page_type', 'details');
        window.location.href = "https://" + environment.domain + '/soccer-details';
        //this.route.navigate(['/soccer-details']);
      }
      else if (sport.sport_id == 2) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('page_type', 'details');
        window.location.href = "https://" + environment.domain + '/tennis-details';
        //this.route.navigate(['/tennis-details']);
      } else if (sport.sport_id == this._sessionService.casino_id_t20
        || sport.sport_id == this._sessionService.casino_id_D_t20
        || sport.sport_id == this._sessionService.casino_id_H_t20) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/teenpatti-t20']);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Muflis) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/teenpatti-muflis']);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Test) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/teenpatti-test']);
      } else if (sport.sport_id == this._sessionService.casino_id_t1day
        || sport.sport_id == this._sessionService.casino_id_D_t1day) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/teenpatti-oneday']);
      } else if (sport.sport_id == this._sessionService.casino_id_andarbahar) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/andarbahar']);
      } else if (sport.sport_id == this._sessionService.casino_id_poker
        || sport.sport_id == this._sessionService.casino_id_poker_T20) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/poker']);
      } else if (sport.sport_id == this._sessionService.casino_id_poker6player) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/poker-6player']);
      } else if (sport.sport_id == this._sessionService.casino_id_32cards) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/32cards']);
      } else if (sport.sport_id == this._sessionService.casino_id_hilow) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/hilow']);
      } else if (sport.sport_id == this._sessionService.casino_id_t20
        || sport.sport_id == this._sessionService.casino_id_D_t20
        || sport.sport_id == this._sessionService.casino_id_H_t20) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/teenpatti-t20']);
      } else if (sport.sport_id == this._sessionService.casino_id_dragon_tiger) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/dragon-tiger']);
      } else if (sport.sport_id == this._sessionService.casino_id_7UpDown
        || sport.sport_id == this._sessionService.casino_id_7UpDown_B
        || sport.sport_id == this._sessionService.casino_id_7UpDown_H) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/7updown']);
      } else if (sport.sport_id == this._sessionService.casino_id_AAA) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //this._sessionService.set('page_type', 'details');
        this.route.navigate(['/aaa']);
      } else if (sport.sport_id == this._sessionService.casino_id_H_Passa) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.route.navigate(['/passa']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_H_Matka) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.route.navigate(['/matka']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_H_Matka) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.route.navigate(['/matka']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_XPG) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('match_name', sport.name);
        this.route.navigate(['/lobbygame']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_EZUGI ||
        sport.sport_id == this._sessionService.casino_id_EVOLUTIONS) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('match_name', sport.name);
        this.route.navigate(['/lobbygame2']);
      }
      else if (sport.sport_id == this._sessionService.casino_id_LOTUS) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('match_name', sport.name);
        this.route.navigate(['/lobbygame3']);
      } else if (sport.sport_id == this._sessionService.matkaMatchSportsId) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('match_name', sport.name);
        this.route.navigate(['/matka-detail']);
      } else if (sport.sport_id == 2225) {
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('match_name', sport.name);
        this.route.navigate(['/titli-detail']);
      }

    }
    else {
      this.route.navigate(["/dashboard"]);
    }

  }

  CheckSportExist(sId) {

    var isExist = false;
    if (this._sportService._ListMatch.InplayMatches != undefined) {
      for (var i = 0; i < this._sportService._ListMatch.InplayMatches.length; i++) {
        if (this._sportService._ListMatch.InplayMatches[i].sport_id == sId) {
          isExist = true;
          break;
        }
      }

    }

    return isExist;


  }


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


  checkMatkaMatchOpen(match) {
    if (isNullOrUndefined(match) || isNullOrUndefined(match.start_date) || isNullOrUndefined(match.end_date)) {
      return;
    }

    if (isNullOrUndefined(match.matkaCurrentlyClose)) {
      match.matkaCurrentlyClose = 0;
    }

    if (isNullOrUndefined(match.matkaLeftTime)) {
      match.matkaLeftTime = "";
    }


    if (this._sportService._serverTime >= +match.start_date && this._sportService._serverTime <= +match.end_date) {
      if (match.matkaCurrentlyClose == 1 || match.matkaCurrentlyClose == 2) {
        match.matkaCurrentlyClose = 0;
      }

      let remainTime = +match.end_date - +this._sportService._serverTime;
      if (remainTime > 0) {
        match.matkaLeftTime = "" + remainTime;
      } else {
        match.matkaLeftTime = "";
      }

    } else if (this._sportService._serverTime < +match.start_date) {
      if (match.matkaCurrentlyClose == 0 || match.matkaCurrentlyClose == 2) {
        match.matkaCurrentlyClose = 1;
      }

      let remainTime = +match.end_date - +this._sportService._serverTime;
      if (remainTime > 0) {
        match.matkaLeftTime = "" + remainTime;
      } else {
        match.matkaLeftTime = "";
      }

    } else {
      if (match.matkaCurrentlyClose == 0 || match.matkaCurrentlyClose == 1) {
        match.matkaCurrentlyClose = 2;
      }
    }
  }

  GoToLobbyPage(sport) {
    if (sport.sport_id == this._sessionService.casino_id_EVOLUTIONS2) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this._sessionService.set('game_id', sport.game_id);
      this._sessionService.set('game_name', sport.game_name);
      this._sessionService.set('provider_name', sport.provider_name);
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

  onImageLoad(evt) {
    if (evt && evt.target) {
      const width = evt.target.naturalWidth;
      const height = evt.target.naturalHeight;
      const portrait = height > width ? true : false;
      console.log(width, height, 'portrait: ', portrait);
    }
  }

  getUrl(Image) {
    return "url('" + Image + "')";
  }
  openTabDiv(sportID) {
    $(".splist").removeClass('active');
    if ($(".dtablink").hasClass('active')) {
      $(".dtablink").removeClass('active');
      $("#" + sportID).addClass('active');
    } else {
      $("#" + sportID).addClass('active');
    }

    if ($(".splist").hasClass('active')) {
      $(".splist").removeClass('active');
    } else {
      $("#splist_" + sportID).addClass('active');
    }

  }
}
