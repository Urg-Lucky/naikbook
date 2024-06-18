import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { WithdrawRequestService } from './withdraw-request.service';
import { SportServiceService } from '../service/sport-service.service';
import { Router } from '@angular/router';
import { SessionService } from '../service/session.service';
import { browserRefresh } from '../app.component';
import { log } from 'console';
import { isNullOrUndefined } from 'util';
declare const $: any;
@Component({
  selector: 'app-withdraw-request',
  templateUrl: './withdraw-request.component.html',
  styleUrls: ['./withdraw-request.component.css']
})
export class WithdrawRequestComponent implements OnInit {
  loading = false;
  toDate;
  fromDate;
  toDateValue;
  fromDateValue;
  toDateValue1;
  fromDateValue1;
  selectedType = "AL";
  selectedStatus = "AL";
  isCancelShow = -1;
  public DWStatement: any = [];
  page: number = 1;
  SportData: any = [];
  accountData: any = [];
  accountDatas: any = [];
  CupData: any = [];
  cancelId = null;
  isValidFormSubmitted = null;
  isValidFormSubmittedPT = null;
  isValidFormSubmittedGP = null;
  isValidFormSubmittedPP = null;
  isValidFormSubmittedimps = null;
  fd = new FormData();
  selectedFile: File = null;
  imageSrc;
  panImagePath = '';
  isPT = false;
  isGP = false;
  isPP = false;
  isIMPS = true;
  acTypeGP = false;
  acTypePT = false;
  acTypePP = false;
  acTypeIMPS = false;
  selectPaymentType = '';

  cancel_form = new FormGroup({
    description: new FormControl(null, [Validators.required])
  })
  constructor(
    public _sessionService: SessionService,
    public _DwRequestService: WithdrawRequestService,
    public _sportService: SportServiceService, public route: Router) {
    this._sportService.isShowOneClick = false;


  }

