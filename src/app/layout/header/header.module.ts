import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,],
    declarations: [],
    exports: [RouterModule]
})

export class HeaderModule {

}