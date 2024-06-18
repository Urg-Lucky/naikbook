import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { browserRefresh } from '../app.component';

declare var $: any;

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit {
  HorseId = 7;
  GreyHoundId = 4339;
  ListMatch: any = [];
  TournamentTab = 1;
  loading = false;
  callType = 1;
  typeMatches;
  statusflag = 'livetour';
  constructor(public _sessionService: SessionService,
    private route: Router, public _sportService: SportServiceService) { }
  slideConfig = {
    "slidesToShow": 1, "slidesToScroll": 1, "dots": true, "infinite": false, "autoplay": true,
    "autoplaySpeed": 1500
  };
  ngOnInit() {

    if (browserRefresh) {
      this._sessionService.gotoLoginPage();
      return;
    }

    this._sportService._selectedSportId = '';
    this._sportService._selectedSport = 'All';
    this._sportService.resetSportData();
    this._sportService.GetUpcomingMatchList(0)

    this._sportService.isShowOneClick = false;

    this._sportService.callBalance = 1;
    this._sportService.getBalance();

  }

  callFun(cls) {

    $(".sports-drop-bx").addClass('active');
    $(".sidenav2").addClass('active');
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

        if (value != undefined && value != "--") {
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
      if (sport.sport_id == 4) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.route.navigate(['/cricket-details']);

      }
      else if (sport.sport_id == 7) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('market_id', sport.market_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.route.navigate(['/horse-details']);
      }
      else if (sport.sport_id == 4339) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('market_id', sport.market_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.route.navigate(['/greyhound-details']);
      }
      else if (sport.sport_id == 1) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.route.navigate(['/soccer-details']);
      }
      else if (sport.sport_id == 2) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this.route.navigate(['/tennis-details']);
      }
    }
    else {
      this.route.navigate(["/dashboard"]);
    }
  }
  isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }
  CheckSportExist(sId) {

    var isExist = false;
    if (this._sportService._ListUpcomingMatch != undefined) {
      for (var i = 0; i < this._sportService._ListUpcomingMatch.length; i++) {
        if (this._sportService._ListUpcomingMatch[i].sport_id == sId) {
          isExist = true;
          break;
        }
      }

    }

    return isExist;


  }
}
