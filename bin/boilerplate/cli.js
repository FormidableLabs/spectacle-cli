#!/usr/bin/env node

'use strict';

const { parse } = require('./args');
const modes = require('../../lib/boilerplate/modes');

const main = async () => {
  const { mode, dir } = await parse();
  const generate = modes[mode];
  await generate({ dir });
};

if (require.main === module) {
  main().catch(err => {
    // Try to get full stack, then full string if not.
    console.error(err.stack || err.toString()); // eslint-disable-line no-console
    process.exit(1); // eslint-disable-line no-process-exit
  });
}
