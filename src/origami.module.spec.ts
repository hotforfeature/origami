import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OrigamiFormsModule } from '@codebakery/origami/forms';
import { WebComponentsReadyModule } from '@codebakery/origami/polyfills';
import {
  IncludeStylesModule,
  ShadyCSSModule
} from '@codebakery/origami/styles';
import { TemplateModule } from '@codebakery/origami/templates';
import { OrigamiModule } from './origami.module';

describe('OrigamiModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrigamiModule, RouterTestingModule]
    });
  });

  it('should export OrigamiFormsModule', () => {
    expect(TestBed.get(OrigamiFormsModule)).toBeTruthy();
  });

  it('should export IncludeStylesModule', () => {
    expect(TestBed.get(IncludeStylesModule)).toBeTruthy();
  });

  it('should export ShadyCSSModule', () => {
    expect(TestBed.get(ShadyCSSModule)).toBeTruthy();
  });

  it('should export TemplateModule', () => {
    expect(TestBed.get(TemplateModule)).toBeTruthy();
  });

  it('should export WebComponentsReadyModule', () => {
    expect(TestBed.get(WebComponentsReadyModule)).toBeTruthy();
  });
});
