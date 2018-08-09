import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { warn } from './log';

const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);
const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);
const writeFileAsync = promisify(fs.writeFile);

export interface CopyFolderSyncOptions {
  excludeDir?: string[];
  include?: string[];
}

export async function copyFolder(
  fromDir: string,
  toDir: string,
  opts: CopyFolderSyncOptions = {}
): Promise<void> {
  try {
    if (!(await existsAsync(toDir))) {
      await mkdirAsync(toDir);
    }

    const names = await readdirAsync(fromDir);
    for (let name of names) {
      if (opts.excludeDir && opts.excludeDir.indexOf(name) > -1) {
        continue;
      }

      const fileOrFolder = path.join(fromDir, name);
      const target = path.join(toDir, name);
      if ((await statAsync(fileOrFolder)).isDirectory()) {
        if (!(await existsAsync(target))) {
          await mkdirAsync(target);
        }

        await copyFolder(fileOrFolder, target, opts);
      } else if (!opts.include || opts.include.indexOf(fileOrFolder) > -1) {
        await writeFileAsync(target, await readFileAsync(fileOrFolder));
      }
    }
  } catch (error) {
    warn('Failed to copyFolder()');
    throw error;
  }
}

export interface GetFilesWithExtOptions {
  excludeDir?: string[];
}

export async function getFilesWithExt(
  ext: string,
  directory: string,
  opts: GetFilesWithExtOptions = {},
  allFiles: string[] = []
): Promise<string[]> {
  try {
    const directoryName = path.basename(directory);
    if (opts.excludeDir && opts.excludeDir.indexOf(directoryName) > -1) {
      return [];
    }

    const files = await readdirAsync(directory);
    for (let file of files) {
      const absolutePath = path.resolve(directory, file);
      if ((await statAsync(absolutePath)).isDirectory()) {
        await getFilesWithExt(ext, absolutePath, opts, allFiles);
      } else if (path.extname(absolutePath) === ext) {
        allFiles.push(absolutePath);
      }
    }

    return allFiles;
  } catch (error) {
    warn('Failed to getFilesWithExt()');
    throw error;
  }
}

export async function writeJson(path: string, json: any): Promise<void> {
  await writeFileAsync(path, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}
