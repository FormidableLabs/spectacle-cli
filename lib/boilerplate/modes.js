'use strict';

/* eslint-disable valid-jsdoc*/
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
 * - `templates/boilerplate/*`    -> `PROJ/*`: Generic files for all modes.
 *
 * As well as from published dependencies like:
 *
 * - `spectacle/examples/{js,md}`         -> `PROJ/src/*`
 * - `spectacle-mdx-loader/examples/mdx`  -> `PROJ/src/*`
 *
 * ## Transformations
 *
 * **Note**: When doing the file copying we separate all straight copies _first_
 * and then do any transformation configures _second_ in two batches. This
 * enables us to do things like "copy `templates/foo/*` to `PROJ/foo/*`" then
 * "transform `templates/foo/file.js` to `PROJ/foo/file.js`" in a predictable
 * manner that might conflict if initiated in paralel.
 *
 * `tl;dr`: Do all your bulk copies of directories first, then overwrite
 * specific files with transforms after!
 *
 * - `PROJ/package.json`: Take CLI package.json dependencies and devDeps and
 *   transform them into appropriate ones for a standalone project. Adds various
 *   metadata and scripts, etc.
 * - `{DEP}/examples/{MODE}/index.js`: We use the same regex replacement
 *   scheme as the CLI does with the inject loader to hook up the example
 *   files in our examples. This results in our boilerplate output being
 *   nearly identical to our matching CLI examples.
 */

const path = require('path');
const { copy, ensureDir, readFile, writeFile } = require('fs-extra');
const { modes, getTmplDir } = require('../templates/replacements');

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------
// Production deps from project `dependencies`.
const PROD_DEPS = new Set(['prop-types', 'react', 'react-dom', 'spectacle']);
// Additional development deps from project `devDependencies`.
const EXTRA_DEV_DEPS = new Set(['rimraf']);
// Simply remove these dependencies (prod or dev).
const REMOVE_DEPS = new Set(['validate-npm-package-name', 'fs-extra']);

const INDENT = 2;

// ----------------------------------------------------------------------------
// Transforms
// ----------------------------------------------------------------------------
/**
 * Transform project `package.json` to boilerplate version.
 *
 * We use the `dependencies` and `devDependencies` from this project as our
 * starting source as our `examples` are pretty much the same thing that the
 * boilerplate constructs.
 *
 * We thus read in this project's `package.json` and slice and dice the
 * dependencies as appropriate for a given boilerplate output mode.
 */
const transformPkg = async (content, { name, description }) => {
  const projPkg = JSON.parse(content);
  const scripts = {
    clean: 'rimraf dist',
    build: 'webpack',
    start: 'webpack-dev-server --hot'
  };

  const depEntries = Object.entries(projPkg.dependencies);
  const dependencies = depEntries
    .filter(([key]) => PROD_DEPS.has(key))
    .filter(([key]) => !REMOVE_DEPS.has(key))
    .reduce((m, [k, v]) => ({ ...m, [k]: v }), {});

  const devDepEntries = Object.entries(projPkg.devDependencies);
  const devDependencies = []
    .concat(depEntries.filter(([key]) => !PROD_DEPS.has(key)))
    .concat(devDepEntries.filter(([key]) => EXTRA_DEV_DEPS.has(key)))
    .filter(([key]) => !REMOVE_DEPS.has(key))
    .reduce((m, [k, v]) => ({ ...m, [k]: v }), {});

  return JSON.stringify(
    {
      name,
      version: '0.0.1',
      description,
      scripts,
      dependencies,
      devDependencies
    },
    null,
    INDENT
  );
};

/**
 * Transform examples `index.js` to boilerplate version.
 *
 * Generate a transform function with a custom map of regex replacements
 * very similar to the inject-loader for the underlying examples.
 */
