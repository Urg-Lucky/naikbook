import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../../layout/header/header.component";
import { Router, ActivatedRoute } from "@angular/router";
import { SportServiceService } from "../../service/sport-service.service";
import { isNullOrUndefined } from "util";
import { LoginServiceService } from "src/app/service/login-service.service";

declare var $;
@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.css"],
})
export class MainLayoutComponent implements OnInit {
  dashboardClass = "detailContant";
  dashboardClass2 = "";
  isSliderShow = false;
  banner: any;
  bannerMobile: any;
  imagess: any;
  slides: any;

  constructor(
    private router: Router,
    public _sportService: SportServiceService,
    private imageslist: LoginServiceService,
    private logind: LoginServiceService,
    private bannerlist: LoginServiceService
  ) {}

  ngOnInit() {
    if (this.router.url == "/userdashboard") {
      this.dashboardClass = "mainContant";
      this.isSliderShow = true;
    }
    if (this.router.url == "/lobbygame" || this.router.url == "/lobbygame2") {
      this.dashboardClass2 = "lobbypage";
    }
    this.imageslist.getCasinoList().subscribe(
      (response) => {
        this.slides = response.data.liveCasinoList;
        // console.log(this.slides);
      },
      (error) => {
        // console.error(error);
      }
    );

    this.bannerlist.getbannerList().subscribe(
      (response) => {
        this.imagess = response.data;
        //  console.log(this.imagess);
      },
      (error) => {
        //        console.error(error);
      }
    );
  }

  closeSideMenu() {
    $("body").removeClass("mobile-show");
  }
  // getBanner() {
  //   var sdata = { 'domain_id': 1 };
  //   this._sportService.getBanner(sdata).subscribe(data => {
  //     var result = data.data;
  //     if (isNullOrUndefined(result)) {
  //       return;
  //     } else {
  //       this.banner = result;
  //     }
  //   }, (error) => {

  //   })
  // }

  // getBannerMobile() {
  //   var sdata = { 'domain_id': 1 };
  //   this._sportService.getBannerMobile(sdata).subscribe(data => {
  //     var result = data.data;
  //     if (isNullOrUndefined(result)) {
  //       return;
  //     } else {
  //       this.bannerMobile = result;
  //     }
  //   }, (error) => {

  //   })
  // }
}
