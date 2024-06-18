import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { SportServiceService } from '../service/sport-service.service';
import { browserRefresh } from '../app.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { LobbygameService } from './lobbygame.services';
import { filter } from 'rxjs/operators';


declare var $: any;


@Component({
  selector: 'app-lobbygame4',
  templateUrl: './lobbygame.component.html',
  styleUrls: ['./lobbygame.component.css']
})
export class LobbygameComponent implements OnInit {

  lobbyName='';

  constructor(private _sessionService: SessionService,
    public _lobbyService: LobbygameService,
    private sanitizer: DomSanitizer,
    private _sportService: SportServiceService, 
    public route: Router) {
    this._sportService.isShowOneClick = false;
    this.lobbyName=this._sessionService.get('match_name');
    
  }

  ngOnDestroy() {
    if(this.pipSub!=null){
      this.pipSub.unsubscribe();
    }
  }

  pipSub: any = null;

  ngOnInit() {
    if (browserRefresh) {
      this._sessionService.gotoLoginPage();
      return;
    }

    this.pipSub = this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this._sportService.callBalance=1;
      this._sportService.getBalance();

    });

    this._sportService.callBalance = 1;
    this._sportService.getBalance();
  }

}
