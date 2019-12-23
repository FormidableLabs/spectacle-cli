'use strict';

// TODO(bp): MODE: `--mode=onepage` ???

// Create a vanilla JS presentation.
const js = async ({}) => {
  console.log('TODO IMPLEMENT MODE: js');
  throw new Error('IMPLEMENT ME');
};

// Create an MDX-based presentation.
const mdx = async ({}) => {
  console.log('TODO IMPLEMENT MODE: mdx');
};

module.exports = {
  js,
  mdx
};
