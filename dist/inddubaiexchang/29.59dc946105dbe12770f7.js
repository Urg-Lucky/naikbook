(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{"6JVH":function(l,n,e){"use strict";e.r(n);var t=e("CcnG"),i=e("pRC4"),u=e("4N8n"),o=e("Sy1n"),s=e("ZYCi"),r=e("t/Na"),a=function(){function l(l,n){this.http=l,this._sessionService=n,this.endpoint=this._sessionService.endpoint,this.endpoint2=this._sessionService.endpoint2}return l.prototype.getGameLobbyStart=function(l){var n=new r.h;return Object.keys(l).forEach((function(e){n=n.append(e,l[e])})),this.http.post(this.endpoint2+"game-login",l,{headers:this._sessionService.setTokenHeader()})},l.prototype.getGameLobby=function(l){var n=new r.h;return Object.keys(l).forEach((function(e){n=n.append(e,l[e])})),this.http.post(this.endpoint+"game-start",l,{headers:this._sessionService.setTokenHeader()})},l.prototype.callKeepAlive=function(l){var n=new r.h;return Object.keys(l).forEach((function(e){n=n.append(e,l[e])})),this.http.post(this.endpoint+"live-customer",l,{headers:this._sessionService.setTokenHeader()})},l.ngInjectableDef=t.S({factory:function(){return new l(t.W(r.c),t.W(i.a))},token:l,providedIn:"root"}),l}(),c=e("VnD/"),b=function(){function l(l,n,e,t,i){this._sessionService=l,this._lobbyService=n,this.sanitizer=e,this._sportService=t,this.route=i,this.safeSrc=null,this.loading=!1,this.lobbyName="",this.gameName="",this.balance="",this.pipSub=null,this._sportService.isShowOneClick=!1,this.lobbyName=this._sessionService.get("match_name"),this.balance=this._sessionService.get("balance")}return l.prototype.ngOnDestroy=function(){null!=this.pipSub&&this.pipSub.unsubscribe()},l.prototype.ngOnInit=function(){var l=this;o.b?this._sessionService.gotoLoginPage():(this.pipSub=this.route.events.pipe(Object(c.a)((function(l){return l instanceof s.d}))).subscribe((function(){l._sportService.callBalance=1,l._sportService.getBalance(),l.callKeepAlive()})),this._sportService.callBalance=1,this._sportService.getBalance(),this.GetMarketList(),this.callKeepAlive())},l.prototype.GetMarketList=function(){var l=this;try{if(this.loading=!0,"/lobbygame"==this.route.url){var n={providerName:this._sessionService.get("provider_name"),gameId:this._sessionService.get("game_id")};this._lobbyService.getGameLobbyStart(n).subscribe((function(n){if(l.loading=!1,!n.error){if("/lobbygame"!=l.route.url)return;var e=n.data.url;l.gameName=l._sessionService.get("game_name"),null==l.safeSrc&&""!=e&&(l.safeSrc=l.sanitizer.bypassSecurityTrustResourceUrl(e),$("#lobby")[0].contentWindow.location.replace(e))}}),(function(n){l.loading=!1}))}else this.loading=!1}catch(e){this.loading=!1}},l.prototype.removeTimeOut=function(){null!=this.timerForKeepAlive&&(window.clearTimeout(this.timerForKeepAlive),this.timerForKeepAlive=null)},l.prototype.callKeepAlive=function(){var l=this;try{this.removeTimeOut(),this.timerForKeepAlive=setTimeout((function(){if("/lobbygame"==l.route.url){if(null==l.safeSrc)return void l.callKeepAlive();l._lobbyService.callKeepAlive({type:"1"}).subscribe((function(n){if(n.error){if(101==n.code)return void l._sessionService.gotoDashboard();l.callKeepAlive()}else{if("/lobbygame"!=l.route.url)return;l.callKeepAlive()}}),(function(n){l.callKeepAlive()}))}}),3e3)}catch(n){this.callKeepAlive()}},l}(),p=function(){return function(){}}(),h=e("pMnS"),v=e("Ip0R"),f=e("iAfa"),d=e("RygT"),g=e("ZYjt"),m=t.nb({encapsulation:0,styles:[[""]],data:{}});function y(l){return t.Gb(0,[t.zb(0,v.e,[t.u]),(l()(),t.pb(1,0,null,null,5,"div",[["class","mainDetailView"]],null,null,null,null,null)),(l()(),t.pb(2,0,null,null,1,"div",[["style","height: 100vh;padding-bottom: 30px;"]],null,null,null,null,null)),(l()(),t.pb(3,0,null,null,0,"iframe",[["border","0"],["frameborder","0"],["id","lobby"],["marginheight","0"],["scrolling","auto"],["style","width: 100%; height: 100vh;"]],null,null,null,null,null)),(l()(),t.pb(4,0,null,null,2,"ngx-loading",[],null,null,null,f.b,f.a)),t.ob(5,114688,null,0,d.a,[d.c,t.h],{show:[0,"show"],config:[1,"config"]},null),t.Ab(6,{backdropBorderRadius:0}),(l()(),t.pb(7,0,null,null,14,"div",[["class","bottom-sticky"]],null,null,null,null,null)),(l()(),t.pb(8,0,null,null,13,"div",[["class","navigation navigation02"]],null,null,null,null,null)),(l()(),t.pb(9,0,null,null,12,"ul",[["class","listWrap"]],null,null,null,null,null)),(l()(),t.pb(10,0,null,null,4,"li",[["class","list active"]],null,null,null,null,null)),(l()(),t.pb(11,0,null,null,3,"a",[["class","mobile-btn02 d-box"],["href","casino/games/roulette"]],null,null,null,null,null)),(l()(),t.pb(12,0,null,null,0,"i",[["class","fa fa-arrow-left mr-2"]],null,null,null,null,null)),(l()(),t.pb(13,0,null,null,1,"p",[],null,null,null,null,null)),(l()(),t.Eb(-1,null,["Back"])),(l()(),t.pb(15,0,null,null,6,"li",[["class","list d-flex"]],null,null,null,null,null)),(l()(),t.pb(16,0,null,null,3,"a",[["class","mobile-btn02"],["href","javascript:void(0)"]],null,null,null,null,null)),(l()(),t.pb(17,0,null,null,2,"p",[],null,null,null,null,null)),(l()(),t.Eb(18,null,["",""])),t.Bb(19,2),(l()(),t.pb(20,0,null,null,1,"a",[["class","mobile-btn logimg menu-toggle"],["href","javascript:void(0);"],["style","margin-top: 0;top: -5px; right: -15px;"]],null,null,null,null,null)),(l()(),t.pb(21,0,null,null,0,"i",[["class","fas fa-bars"]],null,null,null,null,null))],(function(l,n){var e=n.component.loading,t=l(n,6,0,"3px");l(n,5,0,e,t)}),(function(l,n){var e=n.component,i=t.Fb(n,18,0,l(n,19,0,t.yb(n,0),e.balance,"1.2-2"));l(n,18,0,i)}))}function S(l){return t.Gb(0,[(l()(),t.pb(0,0,null,null,1,"app-lobbygame",[],null,null,null,y,m)),t.ob(1,245760,null,0,b,[i.a,a,g.b,u.a,s.m],null,null)],(function(l,n){l(n,1,0)}),null)}var x=t.lb("app-lobbygame",b,S,{},{},[]),_=e("gIcY"),w=e("dU8u");e.d(n,"LobbygameModuleNgFactory",(function(){return k}));var k=t.mb(p,[],(function(l){return t.wb([t.xb(512,t.j,t.bb,[[8,[h.a,x]],[3,t.j],t.x]),t.xb(4608,v.n,v.m,[t.u,[2,v.B]]),t.xb(4608,_.D,_.D,[]),t.xb(4608,_.e,_.e,[]),t.xb(4608,r.j,r.p,[v.c,t.B,r.n]),t.xb(4608,r.q,r.q,[r.j,r.o]),t.xb(5120,r.a,(function(l){return[l]}),[r.q]),t.xb(4608,r.m,r.m,[]),t.xb(6144,r.k,null,[r.m]),t.xb(4608,r.i,r.i,[r.k]),t.xb(6144,r.b,null,[r.i]),t.xb(4608,r.f,r.l,[r.b,t.q]),t.xb(4608,r.c,r.c,[r.f]),t.xb(1073742336,v.b,v.b,[]),t.xb(1073742336,s.n,s.n,[[2,s.t],[2,s.m]]),t.xb(1073742336,_.A,_.A,[]),t.xb(1073742336,_.j,_.j,[]),t.xb(1073742336,_.w,_.w,[]),t.xb(1073742336,r.e,r.e,[]),t.xb(1073742336,r.d,r.d,[]),t.xb(1073742336,w.b,w.b,[]),t.xb(1073742336,d.b,d.b,[]),t.xb(1073742336,p,p,[]),t.xb(256,r.n,"XSRF-TOKEN",[]),t.xb(256,r.o,"X-XSRF-TOKEN",[]),t.xb(1024,s.k,(function(){return[[{path:"",component:b}]]}),[]),t.xb(256,"loadingConfig",{},[])])}))}}]);