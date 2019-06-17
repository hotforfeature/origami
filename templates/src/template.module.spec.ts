import { Component, ViewChild, APP_INITIALIZER } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { shimHTMLTemplateAppend } from './shim-template-append';
import { TemplateDirective } from './template.directive';
import { TemplateModule, TEMPLATES_READY_PROVIDER } from './template.module';

describe('templates', () => {
  describe('TEMPLATES_READY_PROVIDER', () => {
    it('should provide APP_INITIALIZER using shimHTMLTemplateAppend', () => {
      expect(TEMPLATES_READY_PROVIDER).toEqual({
        provide: APP_INITIALIZER,
        multi: true,
        useValue: shimHTMLTemplateAppend
      });
    });
  });

  describe('TemplateModule', () => {
    @Component({
      selector: 'test-component',
      template: '<template></template>'
    })
    class TestComponent {
      @ViewChild(TemplateDirective, { static: true })
      templateDirective?: TemplateDirective;
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TemplateModule],
        declarations: [TestComponent]
      });
    });

    it('should declare TemplateDirective', () => {
      const fixture = TestBed.createComponent(TestComponent);
      expect(fixture.componentInstance.templateDirective).toEqual(
        jasmine.any(TemplateDirective)
      );
    });

    it('should include shimHTMLTemplateAppend in APP_INITIALIZER', () => {
      const initializers = TestBed.get(APP_INITIALIZER);
      expect(initializers).toContain(shimHTMLTemplateAppend);
    });
  });
});
