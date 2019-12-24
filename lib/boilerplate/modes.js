'use strict';

const path = require('path');
const projPkg = require('../../package.json');
const { copy, ensureDir, writeJSON } = require('fs-extra');

// TODO(bp): MODE: `--mode=onepage` ???

// Production deps from project `dependencies`.
const PROD_DEPS = new Set(['prop-types', 'react', 'react-dom', 'spectacle']);
// Additional development deps from project `devDependencies`
// - [ ] TODO: Add `rimraf`?
const EXTRA_DEV_DEPS = new Set([]);

// TODO(bp): pkg.json
// - [ ] TODO: nuke most fields, deecide what to keep
// - [ ] TODO: new scripts
// - [ ] TODO(DEP): `mdx` mode needs `spectacle-mdx-loader` additional dep.
const createPkg = async ({ dir }) => {
  const scripts = {
    clean: 'TODO CLEAN PROD BUILD + devDep rimraf',
    build: 'TODO PRODUCTION BUILD',
    start: 'TODO DEVELOPMENT HMR'
  };

  const depEntries = Object.entries(projPkg.dependencies);
  const dependencies = depEntries
    .filter(([key]) => PROD_DEPS.has(key))
    .reduce((m, [k, v]) => ({ ...m, [k]: v }), {});

  const devDepEntries = Object.entries(projPkg.devDependencies);
  const devDependencies = []
    .concat(depEntries.filter(([key]) => !PROD_DEPS.has(key)))
    .concat(devDepEntries.filter(([key]) => EXTRA_DEV_DEPS.has(key)))
    .reduce((m, [k, v]) => ({ ...m, [k]: v }), {});

  await writeJSON(
    path.resolve(dir, 'package.json'),
    {
      name: 'TODO_IMPLEMENT_createPkg',
      scripts,
      dependencies,
      devDependencies
    },
    {
      spaces: 2
    }
  );
};

// Common generation.
const baseGenerate = async ({ dir, copyMap }) => {
  // Create output directory.
  await ensureDir(dir);

  // package.json
  await createPkg({ dir });

  // Create starting files.
  // `{ [src: <relative to __dirname>]: dest <relative to dir> }`
  await Promise.all(
    Object.entries(copyMap).map(([src, dest]) =>
      copy(path.resolve(__dirname, src), path.resolve(dir, dest))
    )
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
