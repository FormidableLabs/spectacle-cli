'use strict';

const yargs = require('yargs');
const validatePkgName = require('validate-npm-package-name');

const { isEmpty } = require('../../lib/util/file');
const modes = require('../../lib/boilerplate/modes');

const MODES = Object.keys(modes);

// Produce args object.
const args = () =>
  yargs
    .usage('Usage: spectacle-boilerplate -s <file>')

    // Substantive
    .option('mode', {
      alias: 'm',
      describe: `Deck type to generate (${MODES.join(', ')})`,
      default: 'js',
      type: 'string'
    })
    .option('name', {
      alias: 'n',
      describe: 'Project name (`package.json:name`)',
      type: 'string',
      default: 'spectacle-presentation'
    })
    .option('description', {
      alias: 'e',
      describe: 'Project description (`package.json:description`)',
      type: 'string',
      default: 'Spectacle presentation'
    })
    .option('dir', {
      alias: 'd',
      describe: 'Directory for generated/boilerplate files.',
      type: 'string',
      default: '.'
    })

    // Logistical
    .help()
    .alias('help', 'h')
    .version()
    .alias('version', 'v')
    .strict().argv;

// Validate and further transform args.
const parse = async argv => {
  const { mode, name, description, dir } = argv;

  // Mode.
  if (!MODES.indexOf(mode) === -1) {
    throw new Error(`Unknown mode: "${mode}"`);
  }

  // Package name.
  const { validForNewPackages, warnings } = validatePkgName(name);
  if (!validForNewPackages) {
    throw new Error(
      `Invalid npm package name: "${name}". (${warnings.join(', ')})`
    );
  }

  // Check that output directory is empty / doesn't exist.
  const dirEmpty = await isEmpty(dir);
  if (!dirEmpty) {
    throw new Error(`Target directory is not empty: "${dir}"`);
  }

  return { mode, name, description, dir };
};

module.exports = {
  parse: () => parse(args())
};
