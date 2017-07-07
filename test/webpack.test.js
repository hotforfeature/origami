const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

const tsconfig = require(root('tsconfig.json'));
tsconfig.sourceMap = false;
tsconfig.inlineSourceMap = true;
tsconfig.module = 'commonjs';
tsconfig.silent = true;
tsconfig.declaration = false;

module.exports = function(options) {
  const config = {
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [root('origami'), 'node_modules']
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
          query: tsconfig
        }
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
