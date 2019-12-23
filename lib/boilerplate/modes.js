'use strict';

const path = require('path');
const { copy, ensureDir } = require('fs-extra');

// TODO(bp): MODE: `--mode=onepage` ???

// Common generation.
const baseGenerate = async ({ dir, copyMap }) => {
  // Create output directory.
  await ensureDir(dir);

  // Create starting files.
  // `{ [src: <relative to __dirname>]: dest <relative to dir> }`
  await Promise.all(
    Object.keys(copyMap).map(src => {
      const dest = copyMap[src];
      return copy(path.resolve(__dirname, src), path.resolve(dir, dest));
    })
  );
};

// Create a vanilla JS presentation.
const js = async ({ dir }) => {
  await baseGenerate({ dir });
  console.log('TODO IMPLEMENT MODE: js');
  throw new Error('IMPLEMENT ME');
};

// Create an MDX-based presentation.
const mdx = async ({ dir }) => {
  const copyMap = {
    '../../config/webpack.config.js': 'webpack.config.js',
    '../templates/mdx-slides': 'src'
  };
  await baseGenerate({ dir, copyMap });

  console.log('TODO IMPLEMENT MODE: mdx');
};

module.exports = {
  js,
  mdx
};
