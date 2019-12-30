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
 * - `templates/{MODE}-slides/*`  -> `PROJ/src/*`: Presentation base
 * - `examples/cli-{MODE}/*`      -> `PROJ/src/*`: Example slide content
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
const { copy, ensureDir, readFile, writeFile } = require('fs-extra');
const { MDX_RE, mdxTmpl, MD_RE, mdTmpl } = require('../templates/replacements');

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
    start: 'webpack-dev-server --port=3000 --hot'
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
const transformIdx = replacements => async content => {
  replacements.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });

  return content;
};

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
    '../../package.json': {
      dest: 'package.json',
      transform: transformPkg
    },
    '../../config/webpack.config.js': 'webpack.config.js',
    '../templates/boilerplate': '.',
    ...files
  };
  await Promise.all(
    Object.entries(allFiles).map(([src, destObj]) => {
      if (typeof destObj === 'string') {
        // Simple copy.
        return copy(path.resolve(__dirname, src), path.resolve(dir, destObj));
      } else if (typeof destObj.transform === 'function') {
        // Read into memory, tranform, write out to file.
        return readFile(path.resolve(__dirname, src))
          .then(content =>
            destObj.transform(content.toString(), { name, description, dir })
          )
          .then(content => writeFile(path.resolve(dir, destObj.dest), content));
      }

      throw new Error(`Unknown destination object: ${destObj}`);
    })
  );
};

// ----------------------------------------------------------------------------
// Modes
// ----------------------------------------------------------------------------
// Create a vanilla JS presentation.
const js = async ({ name, description, dir }) => {
  await baseGenerate({ name, description, dir });
  console.log('TODO IMPLEMENT MODE: js', { name, description, dir });
};

// Create an MDX-based presentation.
const mdx = async ({ name, description, dir }) => {
  const files = {
    '../templates/mdx-slides/index.html': 'src/index.html',
    '../templates/mdx-slides/index.js': {
      dest: 'src/index.js',
      transform: transformIdx([
        { pattern: MDX_RE, replacement: mdxTmpl('./slides.mdx') }
      ])
    },
    '../../examples/cli-mdx/slides.mdx': 'src/slides.mdx',
    '../../examples/cli-mdx/test-component.js': 'src/test-component.js',
    '../../examples/cli-mdx/theme.js': 'src/theme.js'
  };
  await baseGenerate({ name, description, dir, files });

  console.log('TODO IMPLEMENT MODE: mdx', { name, description, dir, files });
};

// Create an MD-based presentation.
const md = async ({ name, description, dir }) => {
  const files = {
    '../templates/md-slides/index.html': 'src/index.html',
    '../templates/md-slides/index.js': {
      dest: 'src/index.js',
      transform: transformIdx([
        { pattern: MD_RE, replacement: mdTmpl('./slides.md') }
      ])
    },
    '../../examples/cli-md/slides.md': 'src/slides.md'
  };
  await baseGenerate({ name, description, dir, files });

  console.log('TODO IMPLEMENT MODE: md', { name, description, dir, files });
};

// TODO(bp): MODE: `--mode=onepage` ???
module.exports = {
  js,
  mdx,
  md
};
