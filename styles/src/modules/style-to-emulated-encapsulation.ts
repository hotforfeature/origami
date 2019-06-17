/**
 * Regex to find and replace `:host-context()` selectors.
 */
export const HOST_CONTEXT_REGEX = /:host-context\((.*)\)/g;
/**
 * Regex to find and replace `:host` selectors.
 */
export const HOST_REGEX = /:host(?:\((.*)\))?/g;

// from @angular/platform-browser
export const COMPONENT_VARIABLE = '%COMP%';
export const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
export const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;

/**
 * Converts the provided CSS string to an Angular emulated encapsulation string
 * for the given component id.
 *
 * @param style the CSS string to convert
 * @returns a CSS string that emulates encapsulation for the given component id
 */
export function styleToEmulatedEncapsulation(style: string): string {
  const statements = parseStyleStatements(style);
  function addEmulation(statement: StyleStatement) {
    if (Array.isArray(statement.statements)) {
      statement.statements.forEach(nested => addEmulation(nested));
    } else {
      let { selector } = statement;
      selector = selector.trim();
      selector = selector
        .split(',')
        .map(subSelector => {
          return subSelector
            .trim()
            .split(' ')
            .map(part => {
              part = part.trim();
              if (part.includes(':host')) {
                return part;
              } else {
                return `${part}[${CONTENT_ATTR}]`;
              }
            })
            .join(' ');
        })
        .join(',');

      selector = selector.replace(HOST_CONTEXT_REGEX, `*$1 [${HOST_ATTR}]`);
      selector = selector.replace(HOST_REGEX, `[${HOST_ATTR}]$1`);
      statement.selector = selector;
    }
  }

  statements.forEach(statement => {
    addEmulation(statement);
  });

  return statementsToString(statements);
}

/**
 * Represents a single CSS statement.
 */
export interface StyleStatement {
  /**
   * The selector of the statement.
   */
  selector: string;
  /**
   * The body block of the statement.
   */
  block: string;
  /**
   * The body block statements. This is used for at-rule selectors such as
   * `@media {}`
   */
  statements?: StyleStatement[];
}

/**
 * Parses a CSS string into an array of statements.
 *
 * @param style the CSS string to parse
 * @returns an array of CSS statements
 */
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

/**
 * Converts an array of statements back into a single CSS string.
 *
 * @param statements the statements to convert
 * @returns a CSS string
 */
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
