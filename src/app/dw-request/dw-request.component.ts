import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DwRequestService } from './dw-request.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router } from '@angular/router';
import { SessionService } from '../service/session.service';
import { browserRefresh } from '../app.component';
declare const $: any;
@Component({
  selector: 'app-dw-request',
  templateUrl: './dw-request.component.html',
  styleUrls: ['./dw-request.component.css']
})
export class DwRequestComponent implements OnInit {

 toDate;
  fromDate;
  toDateValue;
  fromDateValue;
    toDateValue1;
  fromDateValue1;
  selectedType="AL";
  selectedStatus="AL";
  isCancelShow=-1;
  public DWStatement: any = [];
  page: number = 1;
  SportData: any = [];
  CupData: any = [];
  cancelId=null;
  isValidFormSubmitted = null;
    cancel_form = new FormGroup({
    description:new FormControl(null, [Validators.required])
  })
  constructor(
    public _sessionService:SessionService,
    public _DwRequestService:DwRequestService,
    public _sportService:SportServiceService,public route:Router ) { 
      this._sportService.isShowOneClick=false;

        
  }

  toTimestamp(strDate){
    return this._sessionService.toTimestamp(strDate);
 }
  ngOnInit() {
    if(browserRefresh){
      this._sessionService.gotoLoginPage();
      return;
    }


    $("#fromDate").datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat: "dd-mm-yy",
      onSelect: (selected, evnt) => { //arrow function passes the this into the new scope
        this.getFromDate();
      }
    });

    $("#toDate").datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat: "dd-mm-yy",
      onSelect: (selected, evnt) => { //arrow function passes the this into the new scope
        this.gettoDate();
      }
    });

    this.setupIntialDates();
    this.getDWStatement();

    this._sportService.callBalance = 1;
    this._sportService.getBalance();


  }
  setupIntialDates() {
    var todayDate = new Date();
    var past7Date= new Date();
    past7Date.setDate(past7Date.getDate() - 6)

    $("#fromDate").datepicker('option', 'maxDate', todayDate);
    $("#toDate").datepicker('option', 'maxDate', todayDate);
    $("#toDate").datepicker('option', 'minDate', past7Date);

    var formattedTodayDate = formatDate(todayDate, "yyyy-MM-dd", "en")
    var formatted7Date = formatDate(past7Date, "yyyy-MM-dd", "en")
    

    this.toDateValue = formattedTodayDate;
    this.fromDateValue = formatted7Date;
 this.toDateValue1 = formatDate(todayDate, "dd-MM-yyyy", "en");
    this.fromDateValue1 = formatDate(past7Date, "dd-MM-yyyy", "en");

    var fDate = formatted7Date + ' 00:00:00';
    this.fromDate =this.toTimestamp(fDate)

    var tDate = formattedTodayDate + ' 23:59:59';
    this.toDate = this.toTimestamp(tDate)
    this._sessionService.fromDate=this.fromDate;
    this._sessionService.toDate=this.toDate;

  }
 

  getFromDate() {
    var selectedDate = $("#fromDate").datepicker('getDate');
    var event = formatDate(selectedDate, "yyyy-MM-dd", "en");

    if (this.fromDateValue == event) {
      return;
    }

    $("#toDate").datepicker('option', 'minDate', selectedDate);

   
    this.fromDateValue = event;
    var fDate = event+ ' 00:00:00'
    this.fromDate = this.toTimestamp(fDate)
    if (this.fromDate > this.toDate) {
      this.toDateValue = event;
      var tDate = event + ' 23:59:59';
      this.toDate = this.toTimestamp(tDate)
           
    this._sessionService.toDate=this.toDate;
    }
      this._sessionService.fromDate=this.fromDate;
    this.page = 1;
   
    this.getDWStatement();


  }
  gettoDate() {
    var selectedDate = $("#toDate").datepicker('getDate');
    var event = formatDate(selectedDate, "yyyy-MM-dd", "en");

    if (this.toDateValue == event) {
      return;
    }
    this.toDateValue = event;
    var tDate = event + ' 23:59:59';
    this.toDate = this.toTimestamp(tDate)
    this.page = 1;
    this._sessionService.toDate=this.toDate;
    this.getDWStatement();

  }

  onScroll() {
    this.page = this.page + 1;
    this.getDWStatement();
  }
  goToSerch(){
    this.getDWStatement();
  }
  getDWStatement() { 

    if (this.fromDate > this.toDate) {
      this._sessionService.notifier.notify('error', 'Error! ToDate is Grater Then fromDate');
      return;
    }
    var data = {
      "from_date": this.fromDate,
      "to_date": this.toDate,
      "limit": this._sessionService.dataLimit,
      "page": this.page,
       "status":this.selectedStatus,
      "type":this.selectedType
    }

    this._DwRequestService.getDWRequestStatement(data).subscribe(data => {
      if(!data.error)
      {       if(this.page == 1)
        {            
        this._sessionService.DWStatement=data.data; 
        }else{
          this._sessionService.DWStatement.push.apply(this._sessionService.DWStatement, data.data)
        }               
      }
      }, (error)=>{
        this._sessionService.printLog(error.error);
        if(error.error instanceof ProgressEvent){
          if(error.status==0){
            this._sessionService.notifier.notify('error', "Internet not available.");
          }
        }
        
        
      }); 
      
  }
   
CancelRequest = function(){
    this.isValidFormSubmitted = false;
    if(this.cancel_form.invalid)
    {
      
      return;
    }
    else{
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj = this.cancel_form.value;
      var data = {
              "request_id":this.cancelId,
              "reason":obj.description,
              "type":"C"
              }
   this._DwRequestService.cancelRequest(data).subscribe(response => {

        if (!response.error) {
          var msg="Request has been cancelled successfully.";
          this._sessionService.notifier.notify('success', msg);
          $('#pop_up_Cancel').removeClass('show');
           this.cancel_form.reset();
           this.cancelId=null;
           this.isCancelShow=-1;
            this.getDWStatement();
           
          
        }
        else {
          this._sessionService.notifier.notify('error', response.message);
        }
        this.loading = false;
      }, (error)=>{
        this.loading = false;
        this._sessionService.printLog(error.error);
        if(error.error instanceof ProgressEvent){
          if(error.status==0){
            this._sessionService.notifier.notify('error', "Internet not available.");
            return;
          }
        }
        if (error.error) {
          this._sessionService.notifier.notify('error', error.error.message);
        }
      })

    }
  }
  formReset(){
    this.cancel_form.reset();
    this.isValidFormSubmitted=null;
  }
}
