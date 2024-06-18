import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxLoadingModule} from 'ngx-loading';
import {HttpClientModule} from '@angular/common/http';
import { HourMinSecPipe } from '../apppipes/hourminsecpipe.module';


const routes: Routes = [
  { path: '', component: DashboardComponent }
  // {
  //   path: '',
  //   component: MainLayoutComponent,
  //   children: [
  //    { path: '', component: DashboardComponent }
  //  ]
  // }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
   FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxLoadingModule.forRoot({}), HourMinSecPipe],
  declarations: [DashboardComponent],
  exports: [RouterModule]
})

export class DashboardModule { }