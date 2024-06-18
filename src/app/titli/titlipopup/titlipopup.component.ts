import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SessionService } from 'src/app/service/session.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { TitliDetailService } from '../titli-detail.services';
import { SportServiceService } from 'src/app/service/sport-service.service';

@Component({
  selector: 'app-titlipopup',
  templateUrl: './titlipopup.component.html',
  styleUrls: ['./titlipopup.component.css']
})
export class TitlipopupComponent implements OnInit {

  isDialogClose: boolean = false;

  userInputData = { amount: 0, amountError: '' };
  
  @Output() dialogClose: EventEmitter<any> = new EventEmitter<any>();

  @Input() titliPopupNumberdata : any;

  @Input() selectionData : any;

  @Output() betsData : any;

  titliStack = {};

  nullUndefined = isNullOrUndefined;

  constructor(private _sessionService: SessionService, private titliDetailService: TitliDetailService, public route: Router, public _sportService: SportServiceService) {

  }

  ngOnInit() {
    
    this.titliStack = this.selectionData.stack.split(",");
    //console.log(this.titliPopupNumberdata.market_id);
  }

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
      if (this.userInputData.amount == 0) {
          this.userInputData.amountError="Please enter amount";
          return;
      } else{
        this.userInputData.amountError="";
      }
    
    let titliBets = [];
    if (isNullOrUndefined(this.titliPopupNumberdata)) {
      return;
    }
    
    if (!isNullOrUndefined(this.titliPopupNumberdata)) {
        if (!isNullOrUndefined(this.userInputData.amount) && this.userInputData.amount != 0) {
          titliBets.push({ selection_id: this.selectionData.selectionId, amount: this.userInputData.amount, market_id: this.titliPopupNumberdata.market_id });
          
        }
    }
    this._sportService._loading = true;
    if (this.route.url == '/titli-detail') {
      var sdata = { 'match_id': this.titliPopupNumberdata.match_id, 'bet_data': titliBets };
      this.titliDetailService.saveTitliBets(sdata).subscribe(data => {
        if (!data.error) {
          this._sportService._loading = false;
          this._sessionService.notifier.notify('success',data.message);
          
          this._sportService._serverTime = data.currentTime;
          this._sportService.callBalance = 1;
          this._sportService.getBalance();
          this.callDialogCloseSuccess();
          this.userInputData.amount = 0
          
          
        }else{
          this._sportService._loading = false;
          this._sessionService.notifier.notify('error',data.message);
        }
      }, error => {
      });
    }
    this.userInputData.amountError="";

  }
  allowedNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  storeTitliValue(betAmount){
    let preValue = this.userInputData.amount;
    if(preValue == 0){
      this.userInputData.amount = betAmount;
    }else{
      this.userInputData.amount = (parseInt(betAmount) + preValue);
    }
    
  }


}
