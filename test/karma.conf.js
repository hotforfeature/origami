module.exports = function(config) {
  const configuration = {
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-webpack'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-mocha-reporter')
    ],
    files: [
      { pattern: './test/karma-shim.js', watched: false },
      { pattern: './bower_components/webcomponentsjs/webcomponents-lite.js', watched: false },
      { pattern: './bower_components/polymer/polymer.html', watched: false },
      { pattern: './bower_components/**/*', watched: false, included: false, served: true }
    ],
    proxies: {
      '/bower_components/': '/base/bower_components/'
    },
    preprocessors: {
      './test/karma-shim.js': ['webpack']
    },
    webpack: require('./webpack.test.js'),
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['mocha', 'kjhtml', 'coverage-istanbul'],
    reportSlowerThan: 200,
    coverageIstanbulReporter: {
      reports: ['html', 'text-summary'],
      dir: 'coverage',
      fixWebpackSourcePaths: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  };

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    configuration.plugins.push(require('karma-sauce-launcher'));
    configuration.sauceLabs = {
      testName: 'Origami Karma'
    };

    configuration.customLaunchers = {
      sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 10',
        version: '56'
      },
      sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      }
    };

    configuration.browsers = Object.keys(configuration.customLaunchers);
  }

  config.set(configuration);
};
