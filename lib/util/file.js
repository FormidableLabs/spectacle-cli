'use strict';

const fs = require('fs');
const { promisify } = require('util');

const stat = promisify(fs.stat);
const exists = filePath =>
  stat(filePath)
    .then(() => true)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return false;
      }
      throw err;
    });

module.exports = {
  exists
};
