(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{bWso:function(e,n,i){"use strict";i.r(n);var l=i("CcnG"),t=i("pRC4"),o=i("4N8n"),r=i("Sy1n"),u=i("ZYCi"),s=i("t/Na"),a=function(){function e(e,n){this.http=e,this._sessionService=n,this.endpoint=this._sessionService.endpoint,this.endpoint2=this._sessionService.endpoint2}return e.prototype.getGameLobby=function(e){var n=new s.h;return Object.keys(e).forEach((function(i){n=n.append(i,e[i])})),this.http.post(this.endpoint2+"diamond/login",e,{headers:this._sessionService.setTokenHeader()})},e.prototype.callKeepAlive=function(e){var n=new s.h;return Object.keys(e).forEach((function(i){n=n.append(i,e[i])})),this.http.post(this.endpoint+"live-customer",e,{headers:this._sessionService.setTokenHeader()})},e.ngInjectableDef=l.S({factory:function(){return new e(l.W(s.c),l.W(t.a))},token:e,providedIn:"root"}),e}(),c=i("VnD/"),b=function(){function e(e,n,i,l,t){this._sessionService=e,this._lobbyService=n,this.sanitizer=i,this._sportService=l,this.route=t,this.safeSrc=null,this.loading=!1,this.lobbyName="",this.pipSub=null,this._sportService.isShowOneClick=!1,this.lobbyName=this._sessionService.get("match_name")}return e.prototype.ngOnDestroy=function(){null!=this.pipSub&&this.pipSub.unsubscribe()},e.prototype.ngOnInit=function(){var e=this;r.b?this._sessionService.gotoLoginPage():(this.pipSub=this.route.events.pipe(Object(c.a)((function(e){return e instanceof u.d}))).subscribe((function(){e._sportService.callBalance=1,e._sportService.getBalance(),e.callKeepAlive()})),this._sportService.callBalance=1,this._sportService.getBalance(),this.GetMarketList(),this.callKeepAlive())},e.prototype.GetMarketList=function(){var e=this;try{if(this.loading=!0,"/diamond-casino"==this.route.url){var n={gameId:this._sessionService.get("gameId")};this._lobbyService.getGameLobby(n).subscribe((function(n){if(e.loading=!1,!n.error){if("/diamond-casino"!=e.route.url)return;var i=n.data.url;null==e.safeSrc&&""!=i&&(e.safeSrc=e.sanitizer.bypassSecurityTrustResourceUrl(i),$("#lobby")[0].contentWindow.location.replace(i))}}),(function(n){e.loading=!1}))}else this.loading=!1}catch(i){this.loading=!1}},e.prototype.removeTimeOut=function(){null!=this.timerForKeepAlive&&(window.clearTimeout(this.timerForKeepAlive),this.timerForKeepAlive=null)},e.prototype.callKeepAlive=function(){var e=this;try{this.removeTimeOut(),this.timerForKeepAlive=setTimeout((function(){if("/lobbygame3"==e.route.url){if(null==e.safeSrc)return void e.callKeepAlive();e._lobbyService.callKeepAlive({type:"3"}).subscribe((function(n){if(n.error){if(101==n.code)return void e._sessionService.gotoDashboard();e.callKeepAlive()}else{if("/lobbygame3"!=e.route.url)return;e.callKeepAlive()}}),(function(n){e.callKeepAlive()}))}}),3e3)}catch(n){this.callKeepAlive()}},e}(),p=function(){return function(){}}(),h=i("pMnS"),d=i("iAfa"),f=i("RygT"),v=i("ZYjt"),g=l.nb({encapsulation:0,styles:[[""]],data:{}});function m(e){return l.Gb(0,[(e()(),l.pb(0,0,null,null,8,"div",[["class","mainDetailView"]],null,null,null,null,null)),(e()(),l.pb(1,0,null,null,1,"h4",[["class","bet-head"]],null,null,null,null,null)),(e()(),l.Eb(-1,null,["Diamond Casino"])),(e()(),l.pb(3,0,null,null,5,"div",[["class","bg-black-bx bg-black-bx-lobby"]],null,null,null,null,null)),(e()(),l.pb(4,0,null,null,1,"div",[["style","height: 100vh;"]],null,null,null,null,null)),(e()(),l.pb(5,0,null,null,0,"iframe",[["frameborder","0"],["id","lobby"],["marginheight","0"],["scrolling","auto"],["style","width: 100%; height: 100vh;"]],null,null,null,null,null)),(e()(),l.pb(6,0,null,null,2,"ngx-loading",[],null,null,null,d.b,d.a)),l.ob(7,114688,null,0,f.a,[f.c,l.h],{show:[0,"show"],config:[1,"config"]},null),l.Ab(8,{backdropBorderRadius:0})],(function(e,n){var i=n.component.loading,l=e(n,8,0,"3px");e(n,7,0,i,l)}),null)}function y(e){return l.Gb(0,[(e()(),l.pb(0,0,null,null,1,"app-lobbygame3",[],null,null,null,m,g)),l.ob(1,245760,null,0,b,[t.a,a,v.b,o.a,u.m],null,null)],(function(e,n){e(n,1,0)}),null)}var S=l.lb("app-lobbygame3",b,y,{},{},[]),x=i("Ip0R"),w=i("gIcY"),_=i("dU8u");i.d(n,"LobbygameModuleNgFactory",(function(){return A}));var A=l.mb(p,[],(function(e){return l.wb([l.xb(512,l.j,l.bb,[[8,[h.a,S]],[3,l.j],l.x]),l.xb(4608,x.n,x.m,[l.u,[2,x.B]]),l.xb(4608,w.D,w.D,[]),l.xb(4608,w.e,w.e,[]),l.xb(4608,s.j,s.p,[x.c,l.B,s.n]),l.xb(4608,s.q,s.q,[s.j,s.o]),l.xb(5120,s.a,(function(e){return[e]}),[s.q]),l.xb(4608,s.m,s.m,[]),l.xb(6144,s.k,null,[s.m]),l.xb(4608,s.i,s.i,[s.k]),l.xb(6144,s.b,null,[s.i]),l.xb(4608,s.f,s.l,[s.b,l.q]),l.xb(4608,s.c,s.c,[s.f]),l.xb(1073742336,x.b,x.b,[]),l.xb(1073742336,u.n,u.n,[[2,u.t],[2,u.m]]),l.xb(1073742336,w.A,w.A,[]),l.xb(1073742336,w.j,w.j,[]),l.xb(1073742336,w.w,w.w,[]),l.xb(1073742336,s.e,s.e,[]),l.xb(1073742336,s.d,s.d,[]),l.xb(1073742336,_.b,_.b,[]),l.xb(1073742336,f.b,f.b,[]),l.xb(1073742336,p,p,[]),l.xb(256,s.n,"XSRF-TOKEN",[]),l.xb(256,s.o,"X-XSRF-TOKEN",[]),l.xb(1024,u.k,(function(){return[[{path:"",component:b}]]}),[]),l.xb(256,"loadingConfig",{},[])])}))}}]);