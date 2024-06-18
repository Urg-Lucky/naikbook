import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SessionService } from 'src/app/service/session.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { MatkaDetailService } from '../matka-detail.services';
import { SportServiceService } from 'src/app/service/sport-service.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-jodicrossing',
  templateUrl: './jodicrossing.component.html',
  styleUrls: ['./jodicrossing.component.css']
})
export class JodicrossingComponent implements OnInit {

  form: FormGroup;

  isDialogClose: boolean = false;

  crossingLayer1=[{name:'1', key : 'crossing1', selected : false},{name:'2', key : 'crossing1', selected : false},{name:'3', key : 'crossing1', selected : false},{name:'4', key : 'crossing1', selected : false},{name:'5', key : 'crossing1', selected : false},{name:'6', key : 'crossing1', selected : false},{name:'7', key : 'crossing1', selected : false},{name:'8', key : 'crossing1', selected : false},{name:'9', key : 'crossing1', selected : false},{name:'0', key : 'crossing1', selected : false}]

  crossingLayer2=[{name:'1', key : 'crossing2', selected : false},{name:'2', key : 'crossing2', selected : false},{name:'3', key : 'crossing2', selected : false},{name:'4', key : 'crossing2', selected : false},{name:'5', key : 'crossing2', selected : false},{name:'6', key : 'crossing2', selected : false},{name:'7', key : 'crossing2', selected : false},{name:'8', key : 'crossing2', selected : false},{name:'9', key : 'crossing2', selected : false},{name:'0', key : 'crossing2', selected : false}]

  userInputData = { number: '', amount: 0, jodicut: false, numberError: '', amountError: '' };

  @Output() dialogClose: EventEmitter<any> = new EventEmitter<any>();

  @Input() jodiCrossNumberdata :any;

  nullUndefined = isNullOrUndefined;

  constructor(private _sessionService: SessionService, private matkaDetailService: MatkaDetailService, public route: Router, public _sportService: SportServiceService,private fb: FormBuilder) {
    this.form = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    })
  }

  ngOnInit() {}

  callDialogClose(){
    this.isDialogClose=true;
    setTimeout(() => {
      this.dialogClose.emit('CLOSE');
    }, 600);
  }

  callDialogCloseSuccess(){
    this.isDialogClose=true;
    setTimeout(() => {
      this.dialogClose.emit('SUCCESS');
    }, 600);
  }
  
  allowedNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  
  onSubmit() {
    let tempBets = [];
    
    let crossingTempBets1 = [];
    let crossingTempBets2 = [];

    if (isNullOrUndefined(this.jodiCrossNumberdata)) {
      return;
    }
    let jodiCut = this.userInputData.jodicut;
    
    let amount = this.userInputData.amount;
    
   
    this.crossingLayer1.forEach(element => {
      if(!isNullOrUndefined(element.selected) && element.selected != false){
        crossingTempBets1.push({selection_id: element.name, amount: amount, market_id: this.jodiCrossNumberdata.marketId });
      }
    });
  
    this.crossingLayer2.forEach(element => {
      if(!isNullOrUndefined(element.selected) && element.selected != false){
        crossingTempBets2.push({selection_id: element.name, amount: amount, market_id: this.jodiCrossNumberdata.marketId });
      }
    });

    if(isNullOrUndefined(crossingTempBets1) || crossingTempBets1.length == 0){
      this.userInputData.numberError="Please select number";
      return;
    } else{
      this.userInputData.numberError="";
    }

    if(isNullOrUndefined(crossingTempBets2) || crossingTempBets2.length == 0){
      this.userInputData.numberError="Please select cross number";
      return;
    } else{
      this.userInputData.numberError="";
    }
    if(isNullOrUndefined(amount) || amount == 0){
      this.userInputData.amountError="Please enter amount";
      return;
    } else{
      this.userInputData.amountError="";
    }
    let crossData = [];
    crossingTempBets1.forEach(cData => {
      crossingTempBets2.forEach(cData2 => {
          if(jodiCut != false){
            if(cData.selection_id != cData2.selection_id){
              crossData.push({selection_id: cData.selection_id+''+cData2.selection_id, amount: cData.amount, market_id: cData.market_id});
            }
          }else{
            crossData.push({selection_id: cData.selection_id+''+cData2.selection_id, amount: cData.amount, market_id: cData.market_id});
          }
            
          
      });  
     
    });
    
    //console.log(crossData);

    this._sportService._loading = true;
    if (this.route.url == '/matka-detail') {
      var sdata = { 'match_id': this._sessionService.get('match_id'), 'bet_data': crossData };
      this.matkaDetailService.saveTempBets(sdata).subscribe(data => {
        if (!data.error) {
          this._sportService._loading = false;
          this._sessionService.notifier.notify('success',data.message);
          this._sportService._serverTime = data.currentTime;
          this.callDialogCloseSuccess();
          this._sportService.callBalance = 1;
          this._sportService.getBalance();
        }else{
          this._sportService._loading = false;
          this._sessionService.notifier.notify('error',data.message);
        }
      }, error => {
      });
    }
    this.userInputData.numberError="";
    this.userInputData.amountError="";

  }

}
