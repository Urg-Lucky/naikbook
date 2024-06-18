import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { CupbetsService } from './cupbets.services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { browserRefresh } from '../app.component';
import { isNullOrUndefined } from 'util';


declare var $: any;
@Component({
  selector: 'app-cupbets',
  templateUrl: './cupbets.component.html',
  styleUrls: ['./cupbets.component.css']
})
export class CupbetsComponent implements OnInit, OnDestroy {
  oneClickShow = false;
  ListMatch: any = [];
  cupBetMatchMarkets: any = [];
  UserOneClickStack: any = [];
  cupBetUserSportsDetails: any = [];
  TournamentTab = 1;
  matchBetsList: any;
  loading = false;

  matchForCup: any;
  sportData: any;
  MatchBetList: any = [];
  callType = 1;
  typeMatches;
  statusflag = 'livetour';
  _serverTime: any;
  isShow: any;
  matchStack: any = [];
  isEditStack = false;
  isOneEdit = false;
  isOneActive: any;
  selectedOneClick = 0;
  tSdata = { 'match_id': "", 'sport_id': "" };
  stake2: any = {};
  FinalTeam: any = [];
  stakeIds: any = [];
  backArray: any = [];
  layArray: any = [];
  BackLayArray: any = [];
  TempArray: any = [];
  arrayObj: any = {};
  callBetFancy = 1;
  oneClickStackUpdate = new FormGroup({
    stackvalue1: new FormControl('', [Validators.required, Validators.min(1)]),
    stackvalue2: new FormControl('', [Validators.required, Validators.min(1)]),
    stackvalue3: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  oneMatchStack = new FormGroup({
    matchStack1: new FormControl(null, [Validators.required, Validators.min(1)]),
    matchStack2: new FormControl(null, [Validators.required, Validators.min(1)]),
    matchStack3: new FormControl(null, [Validators.required, Validators.min(1)]),
    matchStack4: new FormControl(null, [Validators.required, Validators.min(1)]),
    matchStack5: new FormControl(null, [Validators.required, Validators.min(1)]),

  });

  constructor(public _sessionService: SessionService,
    public _sportService: SportServiceService,
    //private fb: FormBuilder,
    public _cupbetsServices: CupbetsService, public route: Router) {
    this.MatchBetList.MatchAndBetfair = [];
    this.MatchBetList.MatchFancy = [];
    this.getMatchBetAndFancyBetList();
    this.GetCupBetsMarketList();
    this._sportService.callBalance = 1;
    this._sportService.getBalance();
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
      this.callType = 1;
      this.MatchBetList = [];
      this.cupBetMatchMarkets = [];
      this.MatchBetList.MatchAndBetfair = [];
      this.MatchBetList.MatchFancy = [];
      this.getMatchBetAndFancyBetList();
      this.GetCupBetsMarketList();
      this._sportService.callBalance = 1;
      this._sportService.getBalance();
    });
    this._sportService.isShowOneClick = true;

  }
  updateDataOneClick() {
    this._sportService._loading = true;
    let tdata = { 'one_click_stack': this.oneClickStackUpdate.value.stackvalue1 + ',' + this.oneClickStackUpdate.value.stackvalue2 + ',' + this.oneClickStackUpdate.value.stackvalue3, 'match_stack': "0", 'sport_id': this._sessionService.get('sport_id') };
    this.UserOneClickStack = tdata.one_click_stack.split(',');
    var oneStack = this.oneClickStackUpdate.value.stackvalue1 + ',' + this.oneClickStackUpdate.value.stackvalue2 + ',' + this.oneClickStackUpdate.value.stackvalue3;
    var isduplicate = this.checkDuplicate(oneStack);
    if (isduplicate) {
      this._sessionService.notifier.notify('error', 'Duplicate value is not allow.');
      this._sportService._loading = false;
    }
    else {


      this._sportService.updateOneClickStack(tdata).subscribe(data => {
        if (!data.error) {
          this._sessionService.notifier.notify('success', 'Successfully Updated');
          this.selectedOneClick = 0;
          this.isOneActive = -1;
          this.GetCupBetsMarketList();
          this._sportService._loading = false;
          this.isOneEdit = false;
        }
      }, (error) => {
        this._sportService._loading = false;
        this._sessionService.printLog(error.error);
        if (error.error instanceof ProgressEvent) {
          if (error.status == 0) {
            this._sessionService.notifier.notify('error', "Internet not available.");
            return;
          }
        }
        this._sessionService.notifier.notify('error', error.message);


      })
    }
  }
  updateOdds(type, cuprenners) {
    if (type == "min") {
      if (cuprenners.odds > 0) {
        cuprenners.odds = (parseFloat(cuprenners.odds) - 0.01).toFixed(2);
      }
    }
    else if (type == "max") {
      cuprenners.odds = (parseFloat(cuprenners.odds) + 0.01).toFixed(2);
    }
    this.updatePL(cuprenners);

  }
  updateMatchStack() {

    if (!this.oneMatchStack.invalid) {
      this._sportService._loading = true;
      var stackDetail = this.oneMatchStack.value;
      var matchStack = stackDetail.matchStack1 + "," + stackDetail.matchStack2 + "," + stackDetail.matchStack3 + "," + stackDetail.matchStack4 + "," + stackDetail.matchStack5;

      var isduplicate = this.checkDuplicate(matchStack);
      if (isduplicate) {
        this._sessionService.notifier.notify('error', 'Duplicate value is not allow.');
        this._sportService._loading = false;
      }
      else {

        let tdata = { 'one_click_stack': "0", 'match_stack': matchStack, 'sport_id': this._sessionService.get('sport_id') };
        this.UserOneClickStack = tdata.one_click_stack.split(',');
        this._sportService.updateOneClickStack(tdata).subscribe(data => {
          if (!data.error) {
            this._sessionService.notifier.notify('success', 'Successfully Updated');
            this.isEditStack = false;
            this.isShow = -1;
            //  this.GetCupBetsMarketList();
          }
          this._sportService._loading = false;
        }, (error) => {
          this._sportService._loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify('error', "Internet not available.");
              return;
            }
          }
          this._sessionService.notifier.notify('error', error.message);


        })
      }

    }
  }
  checkDuplicate(matchStack) {
    var isexist = false;
    var arrStack = matchStack.split(',');
    var arr = [];
    for (let i = 0; i < arrStack.length; i++) {
      arr.push(parseInt(arrStack[i]));
    }
    var sorted_arr = arr.sort();
    for (var i = 0; i < arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        isexist = true;
        return isexist;

      }
    }
  }
  GetCupBetsMarketList() {

    if (this.matchForCup != null) {
      clearTimeout(this.matchForCup);
      this.matchForCup = null;
    }
    this.matchForCup = setTimeout(() => {
      if (this.route.url == '/cupbets') {

        if (this.tSdata.match_id == "") {
          this.tSdata = { 'match_id': this._sessionService.get('match_id'), 'sport_id': this._sessionService.get('sport_id') };
        }
        else if (this.tSdata.match_id == this._sessionService.get('match_id')) {
          this.tSdata = { 'match_id': this._sessionService.get('match_id'), 'sport_id': this._sessionService.get('sport_id') };
        }
        else if (this.tSdata.match_id != this._sessionService.get('match_id')) {
          this.tSdata = { 'match_id': this._sessionService.get('match_id'), 'sport_id': this._sessionService.get('sport_id') };
          this.callType = 1;
        }
        this._cupbetsServices.GetCupMarketList(this.tSdata).subscribe(data => {
          if (!data.error) {

            var result = data.data;
            if (isNullOrUndefined(result.MatchDetails.start_date)) {
              this._sessionService.gotoDashboard();
              return;
            }
            this._serverTime = data.currentTime;
            //this.cupBetUserSportsDetails=result.UserSportSettings[0];
            //this.UserOneClickStack=this.cupBetUserSportsDetails.one_click_stack.split(',');  
            if (this.callType == 1) {
              this.cupBetMatchMarkets = result.MatchDetails;
              this.cupBetUserSportsDetails = result.UserSportSettings[0];
              this.UserOneClickStack = this.cupBetUserSportsDetails.one_click_stack.split(',');
              this.matchStack = this.cupBetUserSportsDetails.match_stack.split(',');
              this.setcupBetMatchData(result.MatchDetails);

              for (let i = 0; i < this.cupBetMatchMarkets.runner_json.length; i++) {
                this._sportService.AssignKeyInit(this.cupBetMatchMarkets.runner_json[i].selectionId, this.cupBetMatchMarkets.match_id, this.cupBetMatchMarkets.market_id);
              }
            }
            else {

              this.setcupBetMatchData(result.MatchDetails);
              this.cupBetUserSportsDetails = result.UserSportSettings[0];
              this.matchStack = this.cupBetUserSportsDetails.match_stack.split(',');
            }
            this.callType = 2;

            this.GetCupBetsMarketList();
          }
        }, error => {
          this.callType = 2;
          this.GetCupBetsMarketList();
        });
      }
    }, this.callType == 1 ? 0 : 1000);
  }

  setcupBetMatchData(result) {
    if (result != null) {
      var cupBetMatch = result;
      this.cupBetMatchMarkets.matchVolumn = cupBetMatch.matchVolumn;
      this.cupBetMatchMarkets.BetAllowTimeBefore = cupBetMatch.BetAllowTimeBefore;
      this.cupBetMatchMarkets.InplayStatus = cupBetMatch.InplayStatus;
      this.cupBetMatchMarkets.IsBetAllow = cupBetMatch.IsBetAllow;
      this.cupBetMatchMarkets.SportName = cupBetMatch.SportName;
      this.cupBetMatchMarkets.SportmaxOddsLimt = cupBetMatch.SportmaxOddsLimt;
      this.cupBetMatchMarkets.SportminOddsLimt = cupBetMatch.SportminOddsLimt;
      this.cupBetMatchMarkets.backRateDiff = cupBetMatch.backRateDiff;
      this.cupBetMatchMarkets.favMatchID = cupBetMatch.favMatchID;
      this.cupBetMatchMarkets.layRateDiff = cupBetMatch.layRateDiff;
      this.cupBetMatchMarkets.sportGraphic = cupBetMatch.sportGraphic;
      this.cupBetMatchMarkets.sportScore = cupBetMatch.sportScore;
      this.cupBetMatchMarkets.sportShowLastResult = cupBetMatch.sportShowLastResult;
      this.cupBetMatchMarkets.sportShowTV = cupBetMatch.sportShowTV;
      this.cupBetMatchMarkets.start_date = cupBetMatch.start_date;
      this.cupBetMatchMarkets.adminMessage = cupBetMatch.adminMessage;

      var btBefor = this.cupBetMatchMarkets.BetAllowTimeBefore;
      if ((this.cupBetMatchMarkets.start_date - btBefor) > this._serverTime) {
        this.cupBetMatchMarkets.isDetail = false;
        var timeStamp = this._sportService.timeDifference((this.cupBetMatchMarkets.start_date - btBefor) * 1000, this._serverTime * 1000);
        this.cupBetMatchMarkets.remainTime = timeStamp;
      }
      else {
        this.cupBetMatchMarkets.isDetail = true;
        this.cupBetMatchMarkets.remainTime = "Inplay"
      }
      if (cupBetMatch.runner_json != null && cupBetMatch.runner_json != 'null') {
        for (let i = 0; i < cupBetMatch.runner_json.length; i++) {

          var indx = this.cupBetMatchMarkets.runner_json.findIndex(x => x.selectionId == cupBetMatch.runner_json[i].selectionId);
          if (indx > -1) {

            this.cupBetMatchMarkets.runner_json[indx].WinAndLoss = cupBetMatch.runner_json[i].WinAndLoss;
            if (this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack != undefined && this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack.length > 0) {
              for (var r = 0; r < this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack.length; r++) {
                try {

                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack[r].price = cupBetMatch.runner_json[i].ex.availableToBack[r].price;
                }
                catch (e) {
                  // if (this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack[r] == undefined) {
                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack[r].price = "--";
                  // }
                }

                try {
                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack[r].size = cupBetMatch.runner_json[i].ex.availableToBack[r].size;
                }
                catch (e) {
                  // if (this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack[r] == undefined) {
                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack[r].size = "--";
                  // }
                }

              }
              if (this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack.length < 3) {
                var len = this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack.length;
                for (let t = len; t < 3; t++) {
                  var data = { price: "--", size: "--" };

                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack.push(data);
                }
              }
            }
            else {
              this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack = [];

              for (let t = 0; t < 3; t++) {
                var data = { price: "--", size: "--" };

                this.cupBetMatchMarkets.runner_json[indx].ex.availableToBack.push(data);
              }
            }
            if (this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay != undefined && this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay.length > 0) {

              for (var r = 0; r < this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay.length; r++) {
                try {
                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay[r].price = cupBetMatch.runner_json[i].ex.availableToLay[r].price;
                }
                catch (e) {

                  // if (this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay[r] == undefined) {
                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay[r].price = "--";
                  // }
                }

                try {
                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay[r].size = cupBetMatch.runner_json[i].ex.availableToLay[r].size;
                }
                catch (e) {
                  // if (this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay[r] == undefined) {
                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay[r].size = "--";
                  // }
                }

              }
              if (this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay.length < 3) {
                var len = this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay.length;
                for (let t = len; t < 3; t++) {
                  var data = { price: "--", size: "--" };

                  this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay.push(data);
                }
              }

            }
            else {
              this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay = [];

              for (var t = 0; t < 3; t++) {
                var data = { price: "--", size: "--" };
                this.cupBetMatchMarkets.runner_json[indx].ex.availableToLay.push(data);
              }
            }
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
  updateStack(stack, updateStack) {

    updateStack.stack = parseFloat(stack) + parseFloat(updateStack.stack == null ? 0 : updateStack.stack);
    if (parseFloat(updateStack.odds) >= 0) {
      updateStack.p_l = ((parseFloat(updateStack.odds) * updateStack.stack) - updateStack.stack);
    }
    if (this._sportService.stakeIds != undefined) {
      this._sportService.CalculateProfitLoss(updateStack, 1);//1 for add
    }

  }
  updatePL(updateStack) {

    if (parseFloat(updateStack.odds) >= 0) {
      updateStack.p_l = ((parseFloat(updateStack.odds) * updateStack.stack) - updateStack.stack);
    }
    if (this._sportService.stakeIds != undefined) {
      this._sportService.CalculateProfitLoss(updateStack, 1);//1 for add
    }
  }
  setBetBox(type, cuprenners) {

    if (type == "back") {
      cuprenners.isbackClass = 'isbackclass'; cuprenners.islayClass = '';
      cuprenners.isBackBox = 1; cuprenners.isLayBox = 0;
      cuprenners.odds = this.retrunValue('back', this.cupBetMatchMarkets, cuprenners.ex.availableToBack[0].price);
      cuprenners.type = "1";
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
    }
    else if (type == "lay") {
      cuprenners.isbackClass = ''; cuprenners.islayClass = 'islayclass';
      cuprenners.isLayBox = 1; cuprenners.isBackBox = 0
      cuprenners.odds = this.retrunValue('lay', this.cupBetMatchMarkets, cuprenners.ex.availableToLay[0].price);
      cuprenners.type = "0";
      if (cuprenners.odds == "--") {
        cuprenners.odds = 0;
      }
    }
    cuprenners.stack = 0;
    cuprenners.market_id = this.cupBetMatchMarkets.market_id;
    cuprenners.match_id = this.cupBetMatchMarkets.match_id;
    this._sportService.AddBackOrLay(cuprenners);//step 2
    if (this._sportService.oneClickShow) {
      if (this.selectedOneClick == 0) {
        this._sessionService.notifier.notify('error', 'Please select one click stack.');
      }
      else {
        cuprenners.stack = this.selectedOneClick;
        this.saveSportBetData(cuprenners);
      }

      this.isShow = -1;
    }
    else {
      this.isEditStack = false;
    }

  }
  saveSportBetData(cuprenners) {

    if (cuprenners.odds <= 0) {
      this._sessionService.notifier.notify('error', 'Odds must be grater than 0');
    }
    else if (cuprenners.stack <= 0) {
      this._sessionService.notifier.notify('error', 'Stack must be grater than 0');
    }
    else {
      this._sportService._loading = true;
      var sdata =
      {
        "match_id": this._sessionService.get('match_id'),
        "market_id": cuprenners.market_id,
        "selection_id": cuprenners.selectionId,
        "odds": cuprenners.odds.toString(),
        "stack": parseInt(cuprenners.stack),
        "is_back": cuprenners.type
      }

      this._sportService.saveBetData(sdata).subscribe(data => {

        if (!data.error) {
          this._sessionService.notifier.notify('success', data.message);
          this.isShow = -1;
          this._sportService.callBalance = 1;
          this._sportService.getBalance();

          for (var r = 0; r < this.cupBetMatchMarkets.runner_json.length; r++) {
            this.cupBetMatchMarkets.runner_json[r].WinAndLoss = this.cupBetMatchMarkets.runner_json[r].WinAndLoss + (this._sportService.stake2["field_" + this.cupBetMatchMarkets.runner_json[r].selectionId + "_" + this.cupBetMatchMarkets.match_id + "_" + this.cupBetMatchMarkets.market_id]);
          }

          this._sportService.removeBackLay(cuprenners);

        }
        else {
          this._sessionService.notifier.notify('error', data.message);
          this.isShow = -1;
          for (var r = 0; r < this.cupBetMatchMarkets.runner_json.length; r++) {
            this.cupBetMatchMarkets.runner_json[r].WinAndLoss = this.cupBetMatchMarkets.runner_json[r].WinAndLoss;
          }
          this._sportService.removeBackLay(cuprenners);
        }
        this._sportService._loading = false;
      }, error => {
        this._sportService._loading = false;
      })
    }




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
  isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }


  getMatchBetAndFancyBetList() {
    if (this.matchBetsList != null) {
      clearTimeout(this.matchBetsList);
      this.matchBetsList = null;
    }
    if (this._sessionService.get('match_id') != undefined && this._sessionService.get('sport_id') != undefined) {
      this.matchBetsList = setTimeout(() => {
        if (this.route.url == '/cupbets') {
          var sdata = { 'limit': 10, 'match_id': this._sessionService.get('match_id'), 'market_id': '0', 'fancy_id': 0, 'pageno': 1 };
          this._sportService.getBetsByMatchFancyORMarketeId(sdata).subscribe(data => {
            if (!data.error) {
              this.MatchBetList = data.data;
              this.callBetFancy = 2;
              this.getMatchBetAndFancyBetList();
            }
          }, error => {
            this.callBetFancy = 2;
            this.getMatchBetAndFancyBetList();
          });
        }
      }, this.callBetFancy == 1 ? 0 : 10000);
    }
    else {
      this.route.navigate(["/dashboard"]);
    }
  }






}