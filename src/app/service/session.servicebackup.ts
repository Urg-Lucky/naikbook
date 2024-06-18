import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { HttpHeaders } from '@angular/common/http';
declare var $ :any;

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  notifier: NotifierService;
  constructor(notifierService: NotifierService) { 
    this.notifier=notifierService;
  }
  SQUAD:any=[];
  ActiveSquad:any={};
  TeamNumber=0;
  TeamId=0;
  endpoint ='http://172.105.42.201:3003/api/v1/';
   public dataLimit=15;
 
  set(key,value){			
			return localStorage.setItem(key,value);	
		}
		get(key){
			return localStorage.getItem(key);
		}
		destroy(key){
			return localStorage.removeItem(key);
		}
    isLoggedIn(key){
      
      if(localStorage.getItem(key)!=null && localStorage.getItem(key)!=undefined && localStorage.getItem(key)!='')
      {
        return true;
      }
      else{
        return false;
      }
    }
  
    setHeader(){
let headers = new HttpHeaders({ 
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
         'lang':'eng',
         'device-id':'12',
          'devicetype':'W',
          'deviceinfo':'12',
          'appinfo':'12'
        });
        return headers;
}
    setTokenHeader(){
    
let headers = new HttpHeaders({ 
         'Content-Type': 'application/json',
          'Authorization':'Bearer '+this.get('slug')
        });
        return headers;
}

    setTokenHeaderNew(){
        let headers = new HttpHeaders({
/*
            'Content-Type': 'application/json',
*/
            'lang':'eng',
            'device-id':'12',
            'devicetype':'W',
            'deviceinfo':'12',
            'appinfo':'12'

        });
        return headers;
    }
        setTokenHeaderPlus(){
        let headers = new HttpHeaders({
            'lang':'eng',
            'device-id':'12',
            'devicetype':'W',
            'deviceinfo':'12',
            'appinfo':'12',
          'token':this.get('slug')

        });
        return headers;
    }

    setTokenHeadertext(){
        let headers = new HttpHeaders({
            'Accept': 'text/html',
 	        	'lang':'eng',
            'device-id':'12',
            'devicetype':'W',
            'deviceinfo':'12',
            'appinfo':'12',
          'token':this.get('slug')

        });

        return headers;
    }

getBalance(){
  var loginData=JSON.parse(this.get('loginData'));
  if(loginData!=undefined)
  {
    var wallet=loginData.wallet;
    var total= (parseFloat(wallet.deposit_wallet)+parseFloat(wallet.winning_wallet)+parseFloat(wallet.bonus_wallet));
    return total;
  }
  else{
    return 0;
  }
}
    getNotification(){
        var loginData=JSON.parse(this.get('loginData'));
        if(loginData!=undefined)
        {
            var notification=loginData.notification_counter;

            return notification;
        }
        else{
            return 0;
        }
    }
}
