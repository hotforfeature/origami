import {
  ComponentFactoryResolver,
  NgModuleRef,
  RendererFactory2,
  Type,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { whenSet } from '@codebakery/origami/util';
import { importStyleModule } from './import-style-module';
import { IncludeStyles } from './include-styles';
import { styleToEmulatedEncapsulation } from './style-to-emulated-encapsulation';
import { getTypeFor, scanComponentFactoryResolver } from './type-selectors';

export function injectIncludeStyles(ngModule: NgModuleRef<any>): () => void {
  return () => {
    patchRendererFactory(ngModule.injector.get(RendererFactory2));
    scanComponentFactoryResolver(
      ngModule.injector.get(ComponentFactoryResolver)
    );
    const router = <Router>ngModule.injector.get(Router);
    router.events.subscribe(e => {
      if ('route' in e && !(<any>e.route)._loadedConfig) {
        whenSet(<any>e.route, '_loadedConfig', undefined, config => {
          scanComponentFactoryResolver(
            config.module.injector.get(ComponentFactoryResolver)
          );
        });
      }
    });
  };
}

const INJECTED_SELECTORS: string[] = [];

export function patchRendererFactory(factory: RendererFactory2) {
  const $createRenderer = factory.createRenderer;
  factory.createRenderer = function(element, type) {
    const selector = element && element.localName;
    if (selector && type && INJECTED_SELECTORS.indexOf(selector) === -1) {
      const styleModules = IncludeStyles.getStyleModulesFor(
        getTypeFor(selector)
      );
      let styles = styleModules.map(
        styleModule => importStyleModule(styleModule) || ''
      );
      switch (type.encapsulation) {
        case ViewEncapsulation.Emulated:
        default:
          styles = styles.map(style =>
            styleToEmulatedEncapsulation(style, type.id)
          );
          break;
        case ViewEncapsulation.Native:
        case ViewEncapsulation.None:
        case ViewEncapsulation.ShadowDom:
          break;
      }

      type.styles.push(...styles);
      INJECTED_SELECTORS.push(selector);
    }

    return $createRenderer.apply(this, arguments);
  };
}
