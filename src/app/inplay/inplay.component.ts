import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { browserRefresh } from '../app.component';
import { environment } from '../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-inplay',
  templateUrl: './inplay.component.html',
  styleUrls: ['./inplay.component.css']
})
export class InplayComponent implements OnInit {
  HorseId = 7;
  GreyHoundId = 4339;
  ListMatch: any = [];
  TournamentTab = 1;
  loading = false;
  callType = 1;
  typeMatches;
  statusflag = 'livetour';
  isDashboard = '';
  matchForDashboard = null;
  _serverTime: any;
  _ListInPlayMatch: any = [];
  sportIDS = null;
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
    this._sportService.GetInlayMatchList(0)

    this._sportService.isShowOneClick = false;

    this._sportService.callBalance = 1;
    this._sportService.getBalance();

    if (this.route.url == '/dashboard') {
      this.isDashboard = 'dash_yes';
    } else {
      this.isDashboard = 'dash_no';
    }
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
        //window.location.href = "https://" + environment.domain + '/cricket-details';

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
        //window.location.href = "https://" + environment.domain + '/soccer-details';
      }
      else if (sport.sport_id == 2) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        //window.location.href = "https://" + environment.domain + '/tennis-details';
        this.route.navigate(['/tennis-details']);
      }
    }
    else {
      this.route.navigate(["/dashboard"]);
    }
  }

  GetInlayMatchList() {
    var sport = {
      "limit": 10,
      "pageno": 1,
      "sport_id": 0
    }
    if (this.route.url == '/inplay') {
      this.loading = true;
      this._sportService.getInplayMatchListBySportId(sport).subscribe(data => {
        if (this.matchForDashboard != null) {
          clearTimeout(this.matchForDashboard);
        }
        if (!data.error) {

          this._serverTime = data.currentTime;
          var result = data.data;
          this._sportService.updateBetAllowTimeInResponse(result)
          if (result != null) {
            this.loading = false;
            if (this.callType == 1) {
              this._ListInPlayMatch = data.data;
            }
            else {
              if (this._ListInPlayMatch == undefined) {
                this._ListInPlayMatch = result;
              }
              else if (this._ListInPlayMatch.length != result.length) {
                this._ListInPlayMatch = result;
              } else {
                this.setInplayMatchData(result);
              }
            }
          }
          else {
            this.loading = false;
            this._ListInPlayMatch = [];
          }

          console.log(this._ListInPlayMatch);

          this.matchForDashboard = setTimeout(() => {
            this.GetInlayMatchList();
            this.callType++;
          }, this.callType == 1 ? 0 : 15000);
          // this.callType = 2;
          // this.GetInlayMatchList(sportID);
        }
      }, error => {
        this.callType = 2;
        this.GetInlayMatchList();
      })
    }
  }

  setInplayMatchData(result) {
    var favoriteMatch = result;
    if (favoriteMatch.length != this._ListInPlayMatch.length) {
      this._ListInPlayMatch = favoriteMatch;
    }
    else {
      for (let i = 0; i < favoriteMatch.length; i++) {
        var indx = this._ListInPlayMatch.findIndex(x => x.market_id == favoriteMatch[i].market_id);
        if (indx > -1) {
          this._ListInPlayMatch[indx].backRateDiff = favoriteMatch[i].backRateDiff;
          this._ListInPlayMatch[indx].InplayStatus = favoriteMatch[i].InplayStatus;
          this._ListInPlayMatch[indx].IsFancyAllow = favoriteMatch[i].IsFancyAllow;
          this._ListInPlayMatch[indx].BetAllowTimeBefore = favoriteMatch[i].BetAllowTimeBefore;
          this._ListInPlayMatch[indx].favMatchID = favoriteMatch[i].favMatchID;
          this._ListInPlayMatch[indx].IsBetAllow = favoriteMatch[i].IsBetAllow;
          this._ListInPlayMatch[indx].layRateDiff = favoriteMatch[i].layRateDiff;
          this._ListInPlayMatch[indx].matchVolumn = favoriteMatch[i].matchVolumn;
          this._ListInPlayMatch[indx].runner_json = this._sportService.checkUpdatedData(this._ListInPlayMatch[indx].runner_json, favoriteMatch[i].runner_json);

          this._ListInPlayMatch[indx].order_by = favoriteMatch[i].order_by;
          this._ListInPlayMatch[indx].start_date = favoriteMatch[i].start_date;
          this._ListInPlayMatch[indx].row_num = favoriteMatch[i].row_num;
          this._ListInPlayMatch[indx].adminMessage = favoriteMatch[i].adminMessage;

          this._ListInPlayMatch[indx].isDetail = favoriteMatch[i].isDetail;
          this._ListInPlayMatch[indx].remainTime = favoriteMatch[i].remainTime;

        }
      }

    }
  }

  isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }
  CheckSportExist(sId) {

    var isExist = false;
    if (this._sportService._ListInPlayMatch != undefined) {
      for (var i = 0; i < this._sportService._ListInPlayMatch.length; i++) {
        if (this._sportService._ListInPlayMatch[i].sport_id == sId) {
          isExist = true;
          break;
        }
      }

    }

    return isExist;


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
  showInplayDiv(sportId) {
    if (sportId > 0) {
      $(".matchboxBB2").hide();
      $("#sports_" + sportId).show();
    } else {
      $(".matchboxBB2").show();
    }
  }
}
