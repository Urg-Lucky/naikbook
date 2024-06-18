import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SportsComponent } from './sports.component';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';

const routes: Routes = [
  {
    path: '',
    component: SportsComponent
  },
  {
    path: 'home',
    component: SportsComponent
  },
  {
    path: 'detail/:id',
    component: SportsComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    FormsModule, SlickCarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({})],
  declarations: [SportsComponent],
  exports: [RouterModule]
})

export class SportsModule {

}