/**
 * Injection replacement patterns for all templates
 */
const path = require('path');
const { findPkgRoot } = require('../util/file');

const jsRe = /\/\/ SPECTACLE_CLI_JS_START[\s\S]*?\/\/ SPECTACLE_CLI_JS_END/gm;
const jsTmpl = srcFilePath => `
// SPECTACLE_CLI_JS_START
import Slides from '${srcFilePath}';
// SPECTACLE_CLI_JS_END
`;

const mdxRe = /\/\/ SPECTACLE_CLI_MDX_START[\s\S]*?\/\/ SPECTACLE_CLI_MDX_END/gm;
const mdxTmpl = srcFilePath => `
// SPECTACLE_CLI_MDX_START
import slides, { notes } from '${srcFilePath}';
// SPECTACLE_CLI_MDX_END
`;

const mdRe = /\/\/ SPECTACLE_CLI_MD_START[\s\S]*?\/\/ SPECTACLE_CLI_MD_END/gm;
const mdTmpl = srcFilePath => `
// SPECTACLE_CLI_MD_START
import mdContent from '${srcFilePath}';
// SPECTACLE_CLI_MD_END
`;

const themeRe = /\/\/ SPECTACLE_CLI_THEME_START[\s\S]*?\/\/ SPECTACLE_CLI_THEME_END/gm;
const themeTmpl = themeFilePath => `
// SPECTACLE_CLI_THEME_START
import theme from '${themeFilePath}';
// SPECTACLE_CLI_THEME_END
`;
const themeDefault = () => `
// SPECTACLE_CLI_THEME_START
const theme = {};
// SPECTACLE_CLI_THEME_END
`;

const templateRe = /\/\/ SPECTACLE_CLI_TEMPLATE_START[\s\S]*?\/\/ SPECTACLE_CLI_TEMPLATE_END/gm;
const templateTmpl = templateFilePath => `
// SPECTACLE_CLI_TEMPLATE_START
import template from '${templateFilePath}';
// SPECTACLE_CLI_TEMPLATE_END
`;
const templateDefault = () => `
// SPECTACLE_CLI_TEMPLATE_START
const template = undefined;
// SPECTACLE_CLI_TEMPLATE_END
`;

// Table for finding published example templates;
const TMPL_DIRS = {
  js: () => path.resolve(findPkgRoot('spectacle'), `examples/js`),
  md: () => path.resolve(findPkgRoot('spectacle'), `examples/md`),
  mdx: () => path.resolve(findPkgRoot('spectacle-mdx-loader'), `examples/mdx`)
};

const getTmplDir = srcMode => {
  const tmplDir = TMPL_DIRS[srcMode]();
  if (!tmplDir) {
    throw new Error(`Unabled to locate template directory for ${srcMode}`);
  }

  return tmplDir;
};

module.exports = {
  modes: {
    js: {
      re: jsRe,
      tmpl: jsTmpl
    },
    mdx: {
      re: mdxRe,
      tmpl: mdxTmpl
    },
    md: {
      re: mdRe,
      tmpl: mdTmpl
    }
  },
  themeRe,
  themeTmpl,
  themeDefault,
  templateRe,
  templateTmpl,
  templateDefault,
  getTmplDir
};
