/**
 * Injection replacement patterns for all templates
 */

const JS_RE = /\/\/ SPECTACLE_CLI_JS_START[\s\S]*?\/\/ SPECTACLE_CLI_JS_END/gm;
const jsTmpl = srcFilePath => `
// SPECTACLE_CLI_JS_START
import Slides from '${srcFilePath}';
// SPECTACLE_CLI_JS_END
`;

const MDX_RE = /\/\/ SPECTACLE_CLI_MDX_START[\s\S]*?\/\/ SPECTACLE_CLI_MDX_END/gm;
const mdxTmpl = srcFilePath => `
// SPECTACLE_CLI_MDX_START
import slides, { notes } from '${srcFilePath}';
// SPECTACLE_CLI_MDX_END
`;

const MD_RE = /\/\/ SPECTACLE_CLI_MD_START[\s\S]*?\/\/ SPECTACLE_CLI_MD_END/gm;
const mdTmpl = srcFilePath => `
// SPECTACLE_CLI_MD_START
import mdContent from '${srcFilePath}';
// SPECTACLE_CLI_MD_END
`;

const THEME_RE = /\/\/ SPECTACLE_CLI_THEME_START[\s\S]*?\/\/ SPECTACLE_CLI_THEME_END/gm;
const themeTmpl = themeFilePath => `
// SPECTACLE_CLI_THEME_START
import theme from '${themeFilePath}';
// SPECTACLE_CLI_THEME_END
`;

const TEMPLATE_RE = /\/\/ SPECTACLE_CLI_TEMPLATE_START[\s\S]*?\/\/ SPECTACLE_CLI_TEMPLATE_END/gm;
const templateTmpl = templateFilePath => `
// SPECTACLE_CLI_TEMPLATE_START
import template from '${templateFilePath}';
// SPECTACLE_CLI_TEMPLATE_END
`;

const AUTOLAYOUT_RE = /\/\/ SPECTACLE_CLI_AUTOLAYOUT_START[\s\S]*?\/\/ SPECTACLE_CLI_AUTOLAYOUT_END/gm;
const autolayoutTmpl = autolayout => `
// SPECTACLE_CLI_AUTOLAYOUT_START
const autoLayout = ${Boolean(autolayout)};
// SPECTACLE_CLI_AUTOLAYOUT_END
`;

module.exports = {
  modes: {
    js: {
      RE: JS_RE,
      tmpl: jsTmpl
    },
    mdx: {
      RE: MDX_RE,
      tmpl: mdxTmpl
    },
    md: {
      RE: MD_RE,
      tmpl: mdTmpl
    }
  },
  THEME_RE,
  themeTmpl,
  TEMPLATE_RE,
  templateTmpl,
  AUTOLAYOUT_RE,
  autolayoutTmpl
};
