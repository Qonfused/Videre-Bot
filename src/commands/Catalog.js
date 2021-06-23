// import chalk from 'chalk';
// import { group } from "d3-array";
import { formats, eventTypes } from 'utils/magic';

const Catalog = {
  name: 'catalog',
  description: "(WIP) Displays most recent events by format, type, and/or date.",
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
      name: 'type',
      description: 'A specific event type to return events from',
      type: 'string',
      required: false,
      choices: eventTypes,
    },
    {
      name: 'date',
      description: 'A specific date to return events from in MM/DD/YY format',
      type: 'string',
      required: false,
    },
  ],
  execute({ client, args }) {

    try {
      //
    } catch (error) {
      // console.error(
      //   chalk.cyan(`[/catalog]`)+
      //   chalk.grey(` format: `) + (!format ? chalk.white('None') : chalk.green(`\"${format}\"`))+
      //   chalk.grey(` type: `) + (!type ? chalk.white('None') : chalk.green(`\"${type}\"`))+
      //   chalk.grey(` set: `) + (!set ? chalk.white('None') : chalk.green(`\"${set}\"`))+
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

export default Catalog;
