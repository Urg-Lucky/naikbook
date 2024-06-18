import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from "./home.component";
import { LoginComponent } from "../login/login.component";
import { SignupComponent } from "../signup/signup.component";
import { NgxLoadingModule } from "ngx-loading";
import { HttpClientModule } from "@angular/common/http";
import { FooterComponent } from "../footer/footer.component";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { CarouselModule } from "ngx-bootstrap/carousel";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "detail/:id",
    component: HomeComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    CarouselModule.forRoot(),
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    FooterComponent,
    SignupComponent,
  ],
  exports: [RouterModule],
})
export class HomeModule {}
