import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LobbygameComponent} from './lobbygame.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxLoadingModule} from 'ngx-loading';
import {HttpClientModule} from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
 { path: '', component: LobbygameComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
   FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        InfiniteScrollModule,
        NgxLoadingModule.forRoot({})],
  declarations: [LobbygameComponent],
  exports: [RouterModule]
})

export class LobbygameModule { }