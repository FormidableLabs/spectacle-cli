#!/usr/bin/env node

'use strict';

const { parse } = require('./args');

const main = async () => {
  const { mode, dir } = await parse();
  // TODO(bp): Try to generate `dir` if it doesn't exist.
  // TODO(bp): Error if `dir` exists and is non-empty.
  console.log('TODO(bp): IMPELMENT CLI', {
    mode,
    dir
  });
};

if (require.main === module) {
  main().catch(err => {
    // Try to get full stack, then full string if not.
    console.error(err.stack || err.toString()); // eslint-disable-line no-console
    process.exit(1); // eslint-disable-line no-process-exit
  });
}
