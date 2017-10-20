import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserModule,
  ɵDomSharedStylesHost as DomSharedStylesHost
} from '@angular/platform-browser';

import 'polymer/polymer.html';

import { PolymerDomSharedStylesHost } from './shared-styles-host';

@Component({
  selector: 'test-component',
  template: `<h1>Hello World</h1>`,
  styles: [
    `
    :host {
      --red: red;
      --mixin: {
        font-size: 10px;
      };
    }
    h1 {
      @apply --mixin;
      color: var(--red);
    }
    `
  ]
})
class TestComponent { }

describe('PolymerDomSharedStylesHost', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      declarations: [TestComponent],
      providers: [{
        provide: DomSharedStylesHost, useClass: PolymerDomSharedStylesHost
      }]
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should add <style>s to ShadyCSS', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      Array.from(document.head.querySelectorAll('style')).forEach((style: any) => {
        expect(style.__seenByShadyCSS).toBe(true);
      });

      done();
    });
  });

  it('should patch <body> to insert <style>s into the <head>', () => {
    const div = document.createElement('div');
    const style = document.createElement('style');
    document.body.insertBefore(div, document.body.firstChild);
    document.body.insertBefore(style, document.body.firstChild);
    const divInBody = div.parentNode === document.body;
    const styleInHead = style.parentNode === document.head;
    if (div.parentElement) {
      div.parentElement.removeChild(div);
    }

    if (style.parentElement) {
      style.parentElement.removeChild(style);
    }

    expect(divInBody).toBe(true);
    expect(styleInHead).toBe(true);
  });
});
