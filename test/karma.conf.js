module.exports = function(config) {
  const IS_CI = Boolean(process.env.TRAVIS);
  const ES5 = Boolean(process.env.ES5);
  const COVERAGE = !IS_CI && !ES5;

  const configuration = {
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-safari-launcher'),
      require('karma-webpack'),
      require('karma-jasmine-html-reporter'),
      require('karma-mocha-reporter')
    ],
    files: [
      { pattern: './test/karma-shim.js', watched: false }
    ],
    preprocessors: {
      './test/karma-shim.js': ['webpack']
    },
    webpack: require('./webpack.test.js')({
      COVERAGE: COVERAGE
    }),
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['mocha', 'kjhtml'],
    port: 9876,
    colors: true,
    concurrency: 5,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    browserNoActivityTimeout: 60000,
    singleRun: true
  };

  const directory = ES5 ? './test/build/es5' : './test';
  const bowerDirectory = directory + '/bower_components';
  configuration.files.push(
    { pattern: bowerDirectory + '/webcomponentsjs/webcomponents-loader.js', watched: false },
    { pattern: directory + '/elements.html', watched: false },
    { pattern: bowerDirectory + '/**/*', watched: false, included: false, served: true }
  );

  if (COVERAGE) {
    configuration.plugins.push(require('karma-coverage-istanbul-reporter'));
    configuration.reporters.push('coverage-istanbul');
    configuration.coverageIstanbulReporter = {
      reports: ['html', 'text-summary'],
      dir: 'coverage',
      fixWebpackSourcePaths: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      }
    };
  }

  if (IS_CI) {
    configuration.plugins.push(require('karma-sauce-launcher'));
    configuration.sauceLabs = {
      testName: ES5 ? 'Origami Karma (ES5)' : 'Origami Karma'
    };

    if (ES5) {
      // IE11 takes a while and doesn't respond
      configuration.browserNoActivityTimeout = 5 * 60 * 1000;
      configuration.customLaunchers = {
        // Safari 9 support will drop when Safari 11 is released
        SL_Safari_9: {
          base: 'SauceLabs',
          browserName: 'safari',
          version: '9'
        },
        // Edge 13 support will drop when Edge 15 is released
        SL_Edge_13: {
          base: 'SauceLabs',
          browserName: 'MicrosoftEdge',
          version: '13'
        },
        SL_IE_11: {
          base: 'SauceLabs',
          browserName: 'internet explorer',
          version: '11'
        }
      };
    } else {
      configuration.customLaunchers = {
        SL_Chrome: {
          base: 'SauceLabs',
          browserName: 'chrome',
          version: 'latest'
        },
        SL_Chrome_Prev: {
          base: 'SauceLabs',
          browserName: 'chrome',
          version: 'latest-1'
        },
        SL_Firefox: {
          base: 'SauceLabs',
          browserName: 'firefox',
          version: 'latest'
        },
        SL_Firefox_Prev: {
          base: 'SauceLabs',
          browserName: 'firefox',
          version: 'latest-1'
        },
        SL_Safari: {
          base: 'SauceLabs',
          browserName: 'safari',
          version: 'latest'
        },
        // Add when Safari 11 released
        /*SL_Safari_Prev: {
          base: 'SauceLabs',
          browserName: 'safari',
          version: 'latest-1'
        },*/
        SL_Edge: {
          base: 'SauceLabs',
          browserName: 'MicrosoftEdge',
          version: 'latest'
        },
        // Add when Edge 15 released
        /*SL_Edge_Prev: {
          base: 'SauceLabs',
          browserName: 'MicrosoftEdge',
          version: 'latest-1'
        }*/
      };
    }

    configuration.browsers = Object.keys(configuration.customLaunchers);
    configuration.reporters.push('saucelabs');
  }

  config.set(configuration);
};
