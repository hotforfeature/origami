const fs = require('fs');
const path = require('path');

const commonPath = path.resolve(__dirname, '../../@angular/cli/models/webpack-configs/common.js');
const stylesPath = path.resolve(__dirname, '../../@angular/cli/models/webpack-configs/styles.js');

let data = fs.readFileSync(commonPath, 'utf8');
if (!data.includes('/* Origami Patched */')) {
  data = '/* Origami Patched */\n' + data;
  data = data.replace(/(appRoot =.*;)/, `$1
    /* origami patch start */
    const polymerDirs = [
      path.resolve(appRoot, '../node_modules/@polymer'),
      path.resolve(projectRoot, '../node_modules/@polymer')
    ];

    /* origami patch end */
  `);
  data = data.replace(/(modules:\s*\[)/g, '$1/* origami patch start */...polymerDirs, /* origami patch end */');
  data = data.replace(/({.*html\$.*}),/, `
    /* origami patch start */
    /*
    $1
    */
    // Use babel-loader for element html files and raw-loader for all
    // other Angular html files
    {
      test: /\.html$/,
      loader: 'raw-loader',
      exclude: [
        ...polymerDirs,
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
        { loader: 'babel-loader' }
      ],
      include: [
        ...polymerDirs,
        path.resolve(appRoot, 'elements')
      ]
    },
    // Use babel-loader for element js files
    {
      test: /\.js$/,
      use: [
        ...wco.supportES2015 ? [] : [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }],
        { loader: 'babel-loader' }
      ],
      include: [
        ...polymerDirs,
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
    /* origami patch end */
  `);

  fs.writeFileSync(commonPath, data);
}

data = fs.readFileSync(stylesPath, 'utf8');
if (!data.includes('/* Origami Patched */')) {
  data = '/* Origami Patched */\n' + data;
  // postcss-custom-properties plugin that caused the needless warnings was
  // removed in v1.6.4. This regex replace won't match and that's ok.
  data = data.replace(/(customProperties\({)/, '$1 warnings: false,');
  fs.writeFileSync(stylesPath, data);
}
