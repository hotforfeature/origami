import chalk, { Chalk } from 'chalk';

export function info(message: string) {
  log(message, chalk.white);
}

export function warn(message: string) {
  log(message, chalk.yellow);
}

export function error(message: Error | string, fatal?: boolean) {
  log(message instanceof Error ? message.stack! : message, chalk.red);
  if (fatal) {
    process.exit(1);
  }
}

export function getPrefix(): string {
  return chalk.cyan('Origami: ');
}

function log(message: string, color: Chalk) {
  console.log(getPrefix() + color(message));
}
