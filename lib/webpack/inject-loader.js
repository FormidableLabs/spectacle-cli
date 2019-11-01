'use strict';

// Inject simple replacements based on regex patterns.
//
// **Note**: Should only be used with the entry point.
module.exports = function(src) {
  // Loader state.
  this.cacheable(true);
  const callback = this.async();

  // Unpack options.
  const {
    query: { replacements }
  } = this;

  // Perform replacements.
  replacements.forEach(({ pattern, replacement }) => {
    src = src.replace(pattern, replacement);
  });

  return callback(null, src);
};
