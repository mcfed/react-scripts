'use strict';

const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const chalk = require('react-dev-utils/chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const paths = require('../../config/paths');
const configFactory = require('../../config/webpack.config.cjs');

const config = configFactory('production');
const useYarn = fs.existsSync(paths.yarnLockFile);
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
const cjsBuildPath = paths.appDistCjs;

module.exports = function() {
  const previousFileSizes = measureFileSizesBeforeBuild(cjsBuildPath);
  fs.emptyDirSync(cjsBuildPath);

  // copyPublicFolder();

  // Start the webpack build
  return previousFileSizes
    .then(e => build(e))
    .then(res => {
      const { warnings, previousFileSizes, stats } = res;
      if (warnings.length) {
        console.log(chalk.yellow('Compiled Commonjs with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled Commonjs successfully.\n'));
      }

      console.log('File sizes after gzip:\n');

      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        cjsBuildPath,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), cjsBuildPath);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    })
    .catch(err => {
      throw err;
    });
};

function build(previousFileSizes) {
  // We used to support resolving modules according to `NODE_PATH`.
  // This now has been deprecated in favor of jsconfig/tsconfig.json
  // This lets you use absolute paths in imports inside large monorepos:
  if (process.env.NODE_PATH) {
    console.log(
      chalk.yellow(
        'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
      )
    );
    console.log();
  }

  console.log('Creating an optimized production build for COMMONJS...');

  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, cjsBuildPath, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
