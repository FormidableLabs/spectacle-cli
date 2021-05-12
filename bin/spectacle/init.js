#!/usr/bin/env node

'use strict';

const prompts = require('prompts');

const mdRegex = /(\.mdx$|\.md$)/gm;
const jsRegex = /(\.json$|\.js$)/gm;
const jsxRegex = /(\.jsx$|\.js$)/gm;

const questions = [
  {
    type: 'select',
    name: 'Server or Build',
    message: 'Create a live server or build directory?',
    choices: [
      { title: 'Server', value: 'server' },
      { title: 'Build', value: 'build' }
    ]
  },
  {
    type: prev => (prev === 'server' ? 'number' : null),
    name: 'Port',
    message: 'What port for the live server?',
    validate: val => {
      const numLength = val.toString().length;
      if (numLength === 4) {
        return val;
      }
      return 'The port should be 4 numbers';
    }
  },
  {
    type: 'text',
    name: 'Filename of markdown source',
    message: 'What is the filename of the markdown source?',
    validate: name =>
      name.match(mdRegex) ? true : 'The file must be a mdx or md file'
  },
  {
    type: 'confirm',
    name: 'Custom Theme File',
    message: 'Do you have a custom theme file?',
    initial: false
  },
  {
    // eslint-disable-next-line no-constant-condition
    type: prev => (prev === 'y' || 'yes' ? 'text' : null),
    name: 'Custom Theme File name',
    message: 'What is the filename of the custom theme file?',
    // TODO : Only ask this question if 3 got a yes
    validate: name =>
      name.match(jsRegex) ? true : 'The file must be a js or json file'
  },
  {
    type: 'confirm',
    name: 'Custom Template File',
    message: 'Do you have a custom template file?',
    initial: false
  },
  {
    // eslint-disable-next-line no-constant-condition
    type: prev => (prev === 'y' || 'yes' ? 'text' : null),
    name: 'Custom Template File name',
    message: 'What is the filename of the custom template file?',
    validate: name =>
      name.match(jsxRegex) ? true : 'The file must be a jsx or js file'
  }
];

(async () => {
  const response = await prompts(questions);
  console.log(response);
})();
