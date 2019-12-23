'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);

// Directory is empty or doesn't exist.
const isEmpty = dirPath =>
  readdir(dirPath)
    .then(files => files.length === 0)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return true;
      }
      throw err;
    });

module.exports = {
  isEmpty
};
