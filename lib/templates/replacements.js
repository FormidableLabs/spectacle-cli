/**
 * Injection replacement patterns for all templates
 */

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

const templateRe = /\/\/ SPECTACLE_CLI_TEMPLATE_START[\s\S]*?\/\/ SPECTACLE_CLI_TEMPLATE_END/gm;
const templateTmpl = templateFilePath => `
// SPECTACLE_CLI_TEMPLATE_START
import template from '${templateFilePath}';
// SPECTACLE_CLI_TEMPLATE_END
`;

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
  templateRe,
  templateTmpl
};
