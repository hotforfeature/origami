# New Build!

This build process is still somewhat experimental and need more support from the Angular CLI team. In the meantime, the `node_modules_override` folder contains the modifications needed to the Angular CLI project to support the build process without using `ng eject`.

If you do not wish to use this ideology, you can `ng eject` your webpack config, then add the modifications to your ejected config. The key parts are commented with `// OVERRIDE`.

Here are the basic steps to take when changing from the old build process to the new one:

1. Move `src/assets/bower_components/` to `src/bower_components/`. Angular will no longer include these files by default, so anything that you *do not* import at compile time (such as webcomponents polyfills or dynamic imports) will need to be declared in `.angular-cli.json` as assets.

2. Create two separate `tsconfig.json` files, one for ES5 and one for ES6. Due to a [bug with the Angular compiler](https://github.com/angular/angular-cli/issues/7797), you should serve ES5 for the moment. The built ES5 and ES6 will work properly. You will also want to create two "apps" in `.angular-cli.json`, one for ES5 and one for ES6.

