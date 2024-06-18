import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SportsOuterComponent } from './sports-outer.component';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';

const routes: Routes = [
  {
    path: '',
    component: SportsOuterComponent
  },
  {
    path: 'home',
    component: SportsOuterComponent
  },
  {
    path: 'detail/:id',
    component: SportsOuterComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    FormsModule, SlickCarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({})],
  declarations: [SportsOuterComponent],
  exports: [RouterModule]
})

export class SportsOuterModule {

}