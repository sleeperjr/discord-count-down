import 'dotenv/config';
import { rantOptions } from './rants.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the quote subjects choices from rants.js
function createRantChoices() {
  const choices = rantOptions;
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice,
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

const RANT_COMMAND = {
  name: 'bonbot',
  description: 'Generate a rant',
  options: [
    {
      type: 3,
      name: 'topic',
      description: 'Pick your topic',
      required: false,
      choices: createRantChoices(),
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, RANT_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
