'use strict';

const { readdir } = require('fs-extra');

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
