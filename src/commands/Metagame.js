// import chalk from 'chalk';
import { formats, eventTypes } from 'utils/magic';

const Metagame = {
  name: 'metagame',
  description: "(WIP) Displays a metagame breakdown of decks from the most recent events by format.",
  type: 'hidden',
  options: [
    {
      name: 'format',
      description: 'A specific format to return metagame data from',
      type: 'string',
      required: false,
      choices: formats,
    },
  ],
  execute({ client, args }) {
    try {
      //
    } catch (error) {
      // console.error(
      //   chalk.cyan(`[/metagame]`)+
      //   chalk.grey(` format: `) + (!format ? chalk.white('None') : chalk.green(`\"${format}\"`))+
      //   chalk.grey('\n>> ') + chalk.red(`Error: ${error.message}`)
      // );
      return {
        title: 'Error',
        description: error.message,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Metagame;
