import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams} from '@angular/common/http';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
declare var $ :any;
@Injectable({ 
  providedIn: 'root'
})
export class LobbygameService {

  constructor(private http: HttpClient,private _sessionService:SessionService) { }
  endpoint =this._sessionService.endpoint;
  
}