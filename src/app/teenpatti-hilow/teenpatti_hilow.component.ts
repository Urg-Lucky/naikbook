import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TeenpattiHiLowService } from './teenpatti_hilow.services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { browserRefresh } from '../app.component';
import { isNullOrUndefined, isString } from 'util';

declare var $: any;
@Component({
  selector: 'app-details',
  templateUrl: './teenpatti_hilow.component.html',
  styleUrls: ['./teenpatti_hilow.component.css']
})
export class TeenpattiHiLowComponent implements OnInit, OnDestroy {


  callType: any = 1;
  safeSrc: SafeResourceUrl = null;

  countDownTimer: any;
  detailApiTimer: any;
  _serverTime: any;
  matchDetail: any = null;
  matchResult: any = null;
  userSportSettings: any = [];
  serverMatchStack: any = [];
  serverOneclickStack: any = [];
  MatchBetList: any = [];

  last_ui_timer: any = 0;

  serverMatchStackForm = new FormGroup({
    matchStack1: new FormControl(null, [Validators.required, Validators.min(1)]),
    matchStack2: new FormControl(null, [Validators.required, Validators.min(1)]),
    matchStack3: new FormControl(null, [Validators.required, Validators.min(1)]),
    matchStack4: new FormControl(null, [Validators.required, Validators.min(1)]),
    matchStack5: new FormControl(null, [Validators.required, Validators.min(1)]),

  });