  toTimestamp(strDate) {
    return this._sessionService.toTimestamp(strDate);
  }
  ngOnInit() {
    if (browserRefresh) {
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
    this.getAccountDetail();

  }
  withdraw_form_pt = new FormGroup({
    upiidpt: new FormControl(null, [Validators.required]),
    accountnamept: new FormControl(null, [Validators.required]),
    amountpt: new FormControl(null, [Validators.required, Validators.min(100), Validators.max(100000)]),
    requestmethodpt: new FormControl(null, [Validators.required]),
  });

  withdraw_form_gp = new FormGroup({
    upiidgp: new FormControl(null, [Validators.required]),
    accountnamegp: new FormControl(null, [Validators.required]),
    amountgp: new FormControl(null, [Validators.required, Validators.min(100), Validators.max(100000)]),
    requestmethodgp: new FormControl(null, [Validators.required]),
  });
  withdraw_form_pp = new FormGroup({
    upiidpp: new FormControl(null, [Validators.required]),
    accountnamepp: new FormControl(null, [Validators.required]),
    amountpp: new FormControl(null, [Validators.required, Validators.min(100), Validators.max(100000)]),
    requestmethodpp: new FormControl(null, [Validators.required]),
  });
  withdraw_form_imps = new FormGroup({
    accountnumberimps: new FormControl(null, [Validators.required]),
    //accountnumberconfirmimps: new FormControl(null, [Validators.required]),
    ifsccodeimps: new FormControl(null, [Validators.required]),
    accountholdernameimps: new FormControl(null, [Validators.required]),
    banknameimps: new FormControl(null, [Validators.required]),
    accounttypeimps: new FormControl(null, [Validators.required]),
    requestmethodimps: new FormControl(null, [Validators.required]),
    amountimps: new FormControl(null, [Validators.required, Validators.min(100), Validators.max(100000)]),
  });

  pfile;
  fileProgressPan(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    this.pfile = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(this.pfile);
      // this.support_form.get('image').setValue(this.tfile);
      this.uploadPanFile();
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageSrc = reader.result;
      }
    }
  }
  uploadPanFile() {
    const formData = new FormData();
    if (this.pfile) {
      formData.append('deposite', this.pfile);
    }
    this._DwRequestService.uploadPanFile(formData).subscribe(response => {

      if (!response.error) {
        this.panImagePath = response.data.attachment;
        // var msg = "Kyc successfully submitted.";
        // this._sessionService.notifier.notify('success', msg);
        // $('#pop_up_Kyc').removeClass('show');
        // this.kyc_form.reset();
        // this.file = null;
        // this.pfile = null;
        // if (this.route.url == '/support-request') {
        //   this._sessionService.getSupportStatement();
        // }

      }
      else {
        this._sessionService.notifier.notify('error', response.message);
      }
      this.loading = false;
    }, (error) => {
      this.loading = false;
      this._sessionService.printLog(error.error);
      if (error.error instanceof ProgressEvent) {
        if (error.status == 0) {
          this._sessionService.notifier.notify('error', "Internet not available.");
          return;
        }
      }
      if (error.error) {
        this._sessionService.notifier.notify('error', error.error.message);
      }
    })

  }

  getAccountDetail() {
    var sdata = { "type": 'W' }
    var newVariable = [];
    this._DwRequestService.getAccountDetail(sdata).subscribe(data => {
      if (!data.error) {
        this.accountDatas = data.data;
        this.accountDatas.forEach(function (arr1val) {
          console.log(arr1val);
          // perform logic here by the use of value of array
          newVariable.push(arr1val.type);

        });


        this.accountData = newVariable;
        console.log(this.accountData);
        this.acTypeGP = this.accountData.indexOf("GP") !== -1;
        this.acTypePT = this.accountData.indexOf("PT") !== -1;
        this.acTypePP = this.accountData.indexOf("PP") !== -1;
        this.acTypeIMPS = this.accountData.indexOf("IMPS") !== -1;

      }
    }, error => {
      //this.loading=false;
    })
  }

  submitGP() {

    this.isValidFormSubmittedGP = false;
    if (this.withdraw_form_gp.invalid) {
      return;
    }
    else {
      this.loading = true;
      this.isValidFormSubmittedGP = true;
      var obj = this.withdraw_form_gp.value;
      var data = {
        "amount": obj.amountgp,
        "account_number": obj.upiidgp,
        "ifsc": '',
        "account_name": obj.accountnamegp,
        "type": 'W',
        "user_id": 0,
        "transaction_id": '',
        "sender": '',
        "reciver": '',
        "dwtype": obj.requestmethodgp,
        "method": 'GP',
        "attachment": '',
      }
      if (this.acTypeGP == true) {
        this._DwRequestService.dwrequestSave(data).subscribe(response => {

          if (!response.error) {
            var msg = "Withdraw request successfully submitted.";
            this._sessionService.notifier.notify('success', msg);
            this.withdraw_form_gp.reset();
            this._sportService.getBalance();
            //this.route.navigate(['/dwrequest-statement']);
            if (this.route.url == '/dwrequest-statement') {
              this._sessionService.getDWStatement();
            }
          }
          else {
            this._sessionService.notifier.notify('error', response.message);
          }
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify('error', "Internet not available.");
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify('error', error.error.message);
          }
        })
      } else {

        var userdata = {
          "actype": 'GP',
          "accountnumber": obj.upiidgp,
          "ifsc": '',
          "name": obj.accountnamegp,
          "attachment": '',
          "type": 'W',
          "upi": obj.upiidgp,
          "accountname": obj.accountnamegp,
        }

        //this._DwRequestService.saveUserDetail(userdata).subscribe(response => {

        //if (!response.error) {
        // var msg = "Deposit request successfully submitted.";
        // this._sessionService.notifier.notify('success', msg);
        // this.withdraw_form_pt.reset();
        // if (this.route.url == '/dwrequest-statement') {
        //   this._sessionService.getDWStatement();
        // }
        this._DwRequestService.dwrequestSave(data).subscribe(response => {

          if (!response.error) {
            var msg = "Withdraw request successfully submitted.";
            this._sessionService.notifier.notify('success', msg);
            this.withdraw_form_gp.reset();
            this._sportService.getBalance();
            //this.route.navigate(['/dwrequest-statement']);
            if (this.route.url == '/dwrequest-statement') {
              this._sessionService.getDWStatement();
            }
          }
          else {
            this._sessionService.notifier.notify('error', response.message);
          }
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify('error', "Internet not available.");
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify('error', error.error.message);
          }
        })
        // }
        // else {
        //   this._sessionService.notifier.notify('error', response.message);
        // }
        //this.loading = false;
        //});
      }
    }
  }

  submitPP() {

    this.isValidFormSubmittedPP = false;
    if (this.withdraw_form_pp.invalid) {
      return;
    }
    else {
      this.loading = true;
      this.isValidFormSubmittedPP = true;
      var obj = this.withdraw_form_pp.value;


      var data = {
        "amount": obj.amountpp,
        "account_number": obj.upiidpp,
        "ifsc": '',
        "account_name": obj.accountnamepp,
        "type": 'W',
        "user_id": 0,
        "transaction_id": '',
        "sender": '',
        "reciver": '',
        "dwtype": obj.requestmethodpp,
        "method": 'PP',
        "attachment": '',
      }
      if (this.acTypePP == true) {
        this._DwRequestService.dwrequestSave(data).subscribe(response => {

          if (!response.error) {
            var msg = "Withdraw request successfully submitted.";
            this._sessionService.notifier.notify('success', msg);
            this.withdraw_form_pp.reset();
            this._sportService.getBalance();
            this.route.navigate(['/dwrequest-statement']);
            // if (this.route.url == '/dwrequest-statement') {
            //   this._sessionService.getDWStatement();
            // }
          }
          else {
            this._sessionService.notifier.notify('error', response.message);
          }
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify('error', "Internet not available.");
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify('error', error.error.message);
          }
        })
      } else {

        var userdata = {
          "actype": 'PP',
          "accountnumber": obj.upiidpp,
          "ifsc": '',
          "name": obj.accountnamepp,
          "attachment": '',
          "type": 'W',
          "upi": obj.upiidpp,
          "accountname": obj.accountnamepp,
        }

        //this._DwRequestService.saveUserDetail(userdata).subscribe(response => {

        //if (!response.error) {
        // var msg = "Deposit request successfully submitted.";
        // this._sessionService.notifier.notify('success', msg);
        // this.withdraw_form_pt.reset();
        // if (this.route.url == '/dwrequest-statement') {
        //   this._sessionService.getDWStatement();
        // }
        this._DwRequestService.dwrequestSave(data).subscribe(response => {

          if (!response.error) {
            var msg = "Withdraw request successfully submitted.";
            this._sessionService.notifier.notify('success', msg);
            this.withdraw_form_pp.reset();
            this._sportService.getBalance();
            this.route.navigate(['/dwrequest-statement']);
            // if (this.route.url == '/dwrequest-statement') {
            //   this._sessionService.getDWStatement();
            // }
          }
          else {
            this._sessionService.notifier.notify('error', response.message);
          }
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify('error', "Internet not available.");
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify('error', error.error.message);
          }
        })
        //}
        // else {
        //   this._sessionService.notifier.notify('error', response.message);
        // }
        this.loading = false;
        //});
      }
    }
  }

  submitPt() {

    this.isValidFormSubmittedPT = false;
    if (this.withdraw_form_pt.invalid) {
      return;
    }
    else {
      this.loading = true;
      this.isValidFormSubmittedPT = true;
      var obj = this.withdraw_form_pt.value;


      var data = {
        "amount": obj.amountpt,
        "account_number": obj.upiidpt,
        "ifsc": '',
        "account_name": obj.accountnamept,
        "type": 'W',
        "user_id": 0,
        "transaction_id": '',
        "sender": '',
        "reciver": '',
        "dwtype": obj.requestmethodpt,
        "method": 'PT',
        "attachment": '',
      }
      if (this.acTypePT == true) {
        this._DwRequestService.dwrequestSave(data).subscribe(response => {

          if (!response.error) {
            var msg = "Withdraw request successfully submitted.";
            this._sessionService.notifier.notify('success', msg);
            this.withdraw_form_pt.reset();
            this._sportService.getBalance();
            this.route.navigate(['/dwrequest-statement']);
            // if (this.route.url == '/dwrequest-statement') {
            //   this._sessionService.getDWStatement();
            // }
          }
          else {
            this._sessionService.notifier.notify('error', response.message);
          }
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify('error', "Internet not available.");
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify('error', error.error.message);
          }
        })
      } else {

        var userdata = {
          "actype": 'PT',
          "accountnumber": obj.upiidpt,
          "ifsc": '',
          "name": obj.accountnamept,
          "attachment": '',
          "type": 'W',
          "upi": obj.upiidpt,
          "accountname": obj.accountnamept,
        }

        //this._DwRequestService.saveUserDetail(userdata).subscribe(response => {

        //if (!response.error) {
        // var msg = "Deposit request successfully submitted.";
        // this._sessionService.notifier.notify('success', msg);
        // this.withdraw_form_pt.reset();
        // if (this.route.url == '/dwrequest-statement') {
        //   this._sessionService.getDWStatement();
        // }
        this._DwRequestService.dwrequestSave(data).subscribe(response => {

          if (!response.error) {
            var msg = "Withdraw request successfully submitted.";
            this._sessionService.notifier.notify('success', msg);
            this.withdraw_form_pt.reset();
            this._sportService.getBalance();
            this.route.navigate(['/dwrequest-statement']);
            // if (this.route.url == '/dwrequest-statement') {
            //   this._sessionService.getDWStatement();
            // }
          }
          else {
            this._sessionService.notifier.notify('error', response.message);
          }
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify('error', "Internet not available.");
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify('error', error.error.message);
          }
        })
        // }
        //else {
        //  this._sessionService.notifier.notify('error', response.message);
        //}
        //this.loading = false;
        // });
      }




    }
  }

  submitIMPS() {
    this.isValidFormSubmittedimps = false;
    if (this.withdraw_form_imps.invalid) {
      return;
    }
    else {
      this.loading = true;
      this.isValidFormSubmittedimps = true;
      var obj = this.withdraw_form_imps.value;
      var data = {
        "amount": obj.amountimps,
        "account_number": obj.accountnumberimps,
        "ifsc": obj.ifsccodeimps,
        "account_name": obj.accountholdernameimps,
        "type": 'W',
        "user_id": 0,
        "transaction_id": '',
        "sender": '',
        "reciver": '',
        "dwtype": obj.requestmethodimps,
        "method": 'IMPS',
        "attachment": '',
        "bankname": obj.banknameimps
      }

      if (this.acTypeIMPS == true) {
        this._DwRequestService.dwrequestSave(data).subscribe(response => {

          if (!response.error) {
            var msg = "Deposit request successfully submitted.";
            this._sessionService.notifier.notify('success', msg);
            this.withdraw_form_imps.reset();
            this._sportService.getBalance();
            this.route.navigate(['/dwrequest-statement']);
            // if (this.route.url == '/dwrequest-statement') {
            //   this._sessionService.getDWStatement();
            // }
          }
          else {
            this._sessionService.notifier.notify('error', response.message);
          }
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify('error', "Internet not available.");
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify('error', error.error.message);
          }
        })
      } else {
        var userdata = {
          "actype": 'IMPS',
          "accountnumber": obj.accountnumberimps,
          "ifsc": obj.ifsccodeimps,
          "name": obj.banknameimps,
          "attachment": '',
          "type": 'W',
          "upi": '',
          "accountname": obj.accountholdernameimps,
        }

        //this._DwRequestService.saveUserDetail(userdata).subscribe(response => {

        //if (!response.error) {
        // var msg = "Deposit request successfully submitted.";
        // this._sessionService.notifier.notify('success', msg);
        // this.withdraw_form_pt.reset();
        // if (this.route.url == '/dwrequest-statement') {
        //   this._sessionService.getDWStatement();
        // }
        this._DwRequestService.dwrequestSave(data).subscribe(response => {

          if (!response.error) {
            var msg = "Withdraw request successfully submitted.";
            this._sessionService.notifier.notify('success', msg);
            this.withdraw_form_imps.reset();
            this._sportService.getBalance();
            this.route.navigate(['/dwrequest-statement']);
            // if (this.route.url == '/dwrequest-statement') {
            //   this._sessionService.getDWStatement();
            // }
          }
          else {
            this._sessionService.notifier.notify('error', response.message);
          }
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify('error', "Internet not available.");
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify('error', error.error.message);
          }
        })
        //}
        //else {
        //this._sessionService.notifier.notify('error', response.message);
        //}
        //this.loading = false;
        //});
      }

    }
  }
  // savePtDetail(){
  //   var upiid = $("")
  // }
  setupIntialDates() {
    var todayDate = new Date();
    var past7Date = new Date();
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
    this.fromDate = this.toTimestamp(fDate)

    var tDate = formattedTodayDate + ' 23:59:59';
    this.toDate = this.toTimestamp(tDate)
    this._sessionService.fromDate = this.fromDate;
    this._sessionService.toDate = this.toDate;

  }
  validateNumber(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    var value = evt.target.value;
    var dotcontains = value.indexOf(".") != -1;
    if (dotcontains)
      if (charCode == 46) return false;
    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    let input = String.fromCharCode(evt.charCode);
    const reg = /^\d+[.,]?\d{0,1}$/g;
    if (!reg.test(value) && value != "") {
      evt.preventDefault();
      return false;
    }
    if (value.indexOf(".") == -1) {
      if (value.length > 7) {
        evt.preventDefault();
        return false;
      }
    }
    return true;
  }

  getFromDate() {
    var selectedDate = $("#fromDate").datepicker('getDate');
    var event = formatDate(selectedDate, "yyyy-MM-dd", "en");

    if (this.fromDateValue == event) {
      return;
    }

    $("#toDate").datepicker('option', 'minDate', selectedDate);


    this.fromDateValue = event;
    var fDate = event + ' 00:00:00'
    this.fromDate = this.toTimestamp(fDate)
    if (this.fromDate > this.toDate) {
      this.toDateValue = event;
      var tDate = event + ' 23:59:59';
      this.toDate = this.toTimestamp(tDate)

      this._sessionService.toDate = this.toDate;
    }
    this._sessionService.fromDate = this.fromDate;
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
    this._sessionService.toDate = this.toDate;
    this.getDWStatement();

  }

  onScroll() {
    this.page = this.page + 1;
    this.getDWStatement();
  }
  goToSerch() {
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
      "status": this.selectedStatus,
      "type": this.selectedType
    }

    this._DwRequestService.getDWRequestStatement(data).subscribe(data => {
      if (!data.error) {
        if (this.page == 1) {
          this._sessionService.DWStatement = data.data;
        } else {
          this._sessionService.DWStatement.push.apply(this._sessionService.DWStatement, data.data)
        }
      }
    }, (error) => {
      this._sessionService.printLog(error.error);
      if (error.error instanceof ProgressEvent) {
        if (error.status == 0) {
          this._sessionService.notifier.notify('error', "Internet not available.");
        }
      }


    });

  }

  CancelRequest = function () {
    this.isValidFormSubmitted = false;
    if (this.cancel_form.invalid) {

      return;
    }
    else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj = this.cancel_form.value;
      var data = {
        "request_id": this.cancelId,
        "reason": obj.description,
        "type": "C"
      }
      this._DwRequestService.cancelRequest(data).subscribe(response => {

        if (!response.error) {
          var msg = "Request has been cancelled successfully.";
          this._sessionService.notifier.notify('success', msg);
          $('#pop_up_Cancel').removeClass('show');
          this.cancel_form.reset();
          this.cancelId = null;
          this.isCancelShow = -1;
          this.getDWStatement();


        }
        else {
          this._sessionService.notifier.notify('error', response.message);
        }
        this.loading = false;
      }, (error) => {
        this.loading = false;
        this._sessionService.printLog(error.error);
        if (error.error instanceof ProgressEvent) {
          if (error.status == 0) {
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
  formReset() {
    this.cancel_form.reset();
    this.isValidFormSubmitted = null;
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._sessionService.notifier.notify('success', 'COPIED!!');
  }

  openWithdrawForm(type) {
    this.selectPaymentType = type;
    if (type == 'PT') {
      this.isPT = true;
      this.isGP = false;
      this.isPP = false;
      this.isIMPS = false;
    } else if (type == 'GP') {
      this.isGP = true;
      this.isPT = false;
      this.isPP = false;
      this.isIMPS = false;
    } else if (type == 'PP') {
      this.isPP = true;
      this.isGP = false;
      this.isPT = false;
      this.isIMPS = false;
    } else if (type == 'IMPS') {
      this.isIMPS = true;
      this.isPP = false;
      this.isGP = false;
      this.isPT = false;
    }
  }
}
