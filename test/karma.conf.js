module.exports = function(config) {
  config.set({
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
      { pattern: './test/karma-shim.js', watched: false }
    ],
    preprocessors: {
      './test/karma-shim.js': ['webpack']
    },
    webpack: require('./webpack.test.js'),
    webpackMiddleware: { stats: 'errors-only'},
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
  });
};
