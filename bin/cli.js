#!/usr/bin/env node
'use strict';

const { parse } = require('./args');
const actions = require('../lib/actions');

const main = async () => {
  const { action, port, title, srcFilePath, themeFilePath } = await parse();
  const run = actions[action];
  await run({ port, title, srcFilePath, themeFilePath });
};

if (require.main === module) {
  main().catch(err => {
    // Try to get full stack, then full string if not.
    console.error(err.stack || err.toString()); // eslint-disable-line no-console
    process.exit(1); // eslint-disable-line no-process-exit
  });
}
