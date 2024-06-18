import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SessionService } from 'src/app/service/session.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { MatkaDetailService } from '../matka-detail.services';
import { SportServiceService } from 'src/app/service/sport-service.service';

@Component({
  selector: 'app-jodinumber',
  templateUrl: './jodinumber.component.html',
  styleUrls: ['./jodinumber.component.css']
})
export class JodinumberComponent implements OnInit {

  isDialogClose: boolean = false;

  userInputData = { number: 0, amount: '', numberError: '', amountError: '' };

  @Output() dialogClose: EventEmitter<any> = new EventEmitter<any>();

  @Input() jodiNumberdata: any;

  nullUndefined = isNullOrUndefined;

  constructor(public _sessionService: SessionService, private matkaDetailService: MatkaDetailService, public route: Router, public _sportService: SportServiceService) {

  }

  ngOnInit() {

  }

  callDialogClose() {
    this.isDialogClose = true;
    setTimeout(() => {
      this.dialogClose.emit('CLOSE');
    }, 600);
  }

  callDialogCloseSuccess() {
    // this.isDialogClose=true;
    // setTimeout(() => {
    this.dialogClose.emit('SUCCESS');
    // }, 600);
  }
  onSubmit() {
    if (this.userInputData.number == 0 || this.userInputData.amount == "") {
      if (this.userInputData.number == 0) {
        this.userInputData.numberError = "Please enter number";
      } else {
        this.userInputData.numberError = "";
      }

      if (this.userInputData.amount == "") {
        this.userInputData.amountError = "Please enter amount";
      } else {
        this.userInputData.amountError = "";
      }
      return;
    }
    let tempBets = [];
    if (isNullOrUndefined(this.jodiNumberdata)) {
      return;
    }

    if (!isNullOrUndefined(this.jodiNumberdata) && !isNullOrUndefined(this.jodiNumberdata.runner_json) && (this.jodiNumberdata.runner_json.length > 0)) {
      if (!isNullOrUndefined(this.userInputData.amount) && this.userInputData.amount != "" && !isNullOrUndefined(this.userInputData.number) && this.userInputData.number != 0) {
        var selection = this.userInputData.number < 10 ? '0' + this.userInputData.number : this.userInputData.number;
        tempBets.push({ selection_id: selection, amount: this.userInputData.amount, market_id: this.jodiNumberdata.marketId });
      }
    }
    this._sportService._loading = true;
    if (this.route.url == '/matka-detail') {
      var sdata = { 'match_id': this._sessionService.get('match_id'), 'bet_data': tempBets };
      this.matkaDetailService.saveTempBets(sdata).subscribe(data => {
        if (!data.error) {
          this._sportService._loading = false;
          this._sessionService.notifier.notify('success', data.message);
          this._sportService._serverTime = data.currentTime;
          this.callDialogCloseSuccess();
          this.userInputData.number = 0;
          this.userInputData.amount = "";
          this._sportService.callBalance = 1;
          this._sportService.getBalance();
        } else {
          this._sportService._loading = false;
          this._sessionService.notifier.notify('error', data.message);
        }
      }, error => {
      });
    }
    this.userInputData.numberError = "";
    this.userInputData.amountError = "";

  }

  allowedNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
