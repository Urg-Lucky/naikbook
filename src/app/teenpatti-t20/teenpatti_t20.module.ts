import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TeenpattiT20Component} from './teenpatti_t20.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxLoadingModule} from 'ngx-loading';
import {HttpClientModule} from '@angular/common/http';


const routes: Routes = [
 { path: '', component: TeenpattiT20Component }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
   FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxLoadingModule.forRoot({})],
  declarations: [TeenpattiT20Component],
  exports: [RouterModule]
})

export class TeenpattiT20Module { }