module.exports = function(config) {
  const CI = Boolean(process.env.CI);
  const ES5 = Boolean(process.env.ES5);
  const IE11 = Boolean(process.env.IE11);
  const TRAVIS = Boolean(process.env.TRAVIS);
  const COVERAGE = !CI;

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
      './bower_components/webcomponentsjs/webcomponents-loader.js',
      { pattern: './bower_components/**/*', watched: false, included: false, served: true },
      { pattern: './test/karma-shim.js', watched: false }
    ],
    preprocessors: {
      './test/karma-shim.js': ['webpack']
    },
    webpack: require('./webpack.test.js')({
      COVERAGE
    }),
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['mocha', 'kjhtml'],
    reportSlowerThan: 200,
    port: 9876,
    colors: true,
    concurrency: 5,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    browserNoActivityTimeout: 60 * 1000,
    browserDisconnectTimeout: 10 * 1000,
    browserDisconnectTolerance: 1,
    captureTimeout: 4 * 60 * 1000,
    singleRun: true,
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222',
        ]
      }
    }
  };

  if (ES5 && !IE11) {
    configuration.files.splice(0, 0,
      './bower_components/webcomponentsjs/custom-elements-es5-adapter.js');
  }

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

  if (CI) {
    configuration.plugins.push(require('karma-sauce-launcher'));
    configuration.sauceLabs = {
      testName: ES5 ? 'Origami Karma (ES5)' : 'Origami Karma',
      startConnect: TRAVIS ? false : true,
      tunnelIdentifier: TRAVIS ? process.env.TRAVIS_JOB_NUMBER : undefined
    };

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
      SL_Safari_Prev: {
        base: 'SauceLabs',
        browserName: 'safari',
        version: 'latest-1'
      },
      SL_Edge: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        version: 'latest'
      },
      SL_Edge_Prev: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        version: 'latest-1'
      }
    };

    if (ES5 && IE11) {
      configuration.sauceLabs.testName += ' (IE11)';
      // IE11 takes a while and doesn't respond
      configuration.browserNoActivityTimeout = 5 * 60 * 1000;
      configuration.customLaunchers = {
        SL_IE_11: {
          base: 'SauceLabs',
          browserName: 'internet explorer',
          version: '11'
        }
      };
    }

    configuration.browsers = Object.keys(configuration.customLaunchers);
    configuration.reporters.push('saucelabs');
  }

  config.set(configuration);
};
