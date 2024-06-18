import { Component, OnInit } from "@angular/core";
import { formatDate } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { DepositPaymentOptionService } from "./depositpaymentoption.service";
import { SportServiceService } from "../service/sport-service.service";
import { Router } from "@angular/router";
import { SessionService } from "../service/session.service";
import { browserRefresh } from "../app.component";
import { log } from "console";
import { isNullOrUndefined } from "util";
declare const $: any;
@Component({
  selector: "app-depositpaymentoption",
  templateUrl: "./depositpaymentoption.component.html",
  styleUrls: ["./depositpaymentoption.component.css"],
})
export class DepositPaymentOptionComponent implements OnInit {
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
  fd = new FormData();
  selectedFile: File = null;
  imageSrc;
  panImagePath = "";
  isPT = false;
  isGP = false;
  isPP = false;
  isIMPS = true;
  acTypeGP = false;
  acTypePT = false;
  acTypePP = false;
  acTypeIMPS = false;
  selectPaymentType = "";
  amount = "";
  cancel_form = new FormGroup({
    description: new FormControl(null, [Validators.required]),
  });
  constructor(
    public _sessionService: SessionService,
    public _DwRequestService: DepositPaymentOptionService,
    public _sportService: SportServiceService,
    public route: Router
  ) {
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
      onSelect: (selected, evnt) => {
        //arrow function passes the this into the new scope
        this.getFromDate();
      },
    });

    $("#toDate").datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat: "dd-mm-yy",
      onSelect: (selected, evnt) => {
        //arrow function passes the this into the new scope
        this.gettoDate();
      },
    });

    this.setupIntialDates();
    this.getDWStatement();

    this._sportService.callBalance = 1;
    this._sportService.getBalance();
    this.getAccountDetail();

    this.openWithdrawForm("IMPS");
    this.openPaymentMethod("IMPS");
  }

  deposite_form = new FormGroup({
    account_number: new FormControl(null),
    ifsc_code: new FormControl(null),
    account_name: new FormControl(null),
    is_utr: new FormControl(null),
    account_type: new FormControl(null),
    amount: new FormControl(this.amount, [Validators.min(100)]),
    utrnumber: new FormControl(null, [Validators.required]),
    deposite: new FormControl(null),
    panPath: new FormControl(null),
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
      };
      $("#imgtext").html("File uploaded successfully.");
    }
  }

  uploadPanFile() {
    const formData = new FormData();
    if (this.pfile) {
      formData.append("deposite", this.pfile);
    }
    this._DwRequestService.uploadPanFile(formData).subscribe(
      (response) => {
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
        } else {
          this._sessionService.notifier.notify("error", response.message);
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this._sessionService.printLog(error.error);
        if (error.error instanceof ProgressEvent) {
          if (error.status == 0) {
            this._sessionService.notifier.notify(
              "error",
              "Internet not available."
            );
            return;
          }
        }
        if (error.error) {
          this._sessionService.notifier.notify("error", error.error.message);
        }
      }
    );
  }
  fillAmount(amount) {
    $("#deposit_amount").val(amount);
    this.amount = amount;
  }
  submit(acData) {
    this.isValidFormSubmitted = false;
    if (this.deposite_form.invalid) {
      return;
    } else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj = this.deposite_form.value;
      console.log(obj);
      if (obj.is_utr == 1 && obj.utrnumber == null) {
        this._sessionService.notifier.notify(
          "error",
          "Enter valid UTR number."
        );
        return;
      } else if (obj.is_utr == 0 && obj.deposite == null) {
        this._sessionService.notifier.notify(
          "error",
          "Please upload payment screenshot."
        );
        return;
      }
      var data = {
        amount: this.amount,
        account_number: acData.account_phone_number,
        ifsc: acData.account_ifsc_code == null ? "" : acData.account_ifsc_code,
        account_name: acData.account_holder_name,
        type: "D",
        user_id: acData.id,
        transaction_id: obj.utrnumber == null ? "" : obj.utrnumber,
        sender: "",
        reciver: "",
        dwtype: "D",
        method: acData.account_type,
        attachment: this.panImagePath,
      };
      this._DwRequestService.dwrequestSave(data).subscribe(
        (response) => {
          if (!response.error) {
            var msg = "Deposit request successfully submitted.";
            this._sessionService.notifier.notify("success", msg);
            this.deposite_form.reset();
            this.imageSrc = "";
            this.route.navigate(["/dwrequest-statement"]);
            // if (this.route.url == '/dwrequest-statement') {
            //   this._sessionService.getDWStatement();
            // }
          } else {
            this._sessionService.notifier.notify("error", response.message);
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify(
                "error",
                "Internet not available."
              );
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
        }
      );
    }
  }

  setupIntialDates() {
    var todayDate = new Date();
    var past7Date = new Date();
    past7Date.setDate(past7Date.getDate() - 6);

    $("#fromDate").datepicker("option", "maxDate", todayDate);
    $("#toDate").datepicker("option", "maxDate", todayDate);
    $("#toDate").datepicker("option", "minDate", past7Date);

    var formattedTodayDate = formatDate(todayDate, "yyyy-MM-dd", "en");
    var formatted7Date = formatDate(past7Date, "yyyy-MM-dd", "en");

    this.toDateValue = formattedTodayDate;
    this.fromDateValue = formatted7Date;
    this.toDateValue1 = formatDate(todayDate, "dd-MM-yyyy", "en");
    this.fromDateValue1 = formatDate(past7Date, "dd-MM-yyyy", "en");

    var fDate = formatted7Date + " 00:00:00";
    this.fromDate = this.toTimestamp(fDate);

    var tDate = formattedTodayDate + " 23:59:59";
    this.toDate = this.toTimestamp(tDate);
    this._sessionService.fromDate = this.fromDate;
    this._sessionService.toDate = this.toDate;
  }

  validateNumber(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    var value = evt.target.value;
    var dotcontains = value.indexOf(".") != -1;
    if (dotcontains) if (charCode == 46) return false;
    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
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

  getAccountDetail() {
    var sdata = { type: "D" };
    this._DwRequestService.getAccountDetail(sdata).subscribe(
      (data) => {
        console.log(data);

        if (!data.error) {
          this.accountDatas = data.data;
          if (isNullOrUndefined(this.accountDatas)) {
            this.accountData = [];
          } else {
            this.accountData = this.accountDatas;
          }
        }
      },
      (error) => {
        //this.loading=false;
      }
    );
  }

  getFromDate() {
    var selectedDate = $("#fromDate").datepicker("getDate");
    var event = formatDate(selectedDate, "yyyy-MM-dd", "en");

    if (this.fromDateValue == event) {
      return;
    }

    $("#toDate").datepicker("option", "minDate", selectedDate);

    this.fromDateValue = event;
    var fDate = event + " 00:00:00";
    this.fromDate = this.toTimestamp(fDate);
    if (this.fromDate > this.toDate) {
      this.toDateValue = event;
      var tDate = event + " 23:59:59";
      this.toDate = this.toTimestamp(tDate);

      this._sessionService.toDate = this.toDate;
    }
    this._sessionService.fromDate = this.fromDate;
    this.page = 1;

    this.getDWStatement();
  }

  gettoDate() {
    var selectedDate = $("#toDate").datepicker("getDate");
    var event = formatDate(selectedDate, "yyyy-MM-dd", "en");

    if (this.toDateValue == event) {
      return;
    }
    this.toDateValue = event;
    var tDate = event + " 23:59:59";
    this.toDate = this.toTimestamp(tDate);
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
      this._sessionService.notifier.notify(
        "error",
        "Error! ToDate is Grater Then fromDate"
      );
      return;
    }
    var data = {
      from_date: this.fromDate,
      to_date: this.toDate,
      limit: this._sessionService.dataLimit,
      page: this.page,
      status: this.selectedStatus,
      type: this.selectedType,
    };

    this._DwRequestService.getDWRequestStatement(data).subscribe(
      (data) => {
        if (!data.error) {
          if (this.page == 1) {
            this._sessionService.DWStatement = data.data;
          } else {
            this._sessionService.DWStatement.push.apply(
              this._sessionService.DWStatement,
              data.data
            );
          }
        }
      },
      (error) => {
        this._sessionService.printLog(error.error);
        if (error.error instanceof ProgressEvent) {
          if (error.status == 0) {
            this._sessionService.notifier.notify(
              "error",
              "Internet not available."
            );
          }
        }
      }
    );
  }

  CancelRequest = function () {
    this.isValidFormSubmitted = false;
    if (this.cancel_form.invalid) {
      return;
    } else {
      this.loading = true;
      this.isValidFormSubmitted = true;
      var obj = this.cancel_form.value;
      var data = {
        request_id: this.cancelId,
        reason: obj.description,
        type: "C",
      };
      this._DwRequestService.cancelRequest(data).subscribe(
        (response) => {
          if (!response.error) {
            var msg = "Request has been cancelled successfully.";
            this._sessionService.notifier.notify("success", msg);
            $("#pop_up_Cancel").removeClass("show");
            this.cancel_form.reset();
            this.cancelId = null;
            this.isCancelShow = -1;
            this.getDWStatement();
          } else {
            this._sessionService.notifier.notify("error", response.message);
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this._sessionService.printLog(error.error);
          if (error.error instanceof ProgressEvent) {
            if (error.status == 0) {
              this._sessionService.notifier.notify(
                "error",
                "Internet not available."
              );
              return;
            }
          }
          if (error.error) {
            this._sessionService.notifier.notify("error", error.error.message);
          }
        }
      );
    }
  };

  formReset() {
    this.cancel_form.reset();
    this.isValidFormSubmitted = null;
  }

  copyMessage(val: string) {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this._sessionService.notifier.notify("success", "COPIED!!");
  }

  openWithdrawForm(type) {
    this.selectPaymentType = type;
  }

  uploadType(type) {
    if (type == 1) {
      $("#screen_short").attr("readonly", true);
      $("#utr_number").attr("readonly", false);
    } else {
      $("#screen_short").attr("readonly", false);
      $("#utr_number").attr("readonly", true);
      $("#utr_number").val("");
    }
  }

  openPaymentMethod(type) {
    $(".pptab").removeClass("active");
    this.selectPaymentType = type;
    $(".pp_" + type).addClass("active");
  }
}
