import * as fs from 'fs';
import {
  Attribute,
  DefaultTreeDocument,
  DefaultTreeElement,
  DefaultTreeNode,
  DefaultTreeParentNode,
  parse
} from 'parse5';
import * as path from 'path';
import { promisify } from 'util';
import {
  getAngularJson,
  isAngularCliJsonEs5,
  isAngularJson,
  isAngularJsonEs5
} from './util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const ADAPTER_SCRIPT =
  '  <script src="node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>\n';
const LOADER_SCRIPT =
  '  <script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js" defer></script>\n';

export async function updateIndexFiles(appNames: string[] = []): Promise<void> {
  const json = await getAngularJson();
  const indexFiles: { [path: string]: boolean } = {};
  if (isAngularJson(json)) {
    // angular.json
    for (let name in json.projects) {
      if (!appNames.length || appNames.indexOf(name) > -1) {
        const project = json.projects[name];
        const architect = project.architect.build;
        if (architect) {
          const isEs5 = isAngularJsonEs5(project, 'build');
          const indexPath = path.resolve(
            project.root,
            architect.options.index!
          );
          indexFiles[indexPath] = indexFiles[indexPath] || isEs5;
        }
      }
    }
  } else {
    // .angular-cli.json
    json.apps.forEach(app => {
      if (!appNames.length || appNames.indexOf(app.name) > -1) {
        const isEs5 = isAngularCliJsonEs5(app);
        const indexPath = path.resolve(app.root, app.index);
        indexFiles[indexPath] = indexFiles[indexPath] || isEs5;
      }
    });
  }

  for (let indexFile in indexFiles) {
    const isEs5 = indexFiles[indexFile];
    await updateIndexFile(indexFile, isEs5);
  }
}

async function updateIndexFile(
  indexFile: string,
  isEs5: boolean
): Promise<void> {
  let indexHtmlStr = await readFileAsync(indexFile, 'utf8');
  const indexHtml = <DefaultTreeDocument>parse(indexHtmlStr, {
    sourceCodeLocationInfo: true
  });

  // Remove previous polyfills
  const scriptDiv = findNode(indexHtml, isWebComponentsLoaderScript);
  if (scriptDiv) {
    const scriptDivStr = getHtmlSubstring(indexHtmlStr, scriptDiv);
    indexHtmlStr = indexHtmlStr.split(scriptDivStr).join('');
  }

  const adapterDiv = findNode(indexHtml, isDivWithCustomAdapter);
  if (adapterDiv) {
    const adapterDivStr = getHtmlSubstring(indexHtmlStr, adapterDiv);
    indexHtmlStr = indexHtmlStr.split(adapterDivStr).join('');
  }

  const adapterScript = findNode(indexHtml, isAdapterScript);
  if (adapterScript) {
    const adapterScriptStr = getHtmlSubstring(indexHtmlStr, adapterScript);
    indexHtmlStr = indexHtmlStr.split(adapterScriptStr).join('');
  }

  // Add new ones
  const insert = [isEs5 ? ADAPTER_SCRIPT : '', LOADER_SCRIPT].join('');

  const insertPointMatch = indexHtmlStr.match(/(<\/head>|<\/body>|<\/html>)/);
  const insertPoint = insertPointMatch
    ? insertPointMatch.index!
    : indexHtmlStr.length;
  indexHtmlStr =
    indexHtmlStr.slice(0, insertPoint) +
    insert +
    indexHtmlStr.slice(insertPoint);
  // clean up extra line breaks
  indexHtmlStr = indexHtmlStr.replace(/(\n\s*?(?=\n)){2,}/g, '\n');
  await writeFileAsync(indexFile, indexHtmlStr, 'utf8');
}

function findNode<T extends DefaultTreeNode>(
  node: DefaultTreeNode,
  predicate: (node: DefaultTreeNode) => node is T
): T | undefined {
  if (predicate(node)) {
    return node;
  } else if (hasChildren(node)) {
    let found: T | undefined;
    node.childNodes.some(childNode => {
      found = findNode(childNode, predicate);
      return !!found;
    });

    return found;
  }
}

function isDivWithCustomAdapter(
  node: DefaultTreeNode
): node is DefaultTreeElement {
  if (node.nodeName === 'div' && hasChildren(node)) {
    return node.childNodes.some(childNode => {
      return isAdapterScript(childNode);
    });
  } else {
    return false;
  }
}

function isAdapterScript(node: DefaultTreeNode): node is DefaultTreeElement {
  if (node.nodeName === 'script' && hasAttrs(node)) {
    return node.attrs.some(attr => {
      return (
        attr.name === 'src' &&
        attr.value.indexOf('custom-elements-es5-adapter') > -1
      );
    });
  } else {
    return false;
  }
}

function isWebComponentsLoaderScript(
  node: DefaultTreeNode
): node is DefaultTreeElement {
  if (node.nodeName === 'script' && hasAttrs(node)) {
    return node.attrs.some(attr => {
      return (
        attr.name === 'src' && attr.value.indexOf('webcomponents-loader') > -1
      );
    });
  } else {
    return false;
  }
}

function hasChildren(node: any): node is DefaultTreeParentNode {
  return Array.isArray(node.childNodes);
}

function hasAttrs(node: any): node is { attrs: Attribute[] } {
  return Array.isArray(node.attrs);
}

function getHtmlSubstring(html: string, node: DefaultTreeElement): string {
  return html.substring(
    node.sourceCodeLocation!.startOffset,
    node.sourceCodeLocation!.endOffset
  );
}
