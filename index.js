const commands = require('./commands');

const done = require('yargs')
  .command('install', 'installs the utility', () => {}, commands.install)
  .command('run [dir]', 'runs the export utility, in `dir` or current otherwise',
    (yargs) =>
    {
      yargs
        .positional('dir', {
          describe: 'the directory to process',
          default: process.cwd()
        });
    },
    commands.run)
  .demandCommand(1, 'You need to specify a command')
  .help()
  .argv
;
