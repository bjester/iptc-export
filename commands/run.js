const os = require('os');
const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const csv = require('csv');
const walker = require('walker');
const iptcReader = require('iptc-reader');

module.exports = function(argv)
{
  const csvFile = fs.createWriteStream(path.join(argv.dir, 'iptc-export.csv'));
  const stringifier = csv.stringify({
    delimiter: ','
  });
  let next = Promise.resolve();

  stringifier.pipe(csvFile);
  stringifier.write([
    'File',
    'IPTC Keywords'
  ]);

  walker(argv.dir)
    .on('dir', (dir) =>
    {
      if (dir === argv.dir)
      {
        console.log(chalk.bold(`Starting parse of "${dir}"`));
        return;
      }

      const relative = path.relative(argv.dir, dir);
      const base = path.basename(dir);

      console.log(chalk.bold(`[/${relative}] Entering directory "${base}"`));
    })
    .on('file', (file) =>
    {
      if (!/jpg|jpeg/i.test(file))
      {
        return;
      }

      const relative = path.relative(argv.dir, path.dirname(file));
      console.log(chalk.yellow(`[/${relative}] Found "${path.basename(file)}"`));

      next = next
        .then(() =>
        {
          console.log(chalk.yellow(`[/${relative}] Reading "${path.basename(file)}"`));
          return fs.promises.readFile(file);
        })
        .then((image) =>
        {
          console.log(`[/${relative}] Parsing "${path.basename(file)}"`);
          const data = iptcReader(image);
          const keywords = (data && 'keywords' in data)
            ? data.keywords
            : '';

          stringifier.write([
            file.replace(argv.dir, ''),
            (Array.isArray(keywords))
              ? keywords.join(', ')
              : keywords
          ]);
        });
    })
    .on('end', () =>
    {
      next
        .then(() =>
        {
          console.log(chalk.green.bold('Finishing up!'));
          stringifier.end();
        })
        .catch((e) =>
        {
          console.error(chalk.red(e));
        });
    })
};