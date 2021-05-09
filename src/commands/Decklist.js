// import chalk from 'chalk';
import { formats } from 'utils/magic';

const Decklist = {
  name: 'decklist',
  description: "(WIP) Displays decklist(s) filtered by format, archetype, player, date, and/or by a search query.",
  type: 'hidden',
  options: [
    {
      name: 'format',
      description: 'A specific format to return events from',
      type: 'string',
      required: false,
      choices: formats,
    },
    {
      name: 'archetype',
      description: 'A specific archetype to return decklists from',
      type: 'string',
      required: false,
    },
    {
      name: 'player',
      description: 'A specific player to return decklists from',
      type: 'string',
      required: false,
    },
    {
      name: 'date',
      description: 'A specific date to return events from in MM/DD/YY format',
      type: 'string',
      required: false,
    },
    {
      name: 'query',
      description: 'A search query to search for related decklists',
      type: 'string',
      required: false,
    },
  ],
  execute({ client, args }) {
    try {
      //
    } catch (error) {
      // console.error(
      //   chalk.cyan(`[/decklist]`)+
      //   chalk.grey(` archetype: `) + (!archetype ? chalk.white('None') : chalk.green(`\"${archetype}\"`))+
      //   chalk.grey(` player: `) + (!player ? chalk.white('None') : chalk.green(`\"${player}\"`))+
      //   chalk.grey(` date: `) + (!date ? chalk.white('None') : chalk.green(`\"${date}\"`))+
      //   chalk.grey(` query: `) + (!query ? chalk.white('None') : chalk.green(`\"${query}\"`))+
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

export default Decklist;
