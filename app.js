import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { randomRant, rants } from './rants.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }
    // "bonbot" command
    if (name === 'bonbot') {
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}`
      console.log(req.body.data);
      const rantPick = req.body.data.options ? req.body.data.options[0].value : randomRant();
      const rant = rants[rantPick];

      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: rant[0]},
      });

      for (const quote of rant.slice(1)) {
        await new Promise((res) => setTimeout(res, 2000)).then(() =>
          DiscordRequest(endpoint, {
            method: 'POST',
            body: {
              content: quote
            },
          }).then((r) => {
            console.log('OKAY', r)
            const endpoint = `webhooks/${process.env.APP_ID}/${r.body.token}/messages/${r.body.id}`;
            setTimeout( () => DiscordRequest(endpoint, { method: 'DELETE' }), 10000);
          })
        );
      }
      setTimeout( () => DiscordRequest(`webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`, { method: 'DELETE' }), 30000);
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});