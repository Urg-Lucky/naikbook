import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MatkaDetailComponent} from './matka-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxLoadingModule} from 'ngx-loading';
import {HttpClientModule} from '@angular/common/http';
import { HourMinSecPipe } from '../apppipes/hourminsecpipe.module';
import { JodinumberComponent } from './jodinumber/jodinumber.component';
import { JodirangeComponent } from './jodirange/jodirange.component';
import { JodicrossingComponent } from './jodicrossing/jodicrossing.component';


const routes: Routes = [
 { path: '', component: MatkaDetailComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
   FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HourMinSecPipe,
        NgxLoadingModule.forRoot({})],
  declarations: [MatkaDetailComponent, JodinumberComponent, JodirangeComponent, JodicrossingComponent],
  exports: [RouterModule]
})

export class MatkaDetailModule { }