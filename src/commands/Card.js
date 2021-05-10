// import chalk from 'chalk';
import config from 'config';
const fetch = require('node-fetch');

import { manamoji } from 'utils/manamoji';

const Card = {
  name: 'card',
  description: "Returns a card by name via Scryfall.",
  type: 'global',
  options: [
    {
      name: 'name',
      description: 'A cardname to find a card via Scryfall.',
      type: 'string',
      required: true,
    },
    {
      name: 'set',
      description: 'A specific 3-letter set code to limit the search to.',
      type: 'string',
    },
    {
      name: 'prices',
      description: 'Flag to show card prices and price history instead.',
      type: 'boolean',
    },
    // {
    //   name: 'decks',
    //   description: 'Flag to show card matches in archetype decklists instead.',
    //   type: 'boolean',
    // },
  ],
  async execute({ client, args }) {

    const name = args?.name;
    const set = args?.set;
    const prices = args?.prices;
    const decks = args?.decks;

    try {
      let scryfallURL = `https://api.scryfall.com/cards/named?fuzzy=${name}`;
      if (set) scryfallURL += `&set=${set.replace(/[^0-9A-Z]+/gi,"")}`;

      let response = await fetch(scryfallURL);

      // Handle conditions for invalid Scryfall response by each query parameter and condition
      if (response.status !== 200) {
        // Get fuzzy response without set
        const response_1 = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${name}`);
        let data = await response_1.json();
        if (response_1.status !== 200) {
          if (data.object === "error" || data.type === "ambiguous")
          throw new Error(`Multiple different cards match the requested cardname.\nPlease refine your search by adding more words or specifying a set code.`);
          // Handle miscellaneous errors
          throw new Error(`The requested card could not be found.`);
        }

        // Get and handle missing card printings
        const response_2 = await fetch(data.prints_search_uri);
        if (response_2.status !== 200) throw new Error(`No printings for the requested card could be found.`);
        let printings = await response_2.json();

        // Get and handle invalid set parameter
        let sets = printings['data'].map(({ set }) => set);
        let message = 'No match was found for the requested card in the specified set.';
        if (sets.length > 0) {
          let url = `https://scryfall.com/search?as=grid&order=released&q=%21%22${data?.name.replace(/\s/g, '%20')}%22&unique=prints`;
          message += `\nHowever, [${sets.length} available printings](${url}) were found.`;
        }
        if (sets.includes(set) !== true) return {
          title: 'Error',
          description: message,
          thumbnail: {
            url: !data?.card_faces ? data.image_uris.png : (!data.card_faces[0]?.image_uris ? data.image_uris.png : data.card_faces[0].image_uris.png)
          },
          footer: {
            text: [
                `🖌 ${data.artist}`,
                `${data.set.toUpperCase()} (${data.lang.toUpperCase()}) #${data.collector_number}`,
                data.rarity.replace(/^\w/, (c) => c.toUpperCase())
              ].join(' • ')
          },
          color: 0xe74c3c,
          ephemeral: true,
        };

        // Handle other miscellaneous errors
        throw new Error(`An error occured while fetching the requested card.`);
      }

      const data = await response.json();

      const cardTitle = (!data?.card_faces) ? manamoji(
        client.guilds.resolve(config.emojiGuild),
          [data.name, data.mana_cost].join(' ')
        ) : manamoji(
        client.guilds.resolve(config.emojiGuild), [
          `${data.card_faces[0].name} ${data.card_faces[0].mana_cost}`,
          `${data.card_faces[1].name} ${data.card_faces[1].mana_cost}`
        ].join(' // '));

      const thumbnailImage = !data?.card_faces ? data.image_uris.png : (!data.card_faces[0]?.image_uris ? data.image_uris.png : data.card_faces[0].image_uris.png);

      const footerText = [
          `🖌 ${data.artist}`,
          `${data.set.toUpperCase()} (${data.lang.toUpperCase()}) #${data.collector_number}`,
          data.rarity.replace(/^\w/, (c) => c.toUpperCase())
        ].join(' • ');

      if (prices !== true && decks !== true) {

        if (!data?.card_faces) {
          let cardText = manamoji(
            client.guilds.resolve(config.emojiGuild),
            [data.type_line, data.oracle_text.replace(/\*/g, '\\*')].join('\n')
            .replace(/(\([^)]+\))/g, '*$1*')
          );

          if (data?.flavor_text) cardText += `\n*${data.flavor_text.replace(/\*/g, '')}*`;
          if (data?.power && data?.toughness) cardText += `\n${data.power.replace(/\*/g, '\\*')}/${data.toughness.replace(/\*/g, '\\*')}`;
          if (data?.loyalty) cardText += `\nLoyalty: ${data.loyalty.replace(/\*/g, '\\*')}`;

          return {
            title: cardTitle,
            url: data.scryfall_uri,
            description: cardText,
            thumbnail: {
              url: thumbnailImage
            },
            footer: {
              text: footerText
            },
          };
        } else {
          let cardText = manamoji(
            client.guilds.resolve(config.emojiGuild),
            `**${data.card_faces[0].name}** ${data.card_faces[0].mana_cost}`
          );

          cardText += "\n" + manamoji(
            client.guilds.resolve(config.emojiGuild),
            [data.card_faces[0].type_line, data.card_faces[0].oracle_text].join('\n')
            .replace(/\*/g, '\\*')
            .replace(/(\([^)]+\))/g, '*$1*')
          );

          if (data.card_faces[0]?.flavor_text) cardText += `\n*${data.card_faces[0].flavor_text.replace(/\*/g, '')}*`;
          if (data.card_faces[0]?.power && data.card_faces[0]?.toughness) cardText += `\n${data.card_faces[0].power.replace(/\*/g, '\\*')}/${data.card_faces[0].toughness.replace(/\*/g, '\\*')}`;
          if (data.card_faces[0]?.loyalty) cardText += `\nLoyalty: ${data.card_faces[0].loyalty.replace(/\*/g, '\\*')}`;

          cardText += "\n---------\n" + manamoji(
            client.guilds.resolve(config.emojiGuild),
            `**${data.card_faces[1].name}** ${data.card_faces[1].mana_cost}`
          );

          cardText += "\n" + manamoji(
            client.guilds.resolve(config.emojiGuild),
            [data.card_faces[1].type_line, data.card_faces[1].oracle_text].join('\n')
            .replace(/\*/g, '\\*')
            .replace(/(\([^)]+\))/g, '*$1*')
          );

          if (data.card_faces[1]?.flavor_text) cardText += `\n*${data.card_faces[1].flavor_text.replace(/\*/g, '\\*')}*`;
          if (data.card_faces[1]?.power && data.card_faces[1]?.toughness) cardText += `\n${data.card_faces[1].power.replace(/\*/g, '\\*')}/${data.card_faces[1].toughness.replace(/\*/g, '\\*')}`;
          if (data.card_faces[1]?.loyalty) cardText += `\nLoyalty: ${data.card_faces[1].loyalty.replace(/\*/g, '\\*')}`;

          return {
            title: cardTitle,
            url: data.scryfall_uri,
            description: cardText,
            thumbnail: {
              url: thumbnailImage
            },
            footer: {
              text: footerText
            },
          };
        }

      } else if (decks !== true) {

        const child_process = require("child_process");
        const cardPrices = await child_process.execSync(`python ./src/utils/cardPrices.py --cardname "${ data.name }" --set "${ data.set.toUpperCase() }"`);

        const json = cardPrices.toString().length > 2 ? JSON.parse(cardPrices.toString()) : {};
        const imageStream = cardPrices.toString().length > 2 ? new Buffer.from(json?.graph, 'base64') : {};

        const description = `Showing results for **${data.set_name}** (**${data.set.toUpperCase()}**):`;

        let evalPrice = (item) => typeof item === 'object' ? '—' : (item > -1 ? item : '—');

        const message = {
          title: `Price History for ${cardTitle}`,
          description: description,
          fields: [
            { name: 'USD', value: `$**${ evalPrice(data.prices?.usd) }** | $**${ evalPrice(data.prices?.usd_foil) }**`, inline: true },
            { name: 'EUR', value: `€**${ evalPrice(data.prices?.eur) }** | €**${ evalPrice(data.prices?.eur_foil) }**`, inline: true },
            { name: 'TIX', value: `**${ evalPrice(data.prices?.tix) }** tix | **${ evalPrice(data.prices?.tix_foil) }** tix`, inline: true },
          ],
          thumbnail: {
            url: thumbnailImage,
          },
          footer: {
            "text" : footerText,
          },
          color: '#3498DB',
        };

        if (cardPrices.toString().length > 2) {
          message.url = json?.url;
          message.image = { url: 'attachment://file.jpg' };
          message.files = [imageStream];
        } else {
          if (data?.prices?.usd || data?.prices?.eur || data?.prices?.tix) {
            message.description = `No price history found for **${data.set_name}** (**${data.set.toUpperCase()}**).`;
          } else {
            message.description = `No prices found for **${data.set_name}** (**${data.set.toUpperCase()}**).`;
            message.fields = [];

            const response_2 = await fetch(data.prints_search_uri);
            let printings = await response_2.json();

            let sets = printings['data'].map(({ set }) => set);
            if (sets.length > 0) {
              let url = `https://scryfall.com/search?as=grid&order=released&q=%21%22${data?.name.replace(/\s/g, '%20')}%22&unique=prints`;
              message.description += `\nHowever, [${sets.length-1} other available printings](${url}) were found.`;
            }
          }
        }

        return message;

      }

      // Handle decklist results

    }  catch (error) {
      // console.error(
      //   chalk.cyan(`[/card]`)+
      //   chalk.grey(` name: `) + chalk.green(`\"${name}\"`)+
      //   chalk.grey(` set: `) + (!set ? chalk.white('None') : chalk.green(`\"${set}\"`))+
      //   chalk.grey(` prices: `) + (!prices ? chalk.white('None') : chalk.yellow(prices))+
      //   chalk.grey(` decks: `) + (!decks ? chalk.white('None') : chalk.yellow(decks))+
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

export default Card;
