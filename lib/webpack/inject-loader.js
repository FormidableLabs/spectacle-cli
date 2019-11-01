'use strict';

const MDX_RE = /\/\/ SPECTACLE_CLI_MDX_START[\s\S]*?\/\/ SPECTACLE_CLI_MDX_END/gm;
const mdxTmpl = mdxFilePath => `
// SPECTACLE_CLI_MDX_START
import slides, { notes } from '${mdxFilePath}';
// SPECTACLE_CLI_MDX_END
`;

// Inject spectacle-cli specific code/imports into a source file.
// **Note**: Should only be used with the entry point.
module.exports = async function(src) {
  // Loader state.
  this.cacheable(true);
  const callback = this.async();

  // Unpack options.
  const {
    query: { mdxFilePath, themeFilePath }
  } = this;
  if (mdxFilePath) {
    src = src.replace(MDX_RE, mdxTmpl(mdxFilePath));
  }

  // console.log("TODO HERE", {
  //   resourcePath: this.resourcePath,
  //   mdxFilePath, themeFilePath,
  //   mdxMatch,
  //   src
  // });

  return callback(null, src);
};
