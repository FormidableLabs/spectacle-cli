'use strict';

/**
 * Generate boilerplate output files for various modes.
 *
 * The basic strategy here is to take a lot of our source files from the CLI
 * templates, config, and our examples, copy them to an output destination, and
 * then naively regex away to a functioning, standalone boilerplate.
 *
 * ## File copying
 *
 * Here are some basic copying starting points:
 *
 * - `package.json`               -> `PROJ/package.json`
 * - `config/webpack.config.js`   -> `PROJ/webpack.config.js`
 * - `templates/boilerplate`      -> `PROJ/*`: Generic files for all modes.
 * - `templates/{MODE}-slides`    -> `PROJ/src/*`: Presentation base
 *
 * ## Transformations
 *
 * - `PROJ/package.json`: Take CLI package.json dependencies and devDeps and
 *   transform them into appropriate ones for a standalone project. Adds various
 *   metadata and scripts, etc.
 *
 * TODO(bp): More code comments about how everything works.
 */

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
/**
 * Create boilerplate `package.json` file.
 *
 * We use the `dependencies` and `devDependencies` from this project as our
 * starting source as our `examples` are pretty much the same thing that the
 * boilerplate constructs.
 *
 * We thus read in this project's `package.json` and slice and dice the
 * dependencies as appropriate for a given boilerplate output mode.
 *
 * @param {*}       opts              options object
 * @param {string}  opts.name         package name
 * @param {string}  opts.description  package description
 * @param {string}  opts.dir          output directory
 * @returns {Promise<undefined>}      nothing
 */
const createPkg = async ({ name, description, dir }) => {
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
      name,
      version: '0.0.1',
      description,
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
const baseGenerate = async ({ name, description, dir, copyMap }) => {
  // Create output directory.
  await ensureDir(dir);

  // package.json
  await createPkg({ name, description, dir });

  // Create starting files.
  // `{ [src: <relative to __dirname>]: dest <relative to dir> }`
  const copyFiles = {
    '../../config/webpack.config.js': 'webpack.config.js',
    '../templates/boilerplate': '.',
    ...copyMap
  };
  await Promise.all(
    Object.entries(copyFiles).map(([src, dest]) =>
      copy(path.resolve(__dirname, src), path.resolve(dir, dest))
    )
  );
};

// Create a vanilla JS presentation.
const js = async ({ name, description, dir }) => {
  await baseGenerate({ name, description, dir });
  console.log('TODO IMPLEMENT MODE: js', { name, description, dir });
};

// Create an MDX-based presentation.
const mdx = async ({ name, description, dir }) => {
  const copyMap = {
    '../templates/mdx-slides': 'src'
  };
  await baseGenerate({ name, description, dir, copyMap });

  console.log('TODO IMPLEMENT MODE: mdx', { name, description, dir, copyMap });
};

// Create an MD-based presentation.
const md = async ({ name, description, dir }) => {
  const copyMap = {
    '../templates/md-slides': 'src'
  };
  await baseGenerate({ name, description, dir, copyMap });

  console.log('TODO IMPLEMENT MODE: md', { name, description, dir, copyMap });
};

module.exports = {
  js,
  mdx,
  md
};
