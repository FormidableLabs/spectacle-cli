#!/usr/bin/env node

'use strict';

const prompts = require('prompts');
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
    type: 'text',
    name: 'Filename of markdown source',
    message: 'What is the filename of the markdown source?',
    validate: name =>
      name.includes('.md' || '.mdx')
        ? true
        : 'The file must be a mdx or md file'
  },
  {
    type: 'confirm',
    name: 'Custom Theme File',
    message: 'Do you have a custom theme file?',
    initial: false
  },
  {
    type: 'text',
    name: 'Custom Theme File name',
    message: 'What is the filename of the custom theme file?',
    // TODO : Only ask this question if 3 got a yes
    validate: name =>
      name.includes('.js' || '.json')
        ? true
        : 'The file must be a js or json file'
  },
  {
    type: 'confirm',
    name: 'Custom Template File',
    message: 'Do you have a custom template file?',
    initial: false
  },
  {
    type: 'text',
    name: 'Custom Template File name',
    message: 'What is the filename of the custom template file?',
    // TODO : Only ask this question if 5 got a yes, 'Ensure the file has either a jsx or js extension'
    validate: name =>
      name.includes('.js' || '.jsx')
        ? true
        : 'The file must be a jsx or js file'
  },
  { // TODO figure out why the prompt fails here
    // TODO Only ask this question if 1 was the server option
    type: 'number',
    name: 'Port',
    message: 'What port for the live server?',
    validate: port =>
      port.toString().length === '4' ? true : 'The port must be 4 numbers'
  }
];

(async () => {
  const response = await prompts(questions);
  console.log(response);
})();
