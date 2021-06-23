import chalk from 'chalk';

// Handles the bot's ready state.
const ReadyEvent = {
  name: 'ready',
  execute(client) {
    try {
      // Log 'Ready' status
      // console.info(`${chalk.cyanBright('[Bot]')} Connected as ${client.user.tag}`);
    } catch (error) {
      console.warn(chalk.yellow(`ready >> ${error.stack}`));
    }
  },
};

export default ReadyEvent;
