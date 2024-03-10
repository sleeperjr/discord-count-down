import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { rantOptions } from './rants.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Get the quote subjects choices from game.js
function createRantChoices() {
  const choices = rantOptions;
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};

const RANT_COMMAND = {
  name: 'bonbot',
  description: 'Generate a rant',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your topic',
      required: false,
      choices: createRantChoices(),
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND, RANT_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
