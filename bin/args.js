'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const yargs = require('yargs');

// Helpers
const stat = promisify(fs.stat);
const exists = filePath =>
  stat(filePath)
    .then(() => true)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return false;
      }
      throw err;
    });

// Produce args object.
const args = () =>
  yargs
    .usage('Usage: spectacle -s <file>')

    // Substantive
    .option('src', {
      alias: 's',
      describe: 'Path to a file from which a presentation will be generated.',
      default: 'slides.mdx',
      type: 'string'
    })
    .option('theme', {
      alias: 't',
      describe: 'Path to a JS/JSON file with theme overrides.',
      type: 'string'
    })
    .option('title', {
      alias: 'l',
      describe: 'Title for the HTML file generated by the Spectacle CLI.',
      type: 'string',
      default: 'Presentation'
    })
    .option('port', {
      alias: 'p',
      describe: 'Port for running the Spectacle development server.',
      type: 'number',
      default: 3000
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
  const { src, theme, port, title } = argv;

  // Source. Relative to CWD.
  if (!/\.mdx?$/.test(src)) {
    throw new Error(
      `Only .md,.mdx files are supported for --src. Found: "${src}"`
    );
  }
  const srcFilePath = path.resolve(src);
  const srcExists = await exists(srcFilePath);
  if (!srcExists) {
    throw new Error(`Source file "${srcFilePath}" not found.`);
  }

  // Theme. Relative to CWD.
  let themeFilePath;
  if (theme) {
    themeFilePath = path.resolve(theme);
    const themeExists = await exists(themeFilePath);
    if (!themeExists) {
      throw new Error(`Theme file "${themeFilePath}" not found.`);
    }
  }

  return {
    port,
    title,
    srcFilePath,
    themeFilePath
  };
};

module.exports = {
  parse: () => parse(args())
};