const transformIdx = replacements => async content =>
  replacements.reduce(
    (memo, { pattern, replacement }) => memo.replace(pattern, replacement),
    content
  );

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
/**
 * Common generation.
 *
 * **Copy Mappings**:
 *
 * The `files` parameter is a key/value object of form:
 * - `[src path<string>]: dest path<string>`
 * - `[src path<string>]: { dest: dest path<string>: transform: <function> }`
 *
 * It can copy files or directories. If a destination object is provided then
 * the source/destination must be a single file. The signature of the transform
 * function is:
 *
 * ```
 * (content <string>, { name, description, dir }) => <string>
 * ```
 *
 * that takes a source file text input and returns a modified text string.
 *
 * @param {*}                     opts              options object
 * @param {string}                opts.name         package name
 * @param {string}                opts.description  package description
 * @param {string}                opts.dir          output directory
 * @param {Object<String|Object>} opts.files        map of source -> boilerplate transforms
 * @returns {Promise<undefined>}   nothing
 */
const baseGenerate = async ({ name, description, dir, files }) => {
  // Create output directory.
  await ensureDir(dir);

  // Create starting files.
  const allFiles = {
    // **Note**: NPM has very specific, non-overridable behavior when dealing
    // with `.gitignore` and `.npmignore` files. Accordingly, we manually
    // construct file names of `_<SPECIAL_NAME>` and map to `.<SPECIAL_NAME>`
    // to get around this.
    '../templates/boilerplate/_gitignore': '.gitignore',
    '../templates/boilerplate/README.md': 'README.md',
    '../../config/webpack.config.js': 'webpack.config.js',
    '../../package.json': {
      dest: 'package.json',
      transform: transformPkg
    },
    ...files
  };

  // Separate into copies and transforms.
  const copyFiles = Object.entries(allFiles)
    .filter(([, destObj]) => typeof destObj === 'string')
    .reduce((memo, [src, destObj]) => ({ ...memo, [src]: destObj }), {});
  await Promise.all(
    Object.entries(copyFiles).map(([src, destObj]) =>
      copy(path.resolve(__dirname, src), path.resolve(dir, destObj))
    )
  );

  const transformFiles = Object.entries(allFiles)
    .filter(([, destObj]) => typeof destObj !== 'string')
    .reduce((memo, [src, destObj]) => ({ ...memo, [src]: destObj }), {});
  await Promise.all(
    Object.entries(transformFiles).map(([src, { transform, dest }]) =>
      readFile(path.resolve(__dirname, src))
        .then(data => transform(data.toString(), { name, description, dir }))
        .then(data => writeFile(path.resolve(dir, dest), data))
    )
  );
};

// ----------------------------------------------------------------------------
// Modes
// ----------------------------------------------------------------------------
// Create a vanilla JS presentation.
const js = async ({ name, description, dir }) => {
  const tmplDir = getTmplDir('js');
  const files = {
    [`${tmplDir}/index.html`]: 'src/index.html',
    [`${tmplDir}/index.js`]: 'src/index.js'
  };
  await baseGenerate({ name, description, dir, files });
};

// Create an MDX-based presentation.
const mdx = async ({ name, description, dir }) => {
  const tmplDir = getTmplDir('mdx');
  const files = {
    [`${tmplDir}/index.html`]: 'src/index.html',
    [`${tmplDir}/index.js`]: {
      dest: 'src/index.js',
      transform: transformIdx([
        { pattern: modes.mdx.re, replacement: modes.mdx.tmpl('./slides.mdx') }
      ])
    },
    [`${tmplDir}/slides.mdx`]: 'src/slides.mdx',
    [`${tmplDir}/test-component.js`]: 'src/test-component.js'
  };
  await baseGenerate({ name, description, dir, files });
};

// Create an MD-based presentation.
const md = async ({ name, description, dir }) => {
  const tmplDir = getTmplDir('md');
  const files = {
    [`${tmplDir}/index.html`]: 'src/index.html',
    [`${tmplDir}/index.js`]: {
      dest: 'src/index.js',
      transform: transformIdx([
        { pattern: modes.md.re, replacement: modes.md.tmpl('./slides.md') }
      ])
    },
    [`${tmplDir}/slides.md`]: 'src/slides.md'
  };
  await baseGenerate({ name, description, dir, files });
};

module.exports = {
  js,
  mdx,
  md
};
