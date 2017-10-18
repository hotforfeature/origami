import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { PolymerModule } from '@codebakery/origami';

import { AppComponent } from './app.component';
import { FeaturesComponent } from './features/features.component';
import { VaadinComponent } from './vaadin/vaadin.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    PolymerModule.forRoot()
  ],
  declarations: [
    AppComponent,
    FeaturesComponent,
    VaadinComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
