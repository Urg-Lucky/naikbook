import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SessionService } from 'src/app/service/session.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { MatkaDetailService } from '../matka-detail.services';
import { SportServiceService } from 'src/app/service/sport-service.service';

@Component({
  selector: 'app-jodirange',
  templateUrl: './jodirange.component.html',
  styleUrls: ['./jodirange.component.css']
})
export class JodirangeComponent implements OnInit {

  isDialogClose: boolean = false;

  userInputData = { numberfrom: 0, numberto: 0, amount: '', numberfromError: '', numbertoError: '', amountError: '' };

  @Output() dialogClose: EventEmitter<any> = new EventEmitter<any>();

  @Input() jodiRangeNumberdata : any;

  nullUndefined = isNullOrUndefined;

  constructor(public _sessionService: SessionService, private matkaDetailService: MatkaDetailService, public route: Router, public _sportService: SportServiceService) {

  }

  ngOnInit() {}

  callDialogClose(){
    this.isDialogClose=true;
    setTimeout(() => {
      this.dialogClose.emit('CLOSE');
    }, 600);
  }

  callDialogCloseSuccess(){
    // this.isDialogClose=true;
    // setTimeout(() => {
      this.dialogClose.emit('SUCCESS');
    // }, 600);
  }

  onSubmit() {
    if (this.userInputData.numberfrom == 0 || this.userInputData.numberto == 0 || this.userInputData.amount == "") {
      if (this.userInputData.numberfrom == 0) {
        this.userInputData.numberfromError="Please enter from number";
      } else{
        this.userInputData.numberfromError="";
      }

      if (this.userInputData.numberto == 0) {
        this.userInputData.numbertoError="Please enter to number";
      } else{
        this.userInputData.numbertoError="";
      }

      if (this.userInputData.amount == "") {
        this.userInputData.amountError="Please enter amount";
      } else{
        this.userInputData.amountError="";
      }
      return;
    }
    if (this.userInputData.numberfrom > this.userInputData.numberto) {
      this.userInputData.numberfromError="Please enter valid range number";
      return;
    } else{
      this.userInputData.numberfromError="";
    }
    let tempBets = [];
    if (isNullOrUndefined(this.jodiRangeNumberdata)) {
      return;
    }
   
    if (!isNullOrUndefined(this.jodiRangeNumberdata) && !isNullOrUndefined(this.jodiRangeNumberdata.runner_json) && (this.jodiRangeNumberdata.runner_json.length > 0)) {
        if (!isNullOrUndefined(this.userInputData.amount) && this.userInputData.amount != "" && !isNullOrUndefined(this.userInputData.numberfrom) && this.userInputData.numberfrom != 0 && !isNullOrUndefined(this.userInputData.numberto) && this.userInputData.numberto != 0) {
          for (let i = this.userInputData.numberfrom; i <= this.userInputData.numberto; i++) {
            var selection = i < 10 ? '0'+i : i;
            tempBets.push({ selection_id: selection, amount: this.userInputData.amount, market_id: this.jodiRangeNumberdata.marketId });
          }
        }
    }
    this._sportService._loading = true;
    if (this.route.url == '/matka-detail') {
      var sdata = { 'match_id': this._sessionService.get('match_id'), 'bet_data': tempBets };
      this.matkaDetailService.saveTempBets(sdata).subscribe(data => {
        if (!data.error) {
          this._sportService._loading = false;
          this._sessionService.notifier.notify('success',data.message);
          
          this._sportService._serverTime = data.currentTime;
          this.callDialogCloseSuccess();
          this.userInputData.numberfrom = 0;
          this.userInputData.numberto = 0;
          this.userInputData.amount = ""
          this._sportService.callBalance = 1;
            this._sportService.getBalance();
          
        }else{
          this._sportService._loading = false;
          this._sessionService.notifier.notify('error',data.message);
        }
      }, error => {
      });
    }
    this.userInputData.numberfromError="";
    this.userInputData.numbertoError="";
    this.userInputData.amountError="";

  }
  allowedNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  

}
