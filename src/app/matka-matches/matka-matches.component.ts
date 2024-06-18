import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { browserRefresh } from '../app.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { MatkaMatchesService } from './matka-matches.services';
import { filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

declare var $: any;


@Component({
  selector: 'app-matka-matches',
  templateUrl: './matka-matches.component.html',
  styleUrls: ['./matka-matches.component.css']
})
export class MatkaMatchesComponent implements OnInit {
  public callType = 1;
  safeSrc: SafeResourceUrl = null;
  loading = false;
  lobbyName = '';
  matchForDashboard = null;
  _ListMatchbySport: any = [];

  constructor(private _sessionService: SessionService,
    public _lobbyService: MatkaMatchesService,
    private sanitizer: DomSanitizer,
    private _sportService: SportServiceService,
    public route: Router) {
    this._sportService.isShowOneClick = false;
    this._ListMatchbySport.InplayMatches = [];
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
      this._sportService.callBalance = 1;
      this._sportService.getBalance();
      this.callKeepAlive();
    });

    this._sportService.callBalance = 1;
    this._sportService.getBalance();
    this.callKeepAlive();
    this.getseiresMatchsList();

  }



  timerForKeepAlive: any;
  removeTimeOut() {
    if (this.timerForKeepAlive != null) {
      window.clearTimeout(this.timerForKeepAlive);
      this.timerForKeepAlive = null;
    }
  }

  callKeepAlive() {
    try {
      this.removeTimeOut();
      this.timerForKeepAlive = setTimeout(() => {
        if (this.route.url == '/lobbygame3') {
          if (this.safeSrc == null) {
            this.callKeepAlive();
            return;
          }

          var sdata = { 'type': "3" };
          this._lobbyService.callKeepAlive(sdata).subscribe(data => {
            if (!data.error) {
              if (this.route.url != '/lobbygame3') {
                return;
              }
              this.callKeepAlive();
            } else {
              if (data.code == 101) {
                this._sessionService.gotoDashboard();
                return;
              }
              this.callKeepAlive();
            }
          }, error => {
            this.callKeepAlive();
          });
        }
      }, 3000);
    }
    catch (e) {
      this.callKeepAlive();
    }
  }
  GoToDetailPage(sport) {
    if (sport.IsBetAllow == 'Y') {
      this._sportService.callType = 1;
      if (sport.sport_id == this._sessionService.matkaMatchSportsId) {
        this._sessionService.set('match_id', sport.match_id);
        this._sessionService.set('sport_id', sport.sport_id);
        this._sessionService.set('match_name', sport.name);
        this.route.navigate(['/matka-detail']);
      }
    }
    else {
      this.route.navigate(["/dashboard"]);
    }

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

  getseiresMatchsList() {
    if (this.route.url == '/matka-matches') {
      var sdata = { "limit": '50', "pageno": 1, "sport_id": '222', "series_id": 0, 'type': 'home' };
      //if (sport_id == 111) {
      this._lobbyService.getMatchListBySportIdAndSeriesId(sdata).subscribe(data => {
        if (this.matchForDashboard != null) {
          clearTimeout(this.matchForDashboard);
        }

        if (!data.error) {
          var result = data;;
          if (!isNullOrUndefined(result)) {
            //this._sportService.updateBetAllowTimeInResponse(result.UpCommingMatches)
            this.setMatchDataHome(result);
            this._sportService._serverTime = data.currentTime;
          }
        }
        this.loading = false;

        this.matchForDashboard = setTimeout(() => {
          this.getseiresMatchsList();
          this.callType++;
        }, this.callType == 1 ? 0 : 15000);
        //this.sportsList = data;

      }, (error) => {
        this.callType = 2;
        this.getseiresMatchsList();
      });

      //} else {

      //}
    }
  }

  setMatchDataHome(result) {
    var InplayMatches = result.data.InplayMatches;
    if (InplayMatches.length != this._ListMatchbySport.InplayMatches.length) {
      this._ListMatchbySport.InplayMatches = InplayMatches;
    }
    else {
      for (let i = 0; i < InplayMatches.length; i++) {
        var indx = this._ListMatchbySport.InplayMatches.findIndex(x => x.market_id == InplayMatches[i].market_id);
        if (indx > -1) {
          this._ListMatchbySport.InplayMatches[indx].backRateDiff = InplayMatches[i].backRateDiff;
          this._ListMatchbySport.InplayMatches[indx].InplayStatus = InplayMatches[i].InplayStatus;
          this._ListMatchbySport.InplayMatches[indx].IsFancyAllow = InplayMatches[i].IsFancyAllow;

          this._ListMatchbySport.InplayMatches[indx].BetAllowTimeBefore = InplayMatches[i].BetAllowTimeBefore;
          this._ListMatchbySport.InplayMatches[indx].favMatchID = InplayMatches[i].favMatchID;
          this._ListMatchbySport.InplayMatches[indx].IsBetAllow = InplayMatches[i].IsBetAllow;
          this._ListMatchbySport.InplayMatches[indx].layRateDiff = InplayMatches[i].layRateDiff;
          this._ListMatchbySport.InplayMatches[indx].matchVolumn = InplayMatches[i].matchVolumn;
          this._ListMatchbySport.InplayMatches[indx].runner_json = this._sportService.checkUpdatedData(this._ListMatchbySport.InplayMatches[indx].runner_json, InplayMatches[i].runner_json);

          this._ListMatchbySport.InplayMatches[indx].order_by = InplayMatches[i].order_by;
          this._ListMatchbySport.InplayMatches[indx].start_date = InplayMatches[i].start_date;
          if (!isNullOrUndefined(InplayMatches[i].end_date)) {
            this._ListMatchbySport.InplayMatches[indx].end_date = InplayMatches[i].end_date;
          }
          if (!isNullOrUndefined(InplayMatches[i].draw_date)) {
            this._ListMatchbySport.InplayMatches[indx].draw_date = InplayMatches[i].draw_date;
          }
          this._ListMatchbySport.InplayMatches[indx].row_num = InplayMatches[i].row_num;
          this._ListMatchbySport.InplayMatches[indx].adminMessage = InplayMatches[i].adminMessage;
          this._ListMatchbySport.InplayMatches[indx].inPlay = true;
          var btBefor = this._ListMatchbySport.InplayMatches[indx].BetAllowTimeBefore;

          this._sportService._serverTime = result.currentTime;
          var timeStamp = this._sportService.timeDifference((this._ListMatchbySport.InplayMatches[indx].start_date - btBefor) * 1000, this._sportService._serverTime * 1000);
          if (timeStamp == 'Inplay') {
            this._ListMatchbySport.InplayMatches[indx].isDetail = true;
            this._ListMatchbySport.InplayMatches[indx].remainTime = timeStamp;
          } else {
            this._ListMatchbySport.InplayMatches[indx].isDetail = false;
            this._ListMatchbySport.InplayMatches[indx].remainTime = timeStamp;
          }
        }
      }

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
}
