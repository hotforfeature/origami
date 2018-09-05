import { compile, getEs2015Dir, getEs5Dir } from './compile';
import { copyFolder } from './file-util';

export interface PrepareOptions {
  es5: boolean;
  force?: boolean;
}

export async function prepare(
  packagePath: string,
  opts: PrepareOptions
): Promise<void> {
  await compile(packagePath, opts);
  if (opts.es5) {
    await copyFolder(getEs5Dir(packagePath), packagePath);
  } else {
    await copyFolder(getEs2015Dir(packagePath), packagePath);
  }
}
