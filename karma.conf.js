const package = require('./package.json');

module.exports = config => {
  const CI = Boolean(process.env.CI);
  const TRAVIS = Boolean(process.env.TRAVIS);
  const ES5 = Boolean(process.env.ES5);

  const conf = {
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './origami/test.ts' },
      { pattern: './origami/**/*.ts' }
    ],
    preprocessors: {
      './origami/**/*.ts': ['karma-typescript']
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /(test|\.spec).ts$/,
        resolve: {
          alias: {
            '@codebakery/origami': './dist/bundles/origami.umd.js'
          }
        }
      },
      compilerOptions: {
        baseUrl: '.',
        declaration: false,
        lib: ['es6', 'dom'],
        module: 'commonjs',
        paths: {
          '@codebakery/origami': ['dist/']
        },
        skipLibCheck: true,
        target: 'es5',
        types: ['jasmine']
      },
      coverageOptions: {
        exclude: /\.(d|spec|test)\.ts$|^mock*|index\.ts/,
        instrumentation: !CI
      },
      exclude: [
        'demo',
        'node_modules'
      ],
      reports: {
        html: {
          directory: 'reports',
          subdirectory: 'coverage'
        },
        'text-summary': ''
      }
    },
    htmlReporter: {
      outputDir: 'reports/html'
    },
    reporters: ['mocha', 'kjhtml', 'html', 'karma-typescript'],
    reporterSlowerThan: 200,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    browserNoActivityTimeout: 60 * 1000,
    browserDisconnectTimeout: 10 * 1000,
    browserDisconnectTolerance: 1,
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
    },
    concurrency: 5,
    singleRun: true,
    autoWatch: false
  };

  const directory = ES5 ? './test/build/es5' : './test';
  const bowerDirectory = directory + '/bower_components';
  if (ES5) {
    conf.files.push({
      pattern: bowerDirectory + '/webcomponentsjs/custom-elements-es5-adapter.js', watched: false
    });
  }

  conf.files.push(
    { pattern: bowerDirectory + '/webcomponentsjs/webcomponents-loader.js', watched: false },
    { pattern: directory + '/elements.html', watched: false },
    { pattern: bowerDirectory + '/**/*', watched: false, included: false, served: true }
  );

  if (CI) {
    // conf.plugins.push(require('karma-sauce-launcher'));
    conf.sauceLabs = {
      testName: ES5 ? 'Origami Karma (ES5)' : 'Origami Karma',
      startConnect: TRAVIS ? false : true,
      tunnelIdentifier: TRAVIS ? process.env.TRAVIS_JOB_NUMBER : undefined
    };

    if (ES5) {
      // IE11 takes a while and doesn't respond
      conf.browserNoActivityTimeout = 5 * 60 * 1000;
      conf.customLaunchers = {
        // Safari 9 support will drop when Safari 11 is released
        SL_Safari_9: {
          base: 'SauceLabs',
          browserName: 'safari',
          version: '9'
        },
        SL_IE_11: {
          base: 'SauceLabs',
          browserName: 'internet explorer',
          version: '11'
        }
      };
    } else {
      conf.customLaunchers = {
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
        SL_Edge_Prev: {
          base: 'SauceLabs',
          browserName: 'MicrosoftEdge',
          version: 'latest-1'
        }
      };
    }

    conf.browsers = Object.keys(conf.customLaunchers);
    conf.reporters.push('saucelabs');
  }

  config.set(conf);
};
