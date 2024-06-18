import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './././layout/main-layout/main-layout.component'
import { HeaderComponent } from './././layout/header/header.component';
import { FooterComponent } from './././layout/footer/footer.component';
import { SidebarComponent } from './././layout/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
//import {LoginComponent} from './login/login.component';

const commanChildren: Routes = [
  {
    path: 'userdashboard',
    loadChildren: '../app/homepage-inner/home-inner.module#HomeInnerModule'
  },
  {
    path: 'dashboard',
    loadChildren: '../app/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'dashboard/:sportid',
    loadChildren: '../app/dashboard/dashboard.module#DashboardModule'
  },
  //  {
  //   path: 'details',
  //   loadChildren: '../app/details/details.module#DetailsModule'
  // },
  {
    path: 'cricket-details',
    loadChildren: '../app/cricket-details/details.module#DetailsModule'
  },
  {
    path: 'election-details',
    loadChildren: '../app/election-details/election.module#ElectionModule'
  },
  {
    path: 'soccer-details',
    loadChildren: '../app/soccer-details/soccers.module#SoccersModule'
  },
  {
    path: 'tennis-details',
    loadChildren: '../app/tennis-details/tennis.module#TennisModule'
  },
  {
    path: 'horse-details',
    loadChildren: '../app/horse-details/details.module#DetailsModule'
  },
  {
    path: 'greyhound-details',
    loadChildren: '../app/grey-hound/details.module#DetailsModule'
  },
  {
    path: 'cupbets',
    loadChildren: '../app/cupbets/cupbets.module#CupbetsModule'
  },
  {
    path: 'my-bets',
    loadChildren: '../app/my-bets/my-bets.module#MyBetsModule'
  },
  {
    path: 'pending-bets',
    loadChildren: '../app/pending-bets/pending-bets.module#PendingBetsModule'
  },
  {
    path: 'unsetteled-bet',
    loadChildren: '../app/unsetteled-bet/unsetteled-bet.module#UnsetteledBetModule'
  },
  {
    path: 'profit-loss',
    loadChildren: '../app/profit-loss/profit-loss.module#ProfitLossModule'
  },
  {
    path: 'account-statement',
    loadChildren: '../app/account-statement/account-statement.module#AccountStatementModule'
  },
  {
    path: 'transactions',
    loadChildren: '../app/dw-request/dw-request.module#DwRequestModule'
  },
  {
    path: 'support',
    loadChildren: '../app/support-request/support-request.module#SupportRequestModule'
  },
  {
    path: 'inplay',
    loadChildren: '../app/inplay/inplay.module#InplayModule'
  },
  {
    path: 'upcoming',
    loadChildren: '../app/upcoming/upcoming.module#UpcomingModule'
  },
  {
    path: 'favorite',
    loadChildren: '../app/favorite/favorite.module#FavoriteModule'
  },
  {
    path: 'my-markets',
    loadChildren: '../app/my-markets/my-markets.module#MyMarketsModule'
  },
  {
    path: 'teenpatti-oneday',
    loadChildren: '../app/teenpatti-oneday/teenpatti_oneday.module#TeenpattiOneDayModule'
  },
  {
    path: 'teenpatti-t20',
    loadChildren: '../app/teenpatti-t20/teenpatti_t20.module#TeenpattiT20Module'
  },
  {
    path: 'teenpatti-muflis',
    loadChildren: '../app/teenpatti-muflis/teenpatti_muflis.module#TeenpattiMuflisModule'
  },
  {
    path: 'teenpatti-test',
    loadChildren: '../app/teenpatti-test/teenpatti_test.module#TeenpattiTestModule'
  },
  {
    path: 'andarbahar',
    loadChildren: '../app/teenpatti-andarbahar/teenpatti_andarbahar.module#TeenpattiAndarBaharModule'
  },
  {
    path: 'poker',
    loadChildren: '../app/teenpatti-poker/teenpatti_poker.module#TeenpattiPokerModule'
  },
  {
    path: 'poker-6player',
    loadChildren: '../app/teenpatti-poker6player/teenpatti_poker6player.module#TeenpattiPoker6PlayerModule'
  },
  {
    path: '32cards',
    loadChildren: '../app/teenpatti-32cards/teenpatti_32cards.module#Teenpatti32CardsModule'
  },
  {
    path: 'hilow',
    loadChildren: '../app/teenpatti-hilow/teenpatti_hilow.module#TeenpattiHiLowModule'
  },
  {
    path: '7updown',
    loadChildren: '../app/teenpatti-7updown/teenpatti_7updown.module#Teenpatti7UpDownModule'
  },
  {
    path: 'aaa',
    loadChildren: '../app/teenpatti-aaa/teenpatti_aaa.module#TeenpattiAaaModule'
  },
  {
    path: 'dragon-tiger',
    loadChildren: '../app/teenpatti-dragontiger/teenpatti_dragontiger.module#TeenpattiDragonTigerModule'
  },
  {
    path: 'matka',
    loadChildren: '../app/teenpatti-matka/teenpatti_matka.module#TeenpattiMatkaModule'
  },
  {
    path: 'passa',
    loadChildren: '../app/teenpatti-passa/teenpatti_passa.module#TeenpattiPassaModule'
  },
  {
    path: 'lobbygame',
    loadChildren: '../app/lobbygame/lobbygame.module#LobbygameModule'
  },
  {
    path: 'lobbygame2',
    loadChildren: '../app/lobbygame2/lobbygame.module#LobbygameModule'
  },
  {
    path: 'diamond-casino',
    loadChildren: '../app/lobbygame3/lobbygame.module#LobbygameModule'
  },
  {
    path: 'lobbygame4',
    loadChildren: '../app/lobbygame4/lobbygame.module#LobbygameModule'
  },
  {
    path: 'matka-matches',
    loadChildren: '../app/matka-matches/matka-matches.module#MatkaMatchesModule'
  },
  {
    path: 'matka-detail',
    loadChildren: '../app/matka/matka-detail.module#MatkaDetailModule'
  },
  {
    path: 'titli-detail',
    loadChildren: '../app/titli/titli-detail.module#TitliDetailModule'
  },
  {
    path: 'setbutton-values',
    loadChildren: '../app/setbutton-values/setbutton-values.module#SetbuttonValuesModule'
  },
  {
    path: 'event/:eventname/:id',
    loadChildren: "../app/homepage/home.module#HomeModule"
  },
  {
    path: 'change-password',
    loadChildren: '../app/change-password/change-password.module#ChangePasswordModule'
  },
  {
    path: 'casino/games/:gamename',
    loadChildren: '../app/casino-slots-auth/casino-slots-auth.module#CasinoSlotsAuthModule'
  },
  {
    path: 'casino/games/slots',
    loadChildren: '../app/casino-slots-auth/casino-slots-auth.module#CasinoSlotsAuthModule'
  },
  {
    path: 'payment/deposit',
    loadChildren: '../app/depositpaymentoption/depositpaymentoption.module#DepositPaymentOptionModule'
  },
  {
    path: 'withdraw',
    loadChildren: '../app/withdraw-request/withdraw-request.module#WithdrawRequestModule'
  },
  {
    path: 'content/:pagename',
    loadChildren: '../app/cmspages/cmspages.module#CmsPagesModule'
  },
  {
    path: 'sport/:id',
    loadChildren: '../app/sports/sports.module#SportsModule'
  },
]

