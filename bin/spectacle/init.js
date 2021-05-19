#!/usr/bin/env node

'use strict';

const prompts = require('prompts');

const mdRegex = /(\.mdx$|\.md$)/gm;
const jsRegex = /(\.json$|\.js$)/gm;
const jsxRegex = /(\.jsx$|\.js$)/gm;
const { pathExists } = require('fs-extra');

const questions = [
  {
    type: 'select',
    name: 'action',
    message: 'Create a live server or build path?',
    choices: [
      { title: 'Server', value: 'server' },
      { title: 'Build', value: 'build' }
    ]
  },
  {
    type: prev => (prev === 'server' ? 'number' : null),
    name: 'port',
    message: 'What port for the live server?',
    validate: val => {
      // eslint-disable-next-line no-magic-numbers
      if (val > 0) {
        return true;
      }
      return 'The port should be a positive integer';
    }
  },
  {
    type: 'text',
    name: 'src',
    message:
      'What is the file path of the markdown source? Include the file extension',
    validate: async filepath => {
      const filePathExists = await pathExists(filepath);
      if (!filePathExists || !filepath.match(mdRegex)) {
        return 'Error, cannot find that file at the path specified. The file must have a .md or .mdx extension.';
      }
      return true;
    }
  },
  {
    type: 'confirm',
    name: 'custom_theme',
    message: 'Do you have a custom theme file?',
    initial: false
  },
  {
    // eslint-disable-next-line no-constant-condition
    type: prev => (prev ? 'text' : null),
    name: 'theme',
    message:
      'What is the file path of the custom theme file? Include the file extension',
    validate: async filepath => {
      const filePathExists = await pathExists(filepath);
      if (!filePathExists || !filepath.match(jsRegex)) {
        return 'Error, cannot find that file at the path specified. The file must have a .js or .json extension.';
      }
      return true;
    }
  },
  {
    type: 'confirm',
    name: 'custom_template',
    message: 'Do you have a custom template file?',
    initial: false
  },
  {
    // eslint-disable-next-line no-constant-condition
    type: prev => (prev ? 'text' : null),
    name: 'template',
    message:
      'What is the file path of the custom template file? Include the file extension.',
    validate: async filepath => {
      const filePathExists = await pathExists(filepath);
      if (!filePathExists || !filepath.match(jsxRegex)) {
        return 'Error, cannot find that file at the path specified. The file must have a .js or .jsx extension.';
      }
      return true;
    }
  }
];

const promptArgs = async () => {
  const response = await prompts(questions);
  const { action, src, theme, port, template } = response;
  return { action, src, theme, port, template };
};

module.exports = { promptArgs };
