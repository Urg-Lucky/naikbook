import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TeenpattiOneDayComponent} from './teenpatti_oneday.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxLoadingModule} from 'ngx-loading';
import {HttpClientModule} from '@angular/common/http';


const routes: Routes = [
 { path: '', component: TeenpattiOneDayComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
   FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxLoadingModule.forRoot({})],
  declarations: [TeenpattiOneDayComponent],
  exports: [RouterModule]
})

export class TeenpattiOneDayModule { }