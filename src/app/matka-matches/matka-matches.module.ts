import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatkaMatchesComponent } from './matka-matches.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HourMinSecPipe } from '../apppipes/hourminsecpipe.module';

const routes: Routes = [
  { path: '', component: MatkaMatchesComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxLoadingModule.forRoot({}), HourMinSecPipe],
  declarations: [MatkaMatchesComponent],
  exports: [RouterModule]
})

export class MatkaMatchesModule { }