const loginPageOld: Routes = [
  {
    path: '',
    loadChildren: "../app/homepage/home.module#HomeModule"
  },
  {
    path: 'home',
    loadChildren: "../app/homepage/home.module#HomeModule"
  },
  {
    path: 'login',
    loadChildren: "../app/login/login.module#LoginModule"
  },
  {
    path: '',
    loadChildren: "../app/login/login.module#LoginModule"
  },
  {
    path: 'cmspages',
    loadChildren: '../app/cmspages/cmspages.module#CmsPagesModule'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: commanChildren
  },
];

const loginPageNew: Routes = [
  {
    path: 'home',
    loadChildren: "../app/homepage/home.module#HomeModule"
  },
  {
    path: 'login',
    loadChildren: "../app/loginnew/login.module#LoginModule"
  },
  {
    path: '',
    loadChildren: "../app/loginnew/login.module#LoginModule"
  },
  {
    path: 'cmspages',
    loadChildren: '../app/cmspages/cmspages.module#CmsPagesModule'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: commanChildren
  },
];

const loginPageNewSlider: Routes = [
  {
    path: 'login',
    loadChildren: "../app/loginnewslider/login.module#LoginModule"
  },
  {
    path: '',
    loadChildren: "../app/loginnewslider/login.module#LoginModule"
  },
  {
    path: 'cmspages',
    loadChildren: '../app/cmspages/cmspages.module#CmsPagesModule'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: commanChildren
  },
];

const homePage: Routes = [
  {
    path: '',
    loadChildren: "../app/homepage/home.module#HomeModule"
  },
  {
    path: 'home',
    loadChildren: "../app/homepage/home.module#HomeModule"
  },
  {
    path: 'login',
    loadChildren: "../app/login/login.module#LoginModule"
  },
  {
    path: 'register',
    loadChildren: "../app/signup/signup.module#SignupModule"
  },
  {
    path: 'page/:pagename',
    loadChildren: "../app/pages/pages.module#PagesModule"
  },
  {
    path: 'detail',
    loadChildren: '../app/home-cricket-details/details.module#DetailsModule'
  },
  {
    path: 'casinos/games/:gamename',
    loadChildren: '../app/casino-slots/casino-slots.module#CasinoSlotsModule'
  },
  {
    path: 'casinos/games/slots',
    loadChildren: '../app/casino-slots/casino-slots.module#CasinoSlotsModule'
  },
  // {
  //   path: 'provider/:providername/:providerid',
  //   loadChildren: '../app/casino-slots/casino-slots.module#CasinoSlotsModule'
  // },
  {
    path: 'inplay-matches',
    loadChildren: '../app/inplay-out/inplay-out.module#InplayOutModule'
  },
  {
    path: 'upcoming-matches',
    loadChildren: '../app/upcoming-matches/upcoming-matches.module#UpcomingMatchesModule'
  },
  {
    path: 'game/:id',
    loadChildren: '../app/sports-outer/sports-outer.module#SportsOuterModule'
  },
  // {
  //   path: 'tennis-details',
  //   loadChildren: '../app/tennis-details/tennis.module#TennisModule'
  // },
  {
    path: '',
    component: MainLayoutComponent,
    children: commanChildren
  },
];

@NgModule({
  //  declarations: [LoginComponent],
  imports: [
    RouterModule.forRoot(environment.loginPageType == 1 ? homePage : (environment.loginPageType == 2 ? loginPageNew : loginPageNewSlider), { onSameUrlNavigation: 'reload' }),
    BrowserModule,
    FormsModule, ReactiveFormsModule,

    // RouterModule.forRoot(appRoutes)
  ],
  declarations: [MainLayoutComponent, HeaderComponent, SidebarComponent, FooterComponent],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {

}
