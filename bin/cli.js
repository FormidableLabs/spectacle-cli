#!/usr/bin/env node
'use strict';

const { parse } = require('./args');
const { launchDevServer } = require('../lib/actions');

const main = async () => {
  const { port, title, mdxFilePath, themeFilePath } = await parse();

  // We only have one action so far.
  await launchDevServer({
    port,
    title,
    mdxFilePath,
    themeFilePath
  });
};

if (require.main === module) {
  main().catch(err => {
    // Try to get full stack, then full string if not.
    console.error(err.stack || err.toString()); // eslint-disable-line no-console
    process.exit(1); // eslint-disable-line no-process-exit
  });
}
