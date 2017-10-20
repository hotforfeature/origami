const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

const compilerOptions = require(root('tsconfig.json')).compilerOptions;
// TODO: ES5 and ES6 tests
compilerOptions.target = 'ES5';
compilerOptions.module = 'commonjs';
compilerOptions.declaration = false;
compilerOptions.silent = true;

const supportES2015 = compilerOptions.target === 'ES6';
module.exports = function(options) {
  const config = {
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [root('node_modules'), root('bower_components')]
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            // these packages have problems with their sourcemaps
            root('node_modules/rxjs'),
            root('node_modules/@angular')
          ]
        },
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          query: compilerOptions
        },
        {
          test: /\.html$/,
          use: [
            ...supportES2015 ? [] : [{
              loader: 'babel-loader',
              options: {
                presets: ['es2015']
              }
            }],
            { loader: 'polymer-webpack-loader' }
          ],
          include: [
            root('bower_components')
          ]
        },
        // Use script-loader for element js files
        {
          test: /\.js$/,
          use: [
            ...supportES2015 ? [] : [{
              loader: 'babel-loader',
              options: {
                presets: ['es2015']
              }
            }],
            { loader: 'script-loader' }
          ],
          include: [
            root('bower_components')
          ]
        },
        // Compile polymer-webpack-loader's RegisterHtmlTemplate to ES5
        ...supportES2015 ? [] : [{
          test: /register-html-template\.js$/,
          use: [
            supportES2015 ? undefined : {
              loader: 'babel-loader',
              options: {
                presets: ['es2015']
              }
            }
          ]
        }]
      ]
    },
    plugins: [
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        root('origami')
      ),
      new webpack.ProgressPlugin({ colors: true })
    ]
  };

  if (options.COVERAGE) {
    config.module.rules.push({
      enforce: 'post',
      test: /\.(js|ts)$/,
      loader: 'istanbul-instrumenter-loader',
      include: root('origami'),
      exclude: [
        /\.(e2e|spec)\.ts$/,
        /node_modules/
      ]
    });
  }

  return config;
}
