'use strict';

const { ensureDir } = require('fs-extra');

// TODO(bp): MODE: `--mode=onepage` ???

// Common generation.
const baseGenerate = async ({ dir }) => {
  // Create output directory.
  await ensureDir(dir);
};

// Create a vanilla JS presentation.
const js = async ({ dir }) => {
  await baseGenerate({ dir });
  console.log('TODO IMPLEMENT MODE: js');
  throw new Error('IMPLEMENT ME');
};

// Create an MDX-based presentation.
const mdx = async ({ dir }) => {
  await baseGenerate({ dir });

  console.log('TODO IMPLEMENT MODE: mdx');
};

module.exports = {
  js,
  mdx
};
