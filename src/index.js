// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import dotenv from 'dotenv';
import { join } from 'path';

// Import required bot configuration.
const ENV_FILE = join(__dirname, '../.env');

dotenv.config({ path: ENV_FILE });

import { createServer } from 'restify';

import createBotFrameworkAdapter from './createBotFrameworkAdapter';
import EchoBot from './bot';
import setupAPI from './api/index';

async function main() {
  // Create HTTP server
  const server = createServer();

  server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
  });

  // Create adapter.
  const adapter = await createBotFrameworkAdapter();

  // Create the main dialog.
  const bot = new EchoBot();

  setupAPI(server, { adapter, bot, env: process.env });
}

main();
