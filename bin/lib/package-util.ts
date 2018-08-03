import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

export function getPackagePaths(patterns: string[]): string[] {
  const paths: string[] = [];
  patterns.forEach(pattern => {
    paths.push(...glob.sync(pattern));
  });

  return paths.filter(p => isPackagePath(p)).map(p => path.resolve(p));
}

export function isPackagePath(packagePath: string): boolean {
  return (
    fs.existsSync(packagePath) &&
    fs.statSync(packagePath).isDirectory() &&
    fs.existsSync(getPackageJsonPath(packagePath))
  );
}

export function getPackageJsonPath(packagePath: string): string {
  return path.join(packagePath, 'package.json');
}

export function getPackageJson(packagePath: string): any {
  return JSON.parse(fs.readFileSync(getPackageJsonPath(packagePath), 'utf8'));
}
