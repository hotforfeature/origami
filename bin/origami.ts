#!/usr/bin/env node
import * as ProgressBar from 'progress';
import * as yargs from 'yargs';
import { error, info } from './lib/log';
import { polyfill } from './lib/polyfill/polyfill';
import { prepare } from './lib/prepare';
import { getPackagePaths } from './lib/package-util';

yargs
  .command(
    'prepare <target> <packages...>',
    'Prepare dependencies for ES5 or ES2015 building',
    yargs => {
      return yargs
        .positional('target', {
          describe: 'compile target',
          choices: ['es5', 'es2015', 'es6']
        })
        .positional('packages', {
          describe: 'packages to prepare',
          type: 'string'
        })
        .option('force', {
          alias: 'f',
          describe: 'force re-compile',
          type: 'boolean'
        });
    },
    async argv => {
      const packagePaths = getPackagePaths(argv.packages);
      if (!packagePaths.length) {
        error(
          'There are no NPM package directories that match the paths',
          true
        );
      } else {
        const isEs5 = argv.target === 'es5';
        const target = isEs5 ? 'ES5' : 'ES2015';
        info(`Preparing ${target} dependencies`);
        const progress = new ProgressBar(
          ':current/:total :bar',
          packagePaths.length
        );
        let fatal = false;
        for (let packagePath of packagePaths) {
          try {
            progress.tick();
            await prepare(packagePath, { es5: isEs5, force: argv.force });
          } catch (err) {
            fatal = true;
            console.log('\n');
            error(err, true);
          }
        }

        if (!fatal) {
          info(`${target} dependencies ready`);
        }
      }
    }
  )
  .command(
    'polyfill [appNames...]',
    'Add polyfills to all or the specified apps',
    yargs => {
      return yargs.positional('appNames', {
        describe: 'angular.json or .angular-cli.json projects/apps to polyfill'
      });
    },
    async argv => {
      try {
        await polyfill(argv.appNames);
        if (argv.appNames.length) {
          info(`Added polyfills to ${argv.appNames.join(',')}`);
        } else {
          info('Added polyfills to all apps');
        }
      } catch (err) {
        error(err);
        error('Failed to add polyfills', true);
      }
    }
  )
  .help()
  .demandCommand()
  .parse();
