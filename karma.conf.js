module.exports = config => {
  const SAUCE = Boolean(process.env.SAUCE);
  const TRAVIS = Boolean(process.env.TRAVIS);
  const SAUCE_BROWSERS = {
    SL_Chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest'
    },
    SL_Firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest'
    },
    SL_Safari: {
      base: 'SauceLabs',
      browserName: 'safari',
      version: 'latest'
    },
    SL_Edge: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      version: 'latest'
    },
    SL_IE_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    }
  };

  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'init.spec.ts',
      '{forms,polyfills,shadycss,src,templates,util}/**/*.ts'
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        exclude: ['@polymer/polymer/interfaces'],
        transforms: [require('karma-typescript-es6-transform')()]
      },
      compilerOptions: {
        lib: ['dom', 'es6'],
        module: 'commonjs',
        target: 'es5'
      },
      coverageOptions: {
        exclude: [/\.(d|spec|test)\.ts$/i, /public_api/]
      },
      reports: {
        html: 'coverage',
        'text-summary': ''
      },
      tsconfig: './tsconfig.json'
    },
    sauceLabs: {
      testName: 'Origami Karma',
      startConnect: TRAVIS ? false : true,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
    },
    client: {
      clearContext: false
    },
    reporters: ['mocha', 'kjhtml', 'karma-typescript'],
    reportSlowerThan: 200,
    browsers: ['Chrome'],
    concurrency: 5,
    customLaunchers: {
      ...SAUCE_BROWSERS
    }
  });

  if (SAUCE) {
    config.reporters.push('saucelabs');
    config.set({
      browsers: Object.keys(SAUCE_BROWSERS)
    });
  }
};
