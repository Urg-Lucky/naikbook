import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpcomingMatchesComponent } from './upcoming-matches.component';
import { LoginComponent } from '../login/login.component';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { HeaderComponent } from '../layout/header/header.component';

const routes: Routes = [
  {
    path: '',
    component: UpcomingMatchesComponent
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    FormsModule, SlickCarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({})],
  declarations: [UpcomingMatchesComponent],
  exports: [RouterModule]
})

export class UpcomingMatchesModule {

}