import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { SessionService } from "../service/session.service";
import { LoginServiceService } from "../service/login-service.service";
import { Router } from '@angular/router';
import { isArray, isNullOrUndefined } from 'util';
declare const $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  IsEmail = null;
  loginTypeOtp;
  loading = false;
  loginLoading = false;
  signupLoading = false;
  login_form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })
  IsRegistration = 'N';
  IsRegistrationShow = false;
  isValidFormSubmitted = null;

  showInPlayData = null;
  timeZoneList = null;
  selectedTimeZone = null;

  screenHeight = window.outerHeight;

  newPassword;
  confPassword;
  unamePattern = "^[a-zA-Z ]*$";
  mobnumPattern = new RegExp("^((\\+91-?)|0)?[0-9]{10}$");
  emailPattern = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
  register_form = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.pattern(this.unamePattern)]),
    email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
    mobile: new FormControl(null, [Validators.required, Validators.pattern(this.mobnumPattern)]),
    usernamesignup: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required]),
    confPassword: new FormControl(null, [Validators.required])
  })

  isUser = true;

  currentSelectedSport = null;
  currentSelectedSportInPlay = null;
  sportsListData = null;
  matchesListData = null;
  matchesListDataInPlay = null;
  newsListData = null;
  sliderListData = null;
  outerPagesListData = null;
  marqueeMessage = "";


  constructor(private loginservice: LoginServiceService, public router: Router, public _sessionService: SessionService) {

  }

  ngOnInit() {

    var alreadySelectedTime = this._sessionService.get('timezone_value_login');

    localStorage.clear();

    this.timeZoneList = [{ 'name': 'Asia/Kolkata +5:30', 'value': '19800' },
    { 'name': 'Asia/Dubai +4:00', 'value': '14400' },
    { 'name': 'Asia/Kabul +4:30', 'value': '16200' },
    { 'name': 'Asia/Karachi +5:00', 'value': '18000' },
    { 'name': 'Asia/Dhaka +6:00', 'value': '21600' },
    { 'name': 'Asia/Singapore +8:00', 'value': '28800' }
    ];


    if (isNullOrUndefined(alreadySelectedTime)) {
      this.selectedTimeZone = this.timeZoneList[0];
    } else {
      for (let index = 0; index < this.timeZoneList.length; index++) {
        const element = this.timeZoneList[index];
        if (element.value == alreadySelectedTime) {
          this.selectedTimeZone = element;
          break;
        }
      }
    }
    this._sessionService.set('timezone_value_login', this.selectedTimeZone.value)




    this.showSportsView();
    //this.callGlobalSetting();
    this.getSports();
    this.getNews();
    this.getSlider();
    this.getOuterPages();
    this._sessionService.loadTawkScriptChat();

    this.setupTimeZoneViews(this);
  }

  login() {
    this.isValidFormSubmitted = false;
    if (this.login_form.invalid) {
      return true;
    }
    else {
      this.loginLoading = true;
      this.isValidFormSubmitted = true;
      var loginDetail = this.login_form.value
      var data = {
        user_name: loginDetail.username,
        password: loginDetail.password
      }
      this.loginservice.loginSave(data).subscribe((response) => {
        if (!response.error) {
          this._sessionService.set('slug', response.data.token);
          this._sessionService.set('userName', response.data.user_name);
          if (!isNullOrUndefined(response.data.is_rules_displayed) && response.data.is_rules_displayed != '') {
            this._sessionService.set('is_rules_displayed', response.data.is_rules_displayed);
            this._sessionService.set('ruleType', response.data.ruleType);
          }
          this.getBalance();
        }
        else {
          this._sessionService.notifier.notify('error', response.message);
          this.loginLoading = false;
        }
      }, (error) => {
        this.loginLoading = false;
        this._sessionService.printLog(error.error);
        if (error.error instanceof ProgressEvent) {
          if (error.status == 0) {
            this._sessionService.notifier.notify('error', "Internet not available.");
          }
        }
      });
    }

  }

  getBalance() {
    this.loginservice.getbalance().subscribe((response) => {
      if (!response.error) {
        this.loginLoading = false;
        var result = response.data;
        this._sessionService.set('avater', result.avatar);
        this._sessionService.set('liability', result.liability);
        this._sessionService.set('balance', result.balance);
        this._sessionService.set('profit_loss', result.profit_loss);
        this._sessionService.set('freechips', result.freechips);
        this._sessionService.set('timezone_value', result.timezone_value);
        this._sessionService.set('site_message', result.site_message);
        this._sessionService.notifier.notify('success', 'Login Successfull');
        this.router.navigate(['/dashboard']);
      }
    }, (error) => {
      this.getBalance();
    })
  }


  CheckUserExist = function (e) {
    if (e.target.value != "" && e.target.value.length > 3) {
      var data = {
        username: e.target.value
      }
      this.loading = true;
      this.loginservice.IsUserExist(data).subscribe((response) => {
        if (!response.error) {
          this._sessionService.notifier.notify('success', response.message);
          this.isUser = true;
        }
        else {
          this._sessionService.notifier.notify('error', response.message);
          this.isUser = false;
        }
        this.loading = false;
      }, error => {
        if (error.error) {
          this._sessionService.notifier.notify('error', error.error.message);
        }
        this.loading = false;
      })
    }

  }
  registerSave() {

    this.isValidFormSubmitted = false;
    if (this.register_form.invalid || !this.isUser) {
      return;
    }
    else {
      this.signupLoading = true;
      this.isValidFormSubmitted = true;
      var obj = this.register_form.value;
      var data = {
        name: obj.name,
        username: obj.usernamesignup,
        email: obj.email,
        mobile: obj.mobile,
        password: obj.newPassword,
        confirmpassword: obj.confPassword
      }
      this.loginservice.saveUser(data).subscribe(response => {
        if (!response.error) {
          this._sessionService.notifier.notify('success', response.message);
          this.IsRegistrationShow = false;
          this.formReset();
        }
        else {
          this._sessionService.notifier.notify('error', response.message);
        }
        this.signupLoading = false;
      }, error => {
        this.signupLoading = false;
        if (error.error) {
          this._sessionService.notifier.notify('error', error.error.message);
        }
      })
    }
  }
  formReset() {
    this.isValidFormSubmitted = null;
    this.register_form.reset();
  }

  callGlobalSetting() {
    var c1; var c2; var c3;
    var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

    this.loginservice.globalSetting().subscribe(response => {

      if (!response.error) {
        if (response.data.length > 0) {
          var mainResult = response.data[0].register;
          var firstText = mainResult.substring(0, 1);
          var secondText = mainResult.substring(33, mainResult.length);
          var result = Base64.decode(firstText + secondText);
          this.IsRegistration = result;
        }

      }
      else {
        this._sessionService.notifier.notify('error', response.message);
      }
      this.loading = false;
    }, error => {
      if (error.error) {
        this._sessionService.notifier.notify('error', error.error.message);
      }
      this.loading = false;
    })
  }

  onlyNumber = function (e) {

    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  }



  setupTimeZoneViews(appComponent) {
    $(document).ready(() => {
      var x, i, j, selElmnt, a, b, c;
      /*look for any elements with the class "custom-select":*/
      x = document.getElementsByClassName("custom-select-home");
      for (i = 0; i < x.length; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        /*for each element, create a new DIV that will act as the selected item:*/
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected-home");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /*for each element, create a new DIV that will contain the option list:*/
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items-home select-hide-home");
        for (j = 1; j < selElmnt.length; j++) {
          /*for each option in the original select element,
          create a new DIV that will act as an option item:*/
          c = document.createElement("DIV");
          c.innerHTML = selElmnt.options[j].innerHTML;
          c.addEventListener("click", function (e) {
            var innerValue = this.getElementsByTagName('span')[0].getAttribute('id');
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
              if (s.options[i].innerHTML == this.innerHTML) {
                s.selectedIndex = i;
                h.innerHTML = this.innerHTML;
                y = this.parentNode.getElementsByClassName("same-as-selected-home");
                for (k = 0; k < y.length; k++) {
                  y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected-home");
                break;
              }
            }
            h.click();
            appComponent._sessionService.set('timezone_value_login', innerValue);
          });
          b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function (e) {
          /*when the select box is clicked, close any other select boxes,
          and open/close the current select box:*/
          e.stopPropagation();
          closeAllSelect(this);
          this.nextSibling.classList.toggle("select-hide-home");
          this.classList.toggle("select-arrow-active-home");
        });
      }
      function closeAllSelect(elmnt) {
        /*a function that will close all select boxes in the document,
        except the current select box:*/
        var x, y, i, arrNo = [];
        x = document.getElementsByClassName("select-items-home");
        y = document.getElementsByClassName("select-selected-home");
        for (i = 0; i < y.length; i++) {
          if (elmnt == y[i]) {
            arrNo.push(i)
          } else {
            y[i].classList.remove("select-arrow-active-home");
          }
        }
        for (i = 0; i < x.length; i++) {
          if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide-home");
          }
        }
      }
      /*if the user clicks anywhere outside the select box,
      then close all select boxes:*/
      document.addEventListener("click", closeAllSelect);
    });

    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();
      if (scroll < 300) {
        $("#sticky-header").removeClass("sticky");
      } else {
        $("#sticky-header").addClass("sticky");
      }
    });

    window.onscroll = function () { scrollFunction() };

    function scrollFunction() {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        if (document.getElementById("navbar") != null) {
          document.getElementById("navbar").style.top = "0";
        }
      } else {
        if (document.getElementById("navbar") != null) {
          document.getElementById("navbar").style.top = "-70px";
        }
      }
    }
  }

  setupSlideScrollView() {
    setTimeout(() => {
      $('.slider').slick({
        dots: true,
        infinite: true,
        autoplay: true,
        // autoplaySpeed: 2000,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }, 50);
  }

  setupLiveSportsScrollView() {
    setTimeout(() => {
      let selectedSportIndex = this.sportsListData.findIndex(x => x.sport_id == this.currentSelectedSportInPlay.sport_id);

      var $frame = $('#basic');
      var $slidee = $frame.children('ul').eq(0);
      var $wrap = $frame.parent();

      // Call Sly on frame
      $frame.sly({
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: selectedSportIndex,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        pagesBar: $wrap.find('.pages'),
        activatePageOn: 'click',
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,

        // Buttons
        forward: $wrap.find('.forward'),
        backward: $wrap.find('.backward'),
        prev: $wrap.find('.prev'),
        next: $wrap.find('.next'),
        prevPage: $wrap.find('.prevPage'),
        nextPage: $wrap.find('.nextPage')
      });
    }, 50);

  }

  showSportsView() {
    this.showInPlayData = false;
    this.setupSlideScrollView();

  }

  showInPlayView() {
    this.showInPlayData = true;
    if (isNullOrUndefined(this.currentSelectedSportInPlay)) {
      if (this.sportsListData != null && this.sportsListData.length > 0) {
        this.currentSelectedSportInPlay = this.sportsListData[0];
      }
    }
    this.setupLiveSportsScrollView();
    this.reloadMatchDataInPlay();
  }

  retrySports() {
    setTimeout(() => {
      this.getSports();
    }, 1000);
  }

  getSports() {
    this.loginservice.getOuterSports().subscribe(response => {

      if (!response.error) {
        if (response.data != null && isArray(response.data) && response.data.length > 0) {
          this.sportsListData = response.data;
          this.getMatches();
        }
      }
      else {
        this.retrySports();
      }
    }, error => {
      this.retrySports();
    });
  }

  retryNewsTimer = null;
  retryNews() {
    if (this.retryNewsTimer != null) {
      clearTimeout(this.retryNewsTimer);
      this.retryNewsTimer = null;
    }
    this.retryNewsTimer = setTimeout(() => {
      this.getNews();
    }, 60000);
  }

  getNews() {
    this.loginservice.getOuterNews().subscribe(response => {

      if (!response.error) {
        if (response.data != null) {
          if (!isNullOrUndefined(response.data.SiteMessage)) {
            if (this.marqueeMessage != response.data.SiteMessage) {
              this.marqueeMessage = response.data.SiteMessage;
            }
          }
          if (!isNullOrUndefined(response.data.News) && isArray(response.data.News) && response.data.News.length > 0) {
            this.newsListData = response.data.News;
          }

          this.retryNews();
        }
      }
      else {
        this.retryNews();
      }
    }, error => {
      this.retryNews();
    });
  }


  retrySlider() {
    setTimeout(() => {
      this.getSlider();
    }, 1000);
  }

  getSlider() {
    this.loginservice.getOuterSlider().subscribe(response => {

      if (!response.error) {
        if (response.data != null && isArray(response.data) && response.data.length > 0) {
          this.sliderListData = response.data;
          this.setupSlideScrollView();
        }
      }
      else {
        this.retrySlider();
      }
    }, error => {
      this.retrySlider();
    });
  }


  retryOuterPages() {
    setTimeout(() => {
      this.getOuterPages();
    }, 1000);
  }

  getOuterPages() {
    this.loginservice.getOuterPages().subscribe(response => {

      if (!response.error) {
        if (response.data != null && isArray(response.data) && response.data.length > 0) {
          this.outerPagesListData = response.data;
        }
      }
      else {
        this.getOuterPages();
      }
    }, error => {
      this.getOuterPages();
    });
  }

  reloadMatchData() {
    this.matchesListData = null;
    this.getMatches();
  }

  reloadMatchDataInPlay() {
    this.matchesListDataInPlay = null;
    this.getMatches();
  }

  retryMatchesTimer = null;
  retryMatches() {
    if (this.retryMatchesTimer != null) {
      clearTimeout(this.retryMatchesTimer);
      this.retryMatchesTimer = null;
    }
    this.retryMatchesTimer = setTimeout(() => {
      this.getMatches();
    }, 60000);
  }
  getMatches() {
    if (this.retryMatchesTimer != null) {
      clearTimeout(this.retryMatchesTimer);
      this.retryMatchesTimer = null;
    }

    if (!this.showInPlayData) {
      if (this.currentSelectedSport == null) {
        this.loginservice.getOuterDashboard().subscribe(response => {

          if (!response.error) {
            if (response.data != null && isArray(response.data) && response.data.length > 0) {
              this.matchesListData = this.convertMatchDataToSportsVise(response.data);


            }
          }
          else {
            this.retryMatches();
          }
        }, error => {
          this.retryMatches();
        });
      } else {

        var matchTypes = "A";
        var data = {
          sport_id: this.currentSelectedSport.sport_id,
          datatype: matchTypes
        }

        this.loginservice.getOuterDashboardBySports(data).subscribe(response => {

          if (!response.error) {
            if (response.data != null && isArray(response.data)) {
              if (response.data.length > 0) {
                this.matchesListData = this.convertMatchDataToSportsVise(response.data);
              } else {
                let matchesListData = {};
                matchesListData[this.currentSelectedSport.sport_id] = { sport_id: this.currentSelectedSport.sport_id, SportName: this.currentSelectedSport.name, matches: [] }
                this.matchesListData = matchesListData;
              }
            }
          }
          else {
            this.retryMatches();
          }
        }, error => {
          this.retryMatches();
        });

      }
    } else {
      if (this.currentSelectedSportInPlay != null) {
        var matchTypes = "P";
        var data = {
          sport_id: this.currentSelectedSportInPlay.sport_id,
          datatype: matchTypes
        }

        this.loginservice.getOuterDashboardBySports(data).subscribe(response => {

          if (!response.error) {
            if (response.data != null && isArray(response.data)) {
              if (response.data.length > 0) {
                this.matchesListDataInPlay = this.convertMatchDataToSportsVise(response.data);
              } else {
                let matchesListData = {};
                matchesListData[this.currentSelectedSportInPlay.sport_id] = { sport_id: this.currentSelectedSportInPlay.sport_id, SportName: this.currentSelectedSportInPlay.name, matches: [] }
                this.matchesListDataInPlay = matchesListData;
              }
            }
          }
          else {
            this.retryMatches();
          }
        }, error => {
          this.retryMatches();
        });
      }

    }

  }

  convertMatchDataToSportsVise(data) {
    let matchDataSportsVise = {};

    //this.checkMatchesBackLayData(data);

    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      if (!(item.sport_id in matchDataSportsVise)) {
        matchDataSportsVise[item.sport_id] = { sport_id: item.sport_id, SportName: item.SportName, matches: [item] };
      } else {
        matchDataSportsVise[item.sport_id]['matches'].push(item);
      }
    }

    return matchDataSportsVise;

  }

  checkMatchesBackLayData(data) {


  }


  getObjectKeys(obj) {
    return Object.keys(obj);
  }

  timeConverter(UNIX_timestamp) {
    var date = new Date((UNIX_timestamp) * 1000);
    var selectedTime = this._sessionService.get('timezone_value_login');
    if (!isNullOrUndefined(selectedTime)) {
      var c = parseInt(selectedTime);
      var localUtcMillisec = date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + (c * 1000)
      date = new Date(localUtcMillisec);
    }
    return date;
  }

  openCmsPage(cms) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/cmspages/'], { queryParams: { id: cms.id } })
    );

    var w = 800;
    var h = 500;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);

    window.open(url, cms.title, 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  }
}
