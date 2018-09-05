import * as path from 'path';
import { writeJson } from '../file-util';
import {
  AngularJsonProjectArchitectType,
  Asset,
  getAngularJson,
  getAngularJsonPath,
  getRelativeNodeModulesPath,
  isAngularCliJsonEs5,
  isAngularJson,
  isAngularJsonEs5
} from './util';

export async function addPolyfillAssets(
  appNames: string[] = []
): Promise<void> {
  const json = await getAngularJson();
  if (isAngularJson(json)) {
    // angular.json
    for (let name in json.projects) {
      if (!appNames.length || appNames.indexOf(name) > -1) {
        const project = json.projects[name];
        const nodeModules = getRelativeNodeModulesPath(project);
        const types = <AngularJsonProjectArchitectType[]>['build', 'test'];
        types.forEach(type => {
          const architect = project.architect[type];
          if (architect) {
            const isEs5 = isAngularJsonEs5(project, type);
            architect.options.assets = updateAssets(
              architect.options.assets,
              nodeModules,
              isEs5
            );
          }
        });
      }
    }
  } else {
    // .angular-cli.json
    json.apps.forEach(app => {
      if (!appNames.length || appNames.indexOf(app.name) > -1) {
        const nodeModules = getRelativeNodeModulesPath(app);
        const isEs5 = isAngularCliJsonEs5(app);
        app.assets = updateAssets(app.assets, nodeModules, isEs5);
      }
    });
  }

  await writeJson(await getAngularJsonPath(), json);
}

function updateAssets(
  assets: Asset[],
  nodeModules: string,
  isEs5: boolean
): Asset[] {
  // Remove old polyfill assets
  assets = assets.filter(asset => {
    if (typeof asset === 'string') {
      return asset.indexOf('webcomponentsjs') === -1;
    } else {
      return asset.input.indexOf('webcomponentsjs') === -1;
    }
  });

  assets.push({
    glob: isEs5
      ? '{*loader.js,*adapter.js,bundles/*.js}'
      : '{*loader.js,bundles/*.js}',
    input: path.join(nodeModules, '@webcomponents/webcomponentsjs/'),
    output: 'node_modules/@webcomponents/webcomponentsjs'
  });

  return assets;
}
