import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {HourminsecPipe} from "./hourminsecpipe.pipe";

@NgModule({
  declarations:[HourminsecPipe],
  imports:[CommonModule],
  exports:[HourminsecPipe]
})

export class HourMinSecPipe{}