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

// TODO(bp): MODE: `--mode=onepage` ???

// Production deps from project `dependencies`.
const PROD_DEPS = new Set(['prop-types', 'react', 'react-dom', 'spectacle']);
// Additional development deps from project `devDependencies`
// - [ ] TODO: Add `rimraf`?
const EXTRA_DEV_DEPS = new Set([]);

const INDENT = 2;

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
 * @param {string}  content           string content
 * @param {*}       opts              options object
 * @param {string}  opts.name         package name
 * @param {string}  opts.description  package description
 * @param {string}  opts.dir          output directory
 * @returns {Promise<undefined>}      nothing
 */
const transformPkg = async (content, { name, description }) => {
  const projPkg = JSON.parse(content);
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

// Common generation.
const baseGenerate = async ({ name, description, dir, copyMap }) => {
  // Create output directory.
  await ensureDir(dir);

  // Create starting files.
  // `{ [src: <relative to __dirname>]: dest <relative to dir> }`
  const copyFiles = {
    '../../package.json': {
      dest: 'package.json',
      transform: transformPkg
    },
    '../../config/webpack.config.js': 'webpack.config.js',
    '../templates/boilerplate': '.',
    ...copyMap
  };
  await Promise.all(
    Object.entries(copyFiles).map(([src, destObj]) => {
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

// Create a vanilla JS presentation.
const js = async ({ name, description, dir }) => {
  await baseGenerate({ name, description, dir });
  console.log('TODO IMPLEMENT MODE: js', { name, description, dir });
};

// Create an MDX-based presentation.
const mdx = async ({ name, description, dir }) => {
  const copyMap = {
    '../templates/mdx-slides/index.html': 'src/index.html',
    '../templates/mdx-slides/index.js': 'src/index.js',
    '../../examples/cli-mdx/slides.mdx': 'src/slides.mdx',
    '../../examples/cli-mdx/test-component.js': 'src/test-component.js',
    '../../examples/cli-mdx/theme.js': 'src/theme.js'
  };
  await baseGenerate({ name, description, dir, copyMap });

  console.log('TODO IMPLEMENT MODE: mdx', { name, description, dir, copyMap });
};

// Create an MD-based presentation.
const md = async ({ name, description, dir }) => {
  const copyMap = {
    '../templates/md-slides/index.html': 'src/index.html',
    '../templates/md-slides/index.js': 'src/index.js',
    '../../examples/cli-md/slides.md': 'src/slides.md'
  };
  await baseGenerate({ name, description, dir, copyMap });

  console.log('TODO IMPLEMENT MODE: md', { name, description, dir, copyMap });
};

module.exports = {
  js,
  mdx,
  md
};
