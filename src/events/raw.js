import chalk from 'chalk';
const Discord = require('discord.js');

import { INTERACTION_RESPONSE_TYPE } from 'constants';
import { validateMessage } from 'utils/discord';

// Handles websocket events.
const RawEvent = {
  name: 'raw',
  async execute(client, packet) {
    try {
      if (packet.t !== 'INTERACTION_CREATE') return;

      const interaction = packet.d;

      // Initial Deferred Response
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: { type: INTERACTION_RESPONSE_TYPE.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE },
      });

      const { name, options } = interaction.data;

      const command = client.commands.get(name);
      if (!command) return;

      let args = (options && options.length > 0) ? options.reduce((object, { name, value }) => {
        object[name] = value;
        return object;
      }, {}) : {};

      const output = await command.execute({ client, interaction, args });
      if (!output) return;

      // Send follow-up response through `WebhookClient`
      new Discord.WebhookClient(client.user.id, interaction.token).send(validateMessage(output));

      // return client.send(interaction, output);
    } catch (error) {
      console.error(chalk.red(`raw >> ${error.stack}`));
    }
  },
};

export default RawEvent;
