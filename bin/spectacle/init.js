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
    message: 'What is the filename of the markdown source?'
    // TODO below
    // validate: 'Ensure the file has either a md or mdx extension'
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
    message: 'What is the filename of the custom theme file?'
    // TODO : Only ask this question if 3 got a yes
    // validate: 'Ensure the file has either a json or js extension'
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
    message: 'What is the filename of the custom template file?'
    // TODO : Only ask this question if 5 got a yes
    // validate: 'Ensure the file has either a jsx or js extension'
  },
  {
    type: 'number',
    name: 'Port',
    message: 'What port for the live server?'
    // TODO below
    // validate: 'Ensure the response is a 4-digit number'
  }
];

(async () => {
  const response = await prompts(questions);
  console.log(response); // => { value: 24 }
})();
