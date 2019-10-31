#!/usr/bin/env node

const { parse } = require('./args');

// const actions = require('./actions');

// TODO: Integrate and remove
// Promise.resolve()
// // Parse arguments.
// .then(args.parse)
// .then(parsedInput => {
//   const mdxFilePath = parsedInput.mdx;
//   const themeFilePath = parsedInput.theme;
//   const title = parsedInput.title;
//   const port = parsedInput.port;
//   if (mdxFilePath) {
//     actions.launchMDXServer(mdxFilePath, themeFilePath, title, port);
//   }
//   // add future actions here
//   else {
//     throw new Error('Unsupported action.');
//   }
// });

const main = async () => {
  const args = await parse();

  console.log("TODO: HERE", { args });
};

if (require.main === module) {
  main().catch(err => {
    // Try to get full stack, then full string if not.
    console.error(err.stack || err.toString());
    process.exit(1);
  });
}
