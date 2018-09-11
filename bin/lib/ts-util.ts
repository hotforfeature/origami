import * as path from 'path';
import * as ts from 'typescript';

export function getCompilerOptions(tsconfigPath: string): ts.CompilerOptions {
  const readResult = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (readResult.error) {
    throw new Error(getDiagnosticsMessage([readResult.error]));
  }

  const parseResult = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    path.dirname(tsconfigPath)
  );
  if (parseResult.errors.length) {
    throw new Error(getDiagnosticsMessage(parseResult.errors));
  }

  return parseResult.options;
}

export function getDiagnosticsMessage(diagnostics: ts.Diagnostic[]): string {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
  });
}
