# Best practices

## Where should I import the `PolymerModule`?

You should treat the Origami modules like a “UI module” that needs to be everywhere the UI (that uses polymer) is. You really should import it and the collections once at the root level, though there won’t be any performance hit if you import it multiple times if you do that correctly. Angular can complain if you import a module twice by exporting it

Everything in the module is a directive except for `CustomStyleService`. Directives are instantiated at runtime, so there’s no extra performance of re-creating a service with them. The style service itself is pretty light and doesn’t do any sort of global state management, so there won’t be any side effects of instantiating it more than once

So if you have couple of sub modules to your `AppModule`:

```
- AppModule
  |
- AppComponent
  |
  _
    |
    - AuthModule
```
You need to import `PolymerModule` in every module, where you need it. So in this case in `AppModule` and `AuthModule`

## Do I need to import `PaperElementsModule` and `IronElementsModule`?

As far as paper vs iron, all the collection modules do is select the html tags. So if you use a `<paper-input>`, that relies on `<iron-input>`, you only need `PaperElementsModule` since you yourself don’t write any “iron-” element in an Angular template. Now, if you had a `<paper-input>` and an `<iron-list>`, you would need both collection modules.

There should also be 0 performance downsides to importing more collection modules. Your app bundle size will increase a few bytes and your startup may increase a few milliseconds. The collections can severely cut down on extra markup though, so you may end up actually saving a couple bytes on your bundle size for a large application with many polymer elements in its templates
