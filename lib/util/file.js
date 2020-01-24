'use strict';

const path = require('path');
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

// Find the resolved root of an installed package.
const findPkgRoot = name =>
  path.dirname(require.resolve(`${name}/package.json`));

module.exports = {
  isEmpty,
  findPkgRoot
};
