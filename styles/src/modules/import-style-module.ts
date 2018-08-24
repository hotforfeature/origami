import { DomModule } from '@polymer/polymer/lib/elements/dom-module';

const CACHED_STYLE_MODULES = new Map<string, string | undefined>();

export function importStyleModule(styleModule: string): string | undefined {
  if (!CACHED_STYLE_MODULES.has(styleModule)) {
    const styleTemplate = <HTMLTemplateElement | undefined>(
      DomModule.import(styleModule, 'template')
    );
    if (styleTemplate) {
      const styles = styleTemplate.content.querySelectorAll('style');
      CACHED_STYLE_MODULES.set(
        styleModule,
        Array.from(styles)
          .map(style => style.innerText)
          .join('\n')
      );
    } else {
      CACHED_STYLE_MODULES.set(styleModule, undefined);
    }
  }

  return CACHED_STYLE_MODULES.get(styleModule);
}
