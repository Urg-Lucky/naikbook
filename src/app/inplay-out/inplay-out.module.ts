import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InplayOutComponent } from './inplay-out.component';
import { LoginComponent } from '../login/login.component';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';

const routes: Routes = [
  {
    path: '',
    component: InplayOutComponent
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    FormsModule, SlickCarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({})],
  declarations: [InplayOutComponent],
  exports: [RouterModule]
})

export class InplayOutModule {

}