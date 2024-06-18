import { Component, OnInit } from '@angular/core';
import { SportServiceService } from '../../service/sport-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CupbetsService } from 'src/app/cupbets/cupbets.services';
import { SessionService } from 'src/app/service/session.service';
import { isNullOrUndefined } from 'util';
import { environment } from '../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  SportData: any;
  CupData: any = [];
  loading = false;
  selectedSport: string;
  IsActive: any;
  cupBetMatchMarkets: any;
  searchMatch: any = [];
  _LeftMenuMatch = [];
  isDashboard = false;
  isSidebarShow = true;

  constructor(public _sportService: SportServiceService, public _sessionService: SessionService, public _cupbetsServices: CupbetsService, private route: Router, private router: ActivatedRoute) { }

  ngOnInit() {
    this.GetSport();
    if (this.route.url == '/dashboard' || this.route.url == '/inplay' || this.route.url == '/cricket-details' || this.route.url == '/tennis-details' || this.route.url == '/soccer-details' || this.route.url == '/payment/deposit' || this.route.url == '/withdraw' || this.route.url == '/account-statement' || this.route.url == '/profit-loss' || this.route.url == '/my-bets' || this.route.url == '/dwrequest-statement' || this.route.url == '/change-password') {
      this.isDashboard = true;
    }

    if (this.route.url == '/userdashboard') {
      this.isSidebarShow = false;
    }
  }
  callFun(cls) {
    $(".s1").click();
  }
  GoToElectionPage(sport) {
    if (sport.sport_id == 2003) {
      this._sessionService.set('match_id', '1002003');
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/election-details']);
    }
  }

  GoToCasinoPage(sport) {
    if (sport.sport_id == 2003) {
      this._sessionService.set('match_id', '1002003');
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/election-details']);
    }
  }
  GoToDetailPage(sport) {
    //if (sport.IsBetAllow == 'Y') {
    this._sportService.callType = 1;
    if (sport.sport_id == 4) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      window.location.href = "https://" + environment.domain + '/cricket-details';
      //this.route.navigate(['/cricket-details']);

    }
    else if (sport.sport_id == 2003) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      window.location.href = "https://" + environment.domain + '/election-details';
      //this.route.navigate(['/election-details']);
    }
    else if (sport.sport_id == 7) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('market_id', sport.market_id);
      this._sessionService.set('sport_id', sport.sport_id);
      window.location.href = "https://" + environment.domain + '/horse-details';
      //this.route.navigate(['/horse-details']);
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
      window.location.href = "https://" + environment.domain + '/soccer-details';
      //this.route.navigate(['/soccer-details']);
    }
    else if (sport.sport_id == 2) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      window.location.href = "https://" + environment.domain + '/tennis-details';
      //this.route.navigate(['/tennis-details']);
    }
    else if (sport.sport_id == this._sessionService.casino_id_t20
      || sport.sport_id == this._sessionService.casino_id_D_t20
      || sport.sport_id == this._sessionService.casino_id_H_t20) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/teenpatti-t20']);
    }
    else if (sport.sport_id == this._sessionService.casino_id_H_Muflis) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/teenpatti-muflis']);
    }
    else if (sport.sport_id == this._sessionService.casino_id_H_Test) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/teenpatti-test']);
    }
    else if (sport.sport_id == this._sessionService.casino_id_t1day
      || sport.sport_id == this._sessionService.casino_id_D_t1day) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/teenpatti-oneday']);
    } else if (sport.sport_id == this._sessionService.casino_id_andarbahar) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/andarbahar']);
    } else if (sport.sport_id == this._sessionService.casino_id_poker
      || sport.sport_id == this._sessionService.casino_id_poker_T20) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/poker']);
    } else if (sport.sport_id == this._sessionService.casino_id_poker6player) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/poker-6player']);
    } else if (sport.sport_id == this._sessionService.casino_id_32cards) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/32cards']);
    } else if (sport.sport_id == this._sessionService.casino_id_hilow) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/hilow']);
    } else if (sport.sport_id == this._sessionService.casino_id_7UpDown
      || sport.sport_id == this._sessionService.casino_id_7UpDown_B
      || sport.sport_id == this._sessionService.casino_id_7UpDown_H) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/7updown']);
    } else if (sport.sport_id == this._sessionService.casino_id_AAA) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this.route.navigate(['/passa']);
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
    } else if (sport.sport_id == this._sessionService.casino_id_LOTUS) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this._sessionService.set('match_name', sport.name);
      this.route.navigate(['/lobbygame3']);
    } else if (sport.sport_id == this._sessionService.matkaMatchSportsId) {
      this._sessionService.set('match_id', sport.match_id);
      this._sessionService.set('sport_id', sport.sport_id);
      this._sessionService.set('match_name', sport.name);
      this.route.navigate(['/matka-detail']);
    }
    // }
    // else {
    //   this.route.navigate(["/dashboard"]);
    // }

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

      this.route.navigate(['dashboard']);
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
  changeDashboard(sport) {
    if (this.route.url == "/dashboard") {
      this._sportService.resetSportData();
      this._sportService.GetSeriesBySportId(sport, true);
      this._sportService.getseiresMatchsList(sport.sport_id, 'home')
      this._sportService.sideBarSelectedSports = null;
    } else {
      this._sportService.sideBarSelectedSports = sport;
    }
  }
  changeDashboard2(sportId) {
    if (this.route.url == "/dashboard") {
      this._sportService.resetSportData();
      //this._sportService.GetSeriesBySportId(sport, true);
      this._sportService.callFun(sportId);
      this._sportService.callTab2('Casino', sportId);
      this._sportService.getseiresMatchsList(sportId, 'home')
      this._sportService.sideBarSelectedSports = null;
    }
    this.redirect();
  }
  GetSport() {
    //this.loading=true;
    var sdata = {
      "limit": 10,
      "pageno": 1
    }
    this._sportService.getSports(sdata).subscribe(data => {
      if (!data.error) {
        this.SportData = data.data;
        this.CupData = data.CupData;
        this._sportService.SportList = data.data;
        if (!isNullOrUndefined(data.DepositWidthrwalDetails)) {
          let DepositWidthrwalDetails = data.DepositWidthrwalDetails;
          if (!isNullOrUndefined(DepositWidthrwalDetails.DepositDescription)) {
            this._sessionService.depositPlaceHolder = DepositWidthrwalDetails.DepositDescription;
          }
          if (!isNullOrUndefined(DepositWidthrwalDetails.PaymentInformation)) {
            this._sessionService.accountInformation = DepositWidthrwalDetails.PaymentInformation;
          }

          if (!isNullOrUndefined(DepositWidthrwalDetails.WithdrawalDescription)) {
            this._sessionService.withdrawlPlaceHolder = DepositWidthrwalDetails.WithdrawalDescription;
          }
        }
      }
    }, error => {
      //this.loading=false;
    })
  }
  setActive(menuNo) {

    this.IsActive = menuNo;


  }
  GetMatchBySeriesId(series) {
    var sdata = { "limit": 20, "pageno": 1, "sport_id": series.sport_id, "series_id": series.series_id }
    this._sportService.getMatchListBySeriesId(sdata).subscribe(data => {
      if (!data.error) {
        var result = data.data;
        if (!isNullOrUndefined(result)) {
          this._LeftMenuMatch = result;
        }
      }
    }, (error) => {

    })
    // if (this.router.url == "/home") {
    //   this._sportService._seriesId = series.series_id;
    //   this._sportService.callType = 1;
    //   this._sportService._LeftMenuMatch = [];
    //   this.sportsListService.GetMatchList(series.sport_id)
    // } else {
    //   for (let index = 0; index < this._sportService.SportList.length; index++) {
    //     if (this._sportService.SportList[index].sport_id == series.sport_id) {
    //       this._sportService.sideBarSelectedSeries = series;
    //       this._sportService.sideBarSelectedSports = this._sportService.SportList[index];
    //       this.router.navigate(['home']);
    //       break;
    //     }
    //   }
    // }
  }
  // GetMatchBySeriesId(series) {
  //   if (this.route.url == "/dashboard") {
  //     this._sportService._seriesId = series.series_id;
  //     this._sportService.callType = 1;
  //     this._sportService._LeftMenuMatch = [];
  //     this._sportService.getseiresMatchsList(series.sport_id, 'home')
  //   } else {
  //     for (let index = 0; index < this._sportService.SportList.length; index++) {
  //       if (this._sportService.SportList[index].sport_id == series.sport_id) {
  //         this._sportService.sideBarSelectedSeries = series;
  //         this._sportService.sideBarSelectedSports = this._sportService.SportList[index];
  //         this.route.navigate(['dashboard']);
  //         break;
  //       }
  //     }
  //   }
  // }
  getCupDetails(matchDetails) {

    this._sessionService.set('match_id', matchDetails.match_id);
    this._sessionService.set('sport_id', matchDetails.sport_id);
    this.route.navigate(['cupbets']);
    this.resetSport();
  }
  resetSport() {
    //this._sportService._selectedSport='All';
    //this._sportService.callTabName('All');
    //this._sportService.GetMatchList('');
    this.closeMenu();
  }
  closeMenu() {
    $(".sidenav2").removeClass('active');
    $(".sports-drop-bx").removeClass('active');
    $('.my-tree li a.active').removeClass('active');
  }

  getDiamondCasino(gameid) {
    this._sessionService.set('gameId', gameid);
    window.location.href = 'https://' + environment.domain + '/diamond-casino';
    //window.location.href = 'http://localhost:4200/diamond-casino';
    //this.route.navigate(['/diamond-casino']);
  }

  casinoLobby(gameId, gameName) {
    this._sessionService.set('gameName', gameName);
    this._sessionService.set('game_id', gameId);
    window.location.href = "https://" + environment.domain + '/lobbygame2';
    //window.location.href = 'http://localhost:4200/lobbygame2';
  }
}