// import chalk from 'chalk';

const Event = {
  name: 'event',
  description: "(WIP) Displays an event by name, id, date, or search query.",
  type: 'hidden',
  // options
  execute({ client, args }) {
    try {
      //
    } catch (error) {
      // chalk error logging
      return {
        title: 'Error',
        description: error.message,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Event;
