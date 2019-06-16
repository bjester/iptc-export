const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const INSTALL_PATH = '/usr/local/bin';

module.exports = function(argv)
{
  if (!process.getuid)
  {
    console.error('Installation is not supported on this platform');
    return;
  }

  if (process.geteuid() !== 0)
  {
    console.log(chalk.red('Please run as super user'));

    const relative = path.relative(process.cwd(), process.execPath);
    console.log(`\tsudo ./${relative} install`);
    return;
  }

  fs.promises.access(INSTALL_PATH, fs.constants.W_OK)
    .then(() =>
    {
      console.log(chalk.bold('Installing...'));
      return fs.promises.copyFile(process.execPath,
        path.join(INSTALL_PATH, path.basename(process.execPath)));
    })
    .then(() =>
    {
      console.log(chalk.green.bold('Finished!'));
    })
    .catch((err) =>
    {
      console.log(chalk.redBright(err));
    });
};
