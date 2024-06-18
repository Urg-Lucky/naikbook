import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TitliDetailComponent} from './titli-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxLoadingModule} from 'ngx-loading';
import {HttpClientModule} from '@angular/common/http';
import { HourMinSecPipe } from '../apppipes/hourminsecpipe.module';
import { TitlipopupComponent } from './titlipopup/titlipopup.component';

const routes: Routes = [
 { path: '', component: TitliDetailComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
   FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HourMinSecPipe,
        NgxLoadingModule.forRoot({})],
  declarations: [TitliDetailComponent, TitlipopupComponent],
  exports: [RouterModule]
})

export class TitliDetailModule { }