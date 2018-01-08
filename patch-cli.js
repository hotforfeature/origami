const fs = require('fs');
const path = require('path');

const commonPath = path.resolve(__dirname, '../../@angular/cli/models/webpack-configs/common.js');
const stylesPath = path.resolve(__dirname, '../../@angular/cli/models/webpack-configs/styles.js');

let data = fs.readFileSync(commonPath, 'utf8');
if (!data.includes('/* Origami Patched */')) {
  data = '/* Origami Patched */\n' + data;
  data = data.replace(/(modules:\s*\[)/g, '$1path.resolve(appRoot, \'bower_components\'), ');
  data = data.replace(/{.*html\$.*},/, `
    // Use polymer-webpack-loader for element html files and raw-loader for all
    // other Angular html files
    {
      test: /\.html$/,
      loader: 'raw-loader',
      exclude: [
        path.resolve(appRoot, 'bower_components'),
        path.resolve(appRoot, 'elements')
      ]
    },
    {
      test: /\.html$/,
      use: [
        ...wco.supportES2015 ? [] : [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }],
        { loader: 'polymer-webpack-loader' }
      ],
      include: [
        path.resolve(appRoot, 'bower_components'),
        path.resolve(appRoot, 'elements')
      ]
    },
    // Use script-loader for element js files
    {
      test: /\.js$/,
      use: [
        ...wco.supportES2015 ? [] : [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }],
        { loader: 'script-loader' }
      ],
      include: [
        path.resolve(appRoot, 'bower_components'),
        path.resolve(appRoot, 'elements')
      ]
    },
    // Compile polymer-webpack-loader's RegisterHtmlTemplate to ES5
    ...wco.supportES2015 ? [] : [{
      test: /register-html-template\.js$/,
      use: [
        wco.supportES2015 ? undefined : {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      ]
    }],
  `);

  fs.writeFileSync(commonPath, data);
}

data = fs.readFileSync(stylesPath, 'utf8');
if (!data.includes('/* Origami Patched */')) {
  data = '/* Origami Patched */\n' + data;
  data = data.replace(/(customProperties\({)/, '$1 warnings: false,');
  fs.writeFileSync(stylesPath, data);
}
