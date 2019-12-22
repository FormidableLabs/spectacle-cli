'use strict';

const yargs = require('yargs');

// TODO(bp): MODE: `--mode=js,mdx,onepage` ???
// TODO(bp): Extract this to a different file? In `lib/`?
const MODES = ['js', 'mdx'];

// Produce args object.
const args = () =>
  yargs
    .usage('Usage: spectacle-boilerplate -s <file>')

    // Substantive
    // TODO(bp): Implement options
    .option('mode', {
      alias: 'm',
      describe: `Deck type to generate (${MODES.join(', ')})`,
      default: 'js',
      type: 'string'
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
// eslint-disable-next-line max-statements
const parse = async argv => {
  const { mode, dir } = argv;

  // Mode.
  if (!MODES.indexOf(mode) === -1) {
    throw new Error(`Unknown mode: "${mode}"`);
  }

  // Check that output directory is empty / doesn't exist.

  return {
    mode,
    dir
  };
};

module.exports = {
  parse: () => parse(args())
};
