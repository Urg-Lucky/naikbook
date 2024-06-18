import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SessionService } from '../../service/session.service';
import { SportServiceService } from '../../service/sport-service.service';
import { isNullOrUndefined } from 'util';
declare var $;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit {
  time = new Date();
  isHeaderShow = true;
  isFooterShow = false;
  constructor(public _sessionService: SessionService, private sanitizer: DomSanitizer, private route: Router, public _sportService: SportServiceService) {
    //this.name = _Service.val;
  }
  ngAfterViewInit() {
  }
  ngOnInit() {
    if (this.route.url == '/userdashboard') {
      this.isFooterShow = true;
    }

    if (this.route.url == '/lobbygame' || this.route.url == '/lobbygame2' || this.route.url == '/support') {
      this.isHeaderShow = false;
    }
  }
}