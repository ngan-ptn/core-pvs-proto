import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import { resolve } from 'node:path';

const targetPath = process.argv[2];

if (!targetPath) {
  console.error('Usage: node scripts/open-file.mjs <path>');
  process.exit(1);
}

const resolvedPath = resolve(targetPath);

let command;
let args;

switch (platform()) {
  case 'win32':
    command = 'cmd';
    args = ['/c', 'start', '', resolvedPath];
    break;
  case 'darwin':
    command = 'open';
    args = [resolvedPath];
    break;
  default:
    command = 'xdg-open';
    args = [resolvedPath];
    break;
}

const child = spawn(command, args, {
  detached: true,
  stdio: 'ignore',
});

child.on('error', (error) => {
  console.error(`Failed to open ${resolvedPath}: ${error.message}`);
  process.exit(1);
});

child.unref();
