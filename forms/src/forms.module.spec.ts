import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import '@polymer/paper-input/paper-input';
import { OrigamiFormsModule } from './forms.module';
import { OrigamiControlValueAccessor } from './value-accessor';

describe('forms', () => {
  describe('OrigamiFormsModule', () => {
    it('should declare OrigamiControlValueAccessor', () => {
      @Component({
        template: '<paper-input [(ngModel)]="value" origami></paper-input>'
      })
      class AppComponent {
        @ViewChild(OrigamiControlValueAccessor, { static: true })
        accessor?: OrigamiControlValueAccessor;
        value = 'foo';
      }

      TestBed.configureTestingModule({
        imports: [OrigamiFormsModule, FormsModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [AppComponent]
      });

      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance.accessor).toEqual(
        jasmine.any(OrigamiControlValueAccessor)
      );
    });
  });
});
