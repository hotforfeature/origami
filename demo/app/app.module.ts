import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PolymerModule } from '../origami/origami';
import { AppElementsModule, IronElementsModule, PaperElementsModule } from '../origami/collections';

import { AppComponent } from './app.component';
import { FeaturesComponent } from './features/features.component';

@NgModule({
  imports: [
    AppElementsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    IronElementsModule,
    PaperElementsModule,
    PolymerModule
  ],
  declarations: [
    AppComponent,
    FeaturesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
