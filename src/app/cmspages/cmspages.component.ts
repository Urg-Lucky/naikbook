import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { LoginServiceService } from '../service/login-service.service';
import { browserRefresh } from '../app.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CmsPagesService } from './cmspages.services';
import { filter } from 'rxjs/operators';
import { isArray } from 'util';


declare var $: any;


@Component({
  selector: 'app-cmspages',
  templateUrl: './cmspages.component.html',
  styleUrls: ['./cmspages.component.css']
})
export class CmsPagesComponent implements OnInit {



  outerPagesListData = null;
  mycmsContent: any = "";
  mycmsTitle = "";

  constructor(private loginservice: LoginServiceService, private router: Router, private _sessionService: SessionService, private activatedRoute: ActivatedRoute) {

  }

  ngOnDestroy() {
    if (this.pipSub != null) {
      this.pipSub.unsubscribe();
    }
  }

  pipSub: any = null;

  ngOnInit() {

    let pagename = this.activatedRoute.snapshot.params['pagename'];
    this.getOuterPagesDetails(pagename);
    this.getOuterPages();
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

  getOuterPagesDetails(cmsId) {
    var data = {
      id: cmsId
    }

    this.loginservice.outerPagesDetails(data).subscribe(response => {

      if (!response.error) {
        if (response.data != null) {
          this.mycmsTitle = response.data.title;
          window.document.title = this.mycmsTitle;
          this.mycmsContent = response.data.body;

        }
      }
      else {

      }
    }, error => {

    });
  }

  openCmsPage(cms) {
    this.router.navigate(['/cmspages/'], { queryParams: { id: cms.id } });
  }

}
