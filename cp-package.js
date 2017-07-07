const path = require('path');
const fs = require('fs');

const main = require('./package.json');

const json = require(path.resolve(__dirname, process.argv[2]));

const exclude = [
  'devDependencies',
  'scripts',
  'config',
  'private'
];

Object.keys(main).forEach(key => {
  if (exclude.indexOf(key) === -1) {
    if (!json[key]) {
      json[key] = main[key];
    }
  }
});

fs.writeFileSync(path.resolve(__dirname, process.argv[3]), JSON.stringify(json, null, 2), 'utf8');