  constructor(public _sessionService: SessionService,
    public _teenpattiService: TeenpattiHiLowService,
    private sanitizer: DomSanitizer,
    public _sportService: SportServiceService, public route: Router) {



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
      this.safeSrc = null;
      this.matchDetail = null;
      this.userSportSettings = [];
      this.serverMatchStack = [];
      this.serverOneclickStack = [];
      this.MatchBetList = [];


      this.callType = 1;
      this.GetMarketList();

      this._sportService.callBalance = 1;
      this._sportService.getBalance();

      this.getMatchBetAndFancyBetList();
      this.getForceLast10Result();


    });

    this.callType = 1;
    this.GetMarketList();

    this._sportService.callBalance = 1;
    this._sportService.getBalance();

    this.getMatchBetAndFancyBetList();
    this.getForceLast10Result();

    $(function () {
      $(document).on('.draggable-element').arrangeable();
      $('li').arrangeable({ dragSelector: '.drag-area' });
    });
  }




  removeTimeOut() {
    window.clearTimeout(this.detailApiTimer);
    this.detailApiTimer = null;

  }

  GetMarketList() {
    try {
      this.detailApiTimer = setTimeout(() => {
        if (this.route.url == '/hilow') {
          var sdata = { 'match_id': this._sessionService.get('match_id'), 'sport_id': this._sessionService.get('sport_id') };
          this._teenpattiService.GetMarketList(sdata).subscribe(data => {
            if (!data.error) {
              if (this.route.url != '/hilow') {
                return;
              }
              var result = data.data;
              this._serverTime = data.currentTime;
              this.userSportSettings = result.UserSportSettings[0];
              this.serverMatchStack = this.userSportSettings.match_stack.split(',');
              this.serverOneclickStack = this.userSportSettings.one_click_stack.split(',');
              if (result.MatchDetails != null) {
                var matchDetailData = result.MatchDetails;
                if (!isNullOrUndefined(matchDetailData.match_id)) {
                  if (this.callType == 1) {
                    this.closeBetBox();
                    matchDetailData.timer_previous = matchDetailData.timer + 1;
                    this.matchDetail = matchDetailData;
                    this._sessionService.set('match_id', this.matchDetail.match_id);
                    this.getMatchBetAndFancyBetList();
                    this.getForceLast10Result();
                    if (this.safeSrc == null) {
                      if (matchDetailData.MainTV != '') {
                        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(matchDetailData.MainTV);
                      }
                    }


                  } else {
                    if (this.matchDetail == undefined) {
                      this.closeBetBox();
                      matchDetailData.timer_previous = matchDetailData.timer + 1;
                      this.matchDetail = matchDetailData;
                      this._sessionService.set('match_id', this.matchDetail.match_id);
                      this.getMatchBetAndFancyBetList();
                      this.getForceLast10Result();
                      if (this.safeSrc == null) {
                        if (matchDetailData.MainTV != '') {
                          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(matchDetailData.MainTV);
                        }
                      }

                    } else if (this.matchDetail.market_id != matchDetailData.market_id) {
                      this.closeBetBox();
                      matchDetailData.timer_previous = matchDetailData.timer + 1;
                      this.matchDetail = matchDetailData;
                      this._sessionService.set('match_id', this.matchDetail.match_id);
                      this.getMatchBetAndFancyBetList();
                      this.getForceLast10Result();
                      if (this.safeSrc == null) {
                        if (matchDetailData.MainTV != '') {
                          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(matchDetailData.MainTV);
                        }
                      }
                    } else {
                      this.updateOldMatchDetailData(matchDetailData);
                      if (this.safeSrc == null) {
                        if (matchDetailData.MainTV != '') {
                          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(matchDetailData.MainTV);
                        }
                      }
                    }
                  }
                  this.matchResult=result.MatchResult;
                }
              } else {
                //this.matchDetail = null;
              }

              this.callType = 2;
              this.removeTimeOut();
              this.GetMarketList();
            }
          }, error => {
            this.callType = 2;
            this.removeTimeOut();
            this.GetMarketList();
          });
        }
      }, this.callType == 1 ? 0 : 1000);
    }
    catch (e) {
      this.callType = 1;
      this.GetMarketList();
    }

  }

  checkDataChange(oldData, newData) {
    if (oldData != null && newData == null) {
      return true;
    }
    if (oldData == null && newData != null) {
      return true;
    }
    if (oldData != newData) {
      return true;
    }

    return false;
  }

  updateOldMatchDetailData(matchDetailData) {
    try {
      if (matchDetailData != null) {
        if (this.checkDataChange(this.matchDetail.BetAllowTimeBefore, matchDetailData.BetAllowTimeBefore)) {
          this.matchDetail.BetAllowTimeBefore = matchDetailData.BetAllowTimeBefore;
        }

        if (this.convertToInteger(this.last_ui_timer) < this.convertToInteger(matchDetailData.timer)) {
          this.restartCountDownTimer(this.convertToInteger(matchDetailData.timer));
        }

        if (this.checkDataChange(this.matchDetail.SportName, matchDetailData.SportName)) {
          this.matchDetail.SportName = matchDetailData.SportName;
        }
        if (this.checkDataChange(this.matchDetail.favMatchID, matchDetailData.favMatchID)) {
          this.matchDetail.favMatchID = matchDetailData.favMatchID;
        }
        if (this.checkDataChange(this.matchDetail.adminMessage, matchDetailData.adminMessage)) {
          this.matchDetail.adminMessage = matchDetailData.adminMessage;
        }
        if (this.checkDataChange(this.matchDetail.marketMinStack, matchDetailData.marketMinStack)) {
          this.matchDetail.marketMinStack = matchDetailData.marketMinStack;
        }
        if (this.checkDataChange(this.matchDetail.marketMaxStack, matchDetailData.marketMaxStack)) {
          this.matchDetail.marketMaxStack = matchDetailData.marketMaxStack;
        }
        if (this.checkDataChange(this.matchDetail.marketMaxProfit, matchDetailData.marketMaxProfit)) {
          this.matchDetail.marketMaxProfit = matchDetailData.marketMaxProfit;
        }
        if (this.checkDataChange(this.matchDetail.marketMaxLoss, matchDetailData.marketMaxLoss)) {
          this.matchDetail.marketMaxLoss = matchDetailData.marketMaxLoss;
        }
        if (this.checkDataChange(this.matchDetail.marketMaxExposure, matchDetailData.marketMaxExposure)) {
          this.matchDetail.marketMaxExposure = matchDetailData.marketMaxExposure;
        }
        if (this.checkDataChange(this.matchDetail.marketMinExposure, matchDetailData.marketMinExposure)) {
          this.matchDetail.marketMinExposure = matchDetailData.marketMinExposure;
        }
        if (this.checkDataChange(this.matchDetail.InplayStatus, matchDetailData.InplayStatus)) {
          this.matchDetail.InplayStatus = matchDetailData.InplayStatus;
        }
        if (this.checkDataChange(this.matchDetail.IsBetAllow, matchDetailData.IsBetAllow)) {
          this.matchDetail.IsBetAllow = matchDetailData.IsBetAllow;
        }
        if (this.checkDataChange(this.matchDetail.SportminOddsLimt, matchDetailData.SportminOddsLimt)) {
          this.matchDetail.SportminOddsLimt = matchDetailData.SportminOddsLimt;
        }
        if (this.checkDataChange(this.matchDetail.SportmaxOddsLimt, matchDetailData.SportmaxOddsLimt)) {
          this.matchDetail.SportmaxOddsLimt = matchDetailData.SportmaxOddsLimt;
        }
        if (this.checkDataChange(this.matchDetail.sportScore, matchDetailData.sportScore)) {
          this.matchDetail.sportScore = matchDetailData.sportScore;
        }
        if (this.checkDataChange(this.matchDetail.sportGraphic, matchDetailData.sportGraphic)) {
          this.matchDetail.sportGraphic = matchDetailData.sportGraphic;
        }
        if (this.checkDataChange(this.matchDetail.sportShowLastResult, matchDetailData.sportShowLastResult)) {
          this.matchDetail.sportShowLastResult = matchDetailData.sportShowLastResult;
        }
        if (this.checkDataChange(this.matchDetail.sportShowTV, matchDetailData.sportShowTV)) {
          this.matchDetail.sportShowTV = matchDetailData.sportShowTV;
        }
        if (this.checkDataChange(this.matchDetail.backRateDiff, matchDetailData.backRateDiff)) {
          this.matchDetail.backRateDiff = matchDetailData.backRateDiff;
        }
        if (this.checkDataChange(this.matchDetail.layRateDiff, matchDetailData.layRateDiff)) {
          this.matchDetail.layRateDiff = matchDetailData.layRateDiff;
        }
        if (this.checkDataChange(this.matchDetail.series_id, matchDetailData.series_id)) {
          this.matchDetail.series_id = matchDetailData.series_id;
        }
        if (this.checkDataChange(this.matchDetail.match_id, matchDetailData.match_id)) {
          this.matchDetail.match_id = matchDetailData.match_id;
        }
        if (this.checkDataChange(this.matchDetail.name, matchDetailData.name)) {
          this.matchDetail.name = matchDetailData.name;
        }
        if (this.checkDataChange(this.matchDetail.start_date, matchDetailData.start_date)) {
          this.matchDetail.start_date = matchDetailData.start_date;
        }
        if (this.checkDataChange(this.matchDetail.matchVolumn, matchDetailData.matchVolumn)) {
          this.matchDetail.matchVolumn = matchDetailData.matchVolumn;
        }
        if (this.checkDataChange(this.matchDetail.marketCount, matchDetailData.marketCount)) {
          this.matchDetail.marketCount = matchDetailData.marketCount;
        }
        if (this.checkDataChange(this.matchDetail.marketName, matchDetailData.marketName)) {
          this.matchDetail.marketName = matchDetailData.marketName;
        }
        if (this.checkDataChange(this.matchDetail.displayName, matchDetailData.displayName)) {
          this.matchDetail.displayName = matchDetailData.displayName;
        }
        if (this.checkDataChange(this.matchDetail.sport_id, matchDetailData.sport_id)) {
          this.matchDetail.sport_id = matchDetailData.sport_id;
        }
        if (this.checkDataChange(this.matchDetail.market_id, matchDetailData.market_id)) {
          this.matchDetail.market_id = matchDetailData.market_id;
        }

        if (this.matchDetail.indexCard.toString() != matchDetailData.indexCard.toString()) {
          this.matchDetail.indexCard = matchDetailData.indexCard;
        }

        if (this.matchDetail.indexCard.length < 5) {
          var extraCardNeed = 5 - this.matchDetail.indexCard.length;
          for (let index = 0; index < extraCardNeed; index++) {
            this.matchDetail.indexCard.push('0');
          }
        }


        var btBefor = this.matchDetail.BetAllowTimeBefore;
        if ((this.matchDetail.start_date - btBefor) > this._serverTime) {
          this.matchDetail.isDetail = false;
          var timeStamp = this._sportService.timeDifference((this.matchDetail.start_date - btBefor) * 1000, this._serverTime * 1000);

          this.matchDetail.remainTime = timeStamp;
        }
        else {
          this.matchDetail.isDetail = true;
          this.matchDetail.remainTime = "Inplay"
        }


        this.updateOldMatchDetailRunnerJson(this.matchDetail.runner_json, matchDetailData.runner_json);
        this.getPlayerAdata();
        this.getPlayerBdata();
        this.getPlayerCdata();
        this.updateBetBox();
      }
    }
    catch (e) {

    }
  }

  closeCountDownTimer() {
    if (this.countDownTimer != null) {
      window.clearTimeout(this.countDownTimer);
      this.countDownTimer = null;
    }

  }

  startCountDownTimer() {
    this.closeCountDownTimer();
    this.countDownTimer = setTimeout(() => {

      if (this.last_ui_timer > 0) {
        this.updateCountDownTimerData(this.last_ui_timer - 1);
        this.startCountDownTimer();
      }

    }, 1000);
  }

  restartCountDownTimer(currentTimerupdate) {

    this.last_ui_timer = 0;
    this.closeCountDownTimer();
    this.updateCountDownTimerData(currentTimerupdate);
    this.startCountDownTimer();
  }

  timer_pos_0 = true;
  timer_pos_1 = true;
  updateCountDownTimerData(currentTimerupdate) {
    if (currentTimerupdate < 0) {
      return;
    }
    var previousTime = this.last_ui_timer.toString();
    var currentTimer = currentTimerupdate.toString();
    if (this.last_ui_timer != currentTimer) {

      var last_ui_timer_0 = ((previousTime.length > 1) ? ((previousTime).charAt(0)) : '0');
      var last_ui_timer_1 = ((previousTime.length > 1) ? ((previousTime).charAt(1)) : (previousTime).charAt(0));

      var currentTimer_0 = (currentTimer.length > 1 ? ((currentTimer).charAt(0)) : '0');
      var currentTimer_1 = (currentTimer.length > 1 ? ((currentTimer).charAt(1)) : (currentTimer).charAt(0));

      var change_0 = false;
      var change_1 = false;



      if (last_ui_timer_0 != currentTimer_0) {
        this.timer_pos_0 = false;
        change_0 = true;
      }

      if (last_ui_timer_1 != currentTimer_1) {
        this.timer_pos_1 = false;
        change_1 = true;
      }

      this.last_ui_timer = currentTimerupdate;

      setTimeout(() => {
        if (change_0) {
          this.timer_pos_0 = true;
        }

        if (change_1) {
          this.timer_pos_1 = true;
        }

        if (this.checkDataChange(this.matchDetail.timer, currentTimerupdate)) {
          this.matchDetail.timer = currentTimerupdate;
          this.matchDetail.timer_previous = currentTimerupdate + 1;
        }
      }, 50);

    }

  }

  updateOldMatchDetailRunnerJson(oldrunnerJson, newrunnerJson) {
    if (!isNullOrUndefined(oldrunnerJson) && !isNullOrUndefined(newrunnerJson)) {

      for (let i = 0; i < newrunnerJson.length; i++) {
        var indx = oldrunnerJson.findIndex(x => x.id == newrunnerJson[i].id);
        if (indx > -1) {
          var oldSelection = oldrunnerJson[indx];
          var newSelection = newrunnerJson[i];
          if (this.checkDataChange(oldSelection.name, newSelection.name)) {
            oldSelection.name = newSelection.name;
          }
          if (this.checkDataChange(oldSelection.pl, newSelection.pl)) {
            oldSelection.pl = newSelection.pl;
          }
          if (this.checkDataChange(oldSelection.type, newSelection.type)) {
            oldSelection.type = newSelection.type;
          }
          if (this.checkDataChange(oldSelection.status, newSelection.status)) {
            oldSelection.status = newSelection.status;
          }
          if (this.checkDataChange(oldSelection.superStatus, newSelection.superStatus)) {
            oldSelection.superStatus = newSelection.superStatus;
          }
          if (oldSelection.cards.toString() != newSelection.cards.toString()) {
            oldSelection.cards = newSelection.cards;
          }

          if (isNullOrUndefined(newSelection.WinAndLoss)) {
            oldSelection.WinAndLoss = 0;
          } else {
            if (this.checkDataChange(oldSelection.WinAndLoss, newSelection.WinAndLoss)) {
              oldSelection.WinAndLoss = newSelection.WinAndLoss;
            }
          }
          var backupdate = false;
          var layupdate = false;
          if (oldSelection.back.length != newSelection.back.length) {
            oldSelection.back = newSelection.back;
            backupdate = true;
          }
          if (oldSelection.lay.length != newSelection.lay.length) {
            oldSelection.lay = newSelection.lay;
            layupdate = true;
          }

          if (!backupdate) {
            if (oldSelection.back.length > 0 && newSelection.back.length > 0) {
              if (this.checkDataChange(oldSelection.back[0].price, newSelection.back[0].price)) {
                oldSelection.back[0].price = newSelection.back[0].price;
              }
              if (this.checkDataChange(oldSelection.back[0].size, newSelection.back[0].size)) {
                oldSelection.back[0].size = newSelection.back[0].size;
              }
              backupdate = true;
            } else if (oldSelection.back.length == 0 && newSelection.back.length > 0) {
              oldSelection.back = newSelection.back;
              backupdate = true;
            } else if (oldSelection.back.length > 0 && newSelection.back.length == 0) {
              oldSelection.back = newSelection.back;
              backupdate = true;
            }
          }

          if (!layupdate) {
            if (oldSelection.lay.length > 0 && newSelection.lay.length > 0) {
              if (this.checkDataChange(oldSelection.lay[0].price, newSelection.lay[0].price)) {
                oldSelection.lay[0].price = newSelection.lay[0].price;
              }
              if (this.checkDataChange(oldSelection.lay[0].size, newSelection.lay[0].size)) {
                oldSelection.lay[0].size = newSelection.lay[0].size;
              }
              layupdate = true;
            } else if (oldSelection.lay.length == 0 && newSelection.lay.length > 0) {
              oldSelection.lay = newSelection.lay;
              layupdate = true;
            } else if (oldSelection.lay.length > 0 && newSelection.lay.length == 0) {
              oldSelection.lay = newSelection.lay;
              layupdate = true;
            }
          }
        }
      }
    }

  }

  playerAData: any = null;
  getPlayerAdata() {
    if (this.matchDetail != null && this.matchDetail.runner_json.length > 0) {
      var playerA = this.matchDetail.runner_json[0];

      var backData = playerA.back;
      if (backData.length < 3) {
        var extraNeed = 3 - backData.length;
        for (let index = 0; index < extraNeed; index++) {
          var emptyData = [];
          emptyData['price'] = "--";
          emptyData['size'] = "--";
          playerA.back.push(emptyData);
        }
      }

      var layData = playerA.lay;
      if (layData.length < 3) {
        var extraNeed = 3 - layData.length;
        for (let index = 0; index < extraNeed; index++) {
          var emptyData = [];
          emptyData['price'] = "--";
          emptyData['size'] = "--";
          playerA.lay.push(emptyData);
        }
      }
      this.playerAData = playerA;
      return;
    }
    this.playerAData = null;
  }

  playerBData: any = null;
  getPlayerBdata() {
    if (this.matchDetail != null && this.matchDetail.runner_json.length > 1) {
      var playerB = this.matchDetail.runner_json[1];


      var backData = playerB.back;
      if (backData.length < 3) {
        var extraNeed = 3 - backData.length;
        for (let index = 0; index < extraNeed; index++) {
          var emptyData = [];
          emptyData['price'] = "--";
          emptyData['size'] = "--";
          playerB.back.push(emptyData);
        }
      }

      var layData = playerB.lay;
      if (layData.length < 3) {
        var extraNeed = 3 - layData.length;
        for (let index = 0; index < extraNeed; index++) {
          var emptyData = [];
          emptyData['price'] = "--";
          emptyData['size'] = "--";
          playerB.lay.push(emptyData);
        }
      }

      this.playerBData = playerB;
      return;
    }
    this.playerBData = null;
  }

  playerCData: any = null;
  getPlayerCdata() {
    if (this.matchDetail != null && this.matchDetail.runner_json.length > 2) {
      var playerA = this.matchDetail.runner_json[2];


      var backData = playerA.back;
      if (backData.length < 3) {
        var extraNeed = 3 - backData.length;
        for (let index = 0; index < extraNeed; index++) {
          var emptyData = [];
          emptyData['price'] = "--";
          emptyData['size'] = "--";
          playerA.back.push(emptyData);
        }
      }

      var layData = playerA.lay;
      if (layData.length < 3) {
        var extraNeed = 3 - layData.length;
        for (let index = 0; index < extraNeed; index++) {
          var emptyData = [];
          emptyData['price'] = "--";
          emptyData['size'] = "--";
          playerA.lay.push(emptyData);
        }
      }
      this.playerCData = playerA;
      return;
    }
    this.playerCData = null;
  }


  updateStackValue(stack) {
    if (this.betBoxPlayerData == null) {
      return;
    }
    this.betBoxPlayerData.stack = parseFloat(stack) + parseFloat(this.betBoxPlayerData.stack == null ? 0 : this.betBoxPlayerData.stack);

  }
  updateOddsValue(type) {
    if (this.betBoxPlayerData == null) {
      return;
    }
    if (type == "min") {
      if (this.betBoxPlayerData.odds > 0) {
        this.betBoxPlayerData.odds = (parseFloat(this.betBoxPlayerData.odds) - 0.01).toFixed(2);
      }
    }
    else if (type == "max") {
      this.betBoxPlayerData.odds = (parseFloat(this.betBoxPlayerData.odds) + 0.01).toFixed(2);
    }
  }

  updatePL() {
    if (this.betBoxPlayerData == null) {
      return;
    }
    if (parseFloat(this.betBoxPlayerData.odds) >= 0) {
      this.betBoxPlayerData.p_l = ((parseFloat(this.betBoxPlayerData.odds) * this.betBoxPlayerData.stack) - this.betBoxPlayerData.stack);
    }
  }

  getCurrentBetboxPL() {
    if (this.betBoxPlayerData == null) {
      return 0;
    }
    if (parseFloat(this.betBoxPlayerData.odds) >= 0) {
      return ((parseFloat(this.betBoxPlayerData.odds) * this.betBoxPlayerData.stack) - this.betBoxPlayerData.stack);
    }

    return 0;
  }

  getSelectionPL(playerData) {
    if (isNullOrUndefined(playerData)) {
      return 0;
    }
    if (this.betBoxPlayerData == null || this.betBoxPlayerData.type != playerData.type) {
      if (isNullOrUndefined(playerData.WinAndLoss)) {
        return 0;
      }
      return playerData.WinAndLoss;
    }

    if (isNullOrUndefined(playerData.WinAndLoss)) {
      playerData.WinAndLoss = 0;
    }

    if (playerData.id == this.betBoxPlayerData.id) {
      if (this.betBoxType == 1) {
        return playerData.WinAndLoss + this.getCurrentBetboxPL();
      } else {
        return playerData.WinAndLoss - this.getCurrentBetboxPL();
      }
    } else {
      if (this.betBoxType == 1) {
        return playerData.WinAndLoss - this.betBoxPlayerData.stack;
      } else {
        return playerData.WinAndLoss + this.betBoxPlayerData.stack;
      }
    }

  }

  betBoxType = 1;
  betBoxPlayerData = null;
  isEditStack = false;
  setBetBox(betBoxType, playerData) {
    if (this.matchDetail == null) {
      return;
    }
    var odds = "0";
    if (betBoxType == 1) {
      odds = playerData.back[0].price;
    } else {
      odds = playerData.lay[0].price;
    }

    if (odds == '--') {
      return;
    }

    this.isEditStack = false;
    this.betBoxType = betBoxType;
    this.betBoxPlayerData = playerData;
    this.betBoxPlayerData.stack = 0;
    this.betBoxPlayerData.odds = odds;
  }

  updateBetBox() {
    if (this.matchDetail == null || this.betBoxPlayerData == null) {
      return;
    }

    var playerData = null;

    if (playerData == null && this.playerAData != null) {
      if (this.betBoxPlayerData.id == this.playerAData.id) {
        playerData = this.playerAData;
      }
    }
    if (playerData == null && this.playerBData != null) {
      if (this.betBoxPlayerData.id == this.playerBData.id) {
        playerData = this.playerBData;
      }
    }

    if (playerData == null && this.playerCData != null) {
      if (this.betBoxPlayerData.id == this.playerCData.id) {
        playerData = this.playerCData;
      }
    }

    if (playerData != null) {
      if (playerData.superStatus != 'OPEN') {
        this.closeBetBox();
      } else {
        var odds = '';
        if (this.betBoxType == 1) {
          odds = playerData.back[0].price;
        } else {
          odds = playerData.lay[0].price;
        }

        if (odds == '--') {
          this.closeBetBox();
        }
      }
    }
  }

  closeBetBox() {
    this.betBoxPlayerData = null;
  }


  checkDuplicate(stackData) {
    var arrStack = stackData.split(',');
    var arr = [];
    for (let i = 0; i < arrStack.length; i++) {
      arr.push(parseInt(arrStack[i]));
    }
    var sorted_arr = arr.sort();
    for (var i = 0; i < arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        return true;
      }
    }
    return false;
  }

  updateServerMatchStack() {

    if (!this.serverMatchStackForm.invalid) {
      this._sportService._loading = true;
      var stackDetail = this.serverMatchStackForm.value;
      var matchStack = stackDetail.matchStack1 + "," + stackDetail.matchStack2 + "," + stackDetail.matchStack3 + "," + stackDetail.matchStack4 + "," + stackDetail.matchStack5;
      var isduplicate = this.checkDuplicate(matchStack);
      if (isduplicate) {
        this._sessionService.notifier.notify('error', 'Duplicate value is not allow.');
        this._sportService._loading = false;
      }
      else {
        let tdata = { 'one_click_stack': "0", 'match_stack': matchStack, 'sport_id': this._sessionService.get('sport_id') };
        this._sportService.updateOneClickStack(tdata).subscribe(data => {
          if (!data.error) {
            this._sessionService.notifier.notify('success', 'Successfully Updated');
            this.isEditStack = false;
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


  saveSportBetData() {

    if (this.betBoxPlayerData == null) {
      return;
    }

    if (this.betBoxPlayerData.odds <= 0) {
      this._sessionService.notifier.notify('error', 'Odds must be grater than 0');
    }
    else if (this.betBoxPlayerData.stack <= 0) {
      this._sessionService.notifier.notify('error', 'Stack must be grater than 0');
    }
    else {
      this._sportService._loading = true;
      var sdata =
      {
        "match_id": this.matchDetail.match_id,
        "market_id": this.matchDetail.market_id,
        "selection_id": this.betBoxPlayerData.id,
        "odds": this.betBoxPlayerData.odds.toString(),
        "stack": parseInt(this.betBoxPlayerData.stack),
        "is_back": this.betBoxType.toString()
      }

      this._sportService.saveCasinoBetData(sdata).subscribe(data => {

        if (!data.error) {
          this._sessionService.notifier.notify('success', data.message);
          this._sportService.callBalance = 1;
          this._sportService.getBalance();

          this.playerAData.WinAndLoss = this.getSelectionPL(this.playerAData);
          this.playerBData.WinAndLoss = this.getSelectionPL(this.playerBData);
          if (!isNullOrUndefined(this.playerCData)) {
            this.playerCData.WinAndLoss = this.getSelectionPL(this.playerCData);
          }


          this.closeBetBox();
          this.getMatchBetAndFancyBetList();

        }
        else {
          this._sessionService.notifier.notify('error', data.message);
          this.closeBetBox();
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


  getMatchBetAndFancyBetList() {
    if (this.matchDetail != null) {

      if (this.route.url == '/hilow') {
        var sdata = { 'limit': 10, 'match_id': this.matchDetail.match_id, 'market_id': this.matchDetail.market_id, 'pageno': 1 };
        this._sportService.getCasinoBetsByMatchFancyORMarketeId(sdata).subscribe(data => {
          if (!data.error) {
            this.MatchBetList = data.data;
          }
        }, error => {

        });
      }
    }

  }


  convertToInteger(value) {
    try {
      return parseInt(value);
    } catch{
      return 0;
    }
  }

  marketLast10Result = [];
  marketLast10Timer = null;
  callTypeLast10 = 1;
  getForceLast10Result() {
    this.removeLast10TimeOut();
    this.getMarketLast10Result();
  }
  removeLast10TimeOut() {
    if (this.marketLast10Timer != null) {
      window.clearTimeout(this.marketLast10Timer);
      this.marketLast10Timer = null;
    }
  }
  getMarketLast10Result() {
    try {
      this.marketLast10Timer = setTimeout(() => {
        if (this.route.url == '/hilow') {
          var sdata = { 'sport_id': this._sessionService.get('sport_id') };
          this._sportService.getCasionLastResult(sdata).subscribe(data => {
            if (!data.error) {
              if (this.route.url != '/hilow') {
                return;
              }
              var result = data.data;
              if (!isNullOrUndefined(result)) {
                this.marketLast10Result = result;
              }


              this.callTypeLast10 = 2;
              this.removeLast10TimeOut();
              this.getMarketLast10Result();
            }
          }, error => {
            this.callTypeLast10 = 2;
            this.removeLast10TimeOut();
            this.getMarketLast10Result();
          });
        }
      }, this.callTypeLast10 == 1 ? 0 : 5000);
    }
    catch (e) {
      this.callTypeLast10 = 1;
      this.getMarketLast10Result();
    }
  }

  selectedResult = null;
  openMatchResult(result) {
    if(this.selectedResult==null){
      this.selectedResult = result;
    }else{
      if(this.selectedResult.match_id==result.match_id){
        this.selectedResult=null;
      }else{
        this.selectedResult=result;
      }
    }

    if(this.selectedResult!=null){
      this.selectedResult.WinnerName="";
      if(this.selectedResult.runners.length>0){
        this.selectedResult.playerA=this.selectedResult.runners[0];
        if(this.selectedResult.playerA.win==1){
          this.selectedResult.WinnerName=this.selectedResult.playerA.name
        }
      }else{
        this.selectedResult.playerA=null;
      }
      
      if(this.selectedResult.runners.length>1){
        this.selectedResult.playerB=this.selectedResult.runners[1];
        if(this.selectedResult.playerB.win==1){
          this.selectedResult.WinnerName=this.selectedResult.playerB.name
        }
      }else{
        this.selectedResult.playerB=null;
      }

      if(this.selectedResult.runners.length>2){
        this.selectedResult.playerC=this.selectedResult.runners[2];
        if(this.selectedResult.playerC.win==1){
          this.selectedResult.WinnerName=this.selectedResult.playerC.name
        }
      }else{
        this.selectedResult.playerC=null;
      }
    }
  }

  closeMatchResult(){
    this.selectedResult=null;
  }

  reloadtv(){
    this.safeSrc=null;
  }

}
