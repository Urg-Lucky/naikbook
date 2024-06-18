import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CasinoSlotsAuthComponent } from './casino-slots-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
  { path: '', component: CasinoSlotsAuthComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxLoadingModule.forRoot({})],
  declarations: [CasinoSlotsAuthComponent],
  exports: [RouterModule]
})

export class CasinoSlotsAuthModule { }