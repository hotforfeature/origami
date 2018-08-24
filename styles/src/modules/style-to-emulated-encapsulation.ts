import {
  ɵshimContentAttribute as shimContentAttribute,
  ɵshimHostAttribute as shimHostAttribute
} from '@angular/platform-browser';

export const HOST_CONTEXT_REGEX = /:host-context\((.*)\)/g;
export const HOST_REGEX = /:host(?:\((.*)\))?/g;

export function styleToEmulatedEncapsulation(
  style: string,
  id: string
): string {
  const contentAttribute = shimContentAttribute(id);
  const hostAttribute = shimHostAttribute(id);
  const statements = parseStyleStatements(style);
  function addEmulation(statement: StyleStatement) {
    if (Array.isArray(statement.statements)) {
      statement.statements.forEach(nested => addEmulation(nested));
    } else {
      let { selector } = statement;
      selector = selector.trim();
      selector = selector.replace(HOST_CONTEXT_REGEX, `$1 ${hostAttribute}`);
      selector = selector.replace(HOST_REGEX, `${hostAttribute}$1`);
      selector = selector
        .split(',')
        .map(subSelector => {
          return subSelector
            .trim()
            .split(' ')
            .map(part => {
              return `${part.trim()}[${contentAttribute}]`;
            })
            .join(' ');
        })
        .join(',');

      statement.selector = selector;
    }
  }

  statements.forEach(statement => {
    addEmulation(statement);
  });

  return statementsToString(statements);
}

export interface StyleStatement {
  selector: string;
  block: string;
  statements?: StyleStatement[];
}

export function parseStyleStatements(style: string): StyleStatement[] {
  let inAtRule = false;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBlock = 0;
  let leavingBlock = false;

  const statements: StyleStatement[] = [];
  let currentStatement: StyleStatement = {
    selector: '',
    block: ''
  };

  for (let i = 0; i < style.length; i++) {
    const char = style[i];
    switch (char) {
      case '@':
        inAtRule = true;
        break;
      case "'":
        inSingleQuote = !inSingleQuote;
        break;
      case '"':
        inDoubleQuote = !inDoubleQuote;
        break;
      case '{':
      case '}':
        if (!inSingleQuote && !inDoubleQuote) {
          if (char == '{') {
            inBlock++;
          } else {
            inBlock--;
            leavingBlock = inBlock === 0;
          }
        }

        break;
    }

    if (inBlock) {
      currentStatement.block += char;
    } else if (leavingBlock) {
      currentStatement.block += char;
      if (inAtRule) {
        currentStatement.statements = parseStyleStatements(
          currentStatement.block.substring(
            currentStatement.block.indexOf('{') + 1,
            currentStatement.block.lastIndexOf('}')
          )
        );
      }

      currentStatement.selector = currentStatement.selector.trim();
      currentStatement.block = currentStatement.block.trim();
      statements.push(currentStatement);
      currentStatement = { selector: '', block: '' };
      leavingBlock = false;
    } else {
      currentStatement.selector += char;
    }
  }

  return statements;
}

export function statementsToString(statements: StyleStatement[]): string {
  return statements
    .map(statement => {
      const block = Array.isArray(statement.statements)
        ? `{${statementsToString(statement.statements)}}`
        : statement.block;
      return `${statement.selector} ${block}`;
    })
    .join('\n');
}
