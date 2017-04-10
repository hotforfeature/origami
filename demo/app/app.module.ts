import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PolymerModule } from '../../src/origami';
import { AppElementsModule } from '../../src/collections';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppElementsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    PolymerModule
  ],
  declarations: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
