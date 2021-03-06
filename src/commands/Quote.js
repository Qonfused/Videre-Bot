import chalk from 'chalk';

const Help = {
    name: 'quote',
    description: "Quotes a message by a provided message link.",
    type: 'global',
    options: [
        {
            name: 'message-link',
            description: 'A link from Discord to the desired message.',
            type: 'string',
            required: true,
        },
    ],
    async execute({ client, args }) {
        try {
            const [guildID, channelID, messageID] = args['message-link'].split('https://discord.com/channels/')[1].split('/');

            const channel = await client.channels.fetch(channelID);
            const message = await channel.messages.fetch(messageID);

            const avatarURL = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=128`;
            const channelIcon = `https://cdn.discordapp.com/icons/${guildID}/${message.guild.icon}.webp?size=128`;

            let embed = {
                author: {
                    name: `${message.author.username}#${message.author.discriminator} (Jump to message)`,
                    url: `https://discord.com/channels/${[guildID, channelID, messageID].join('/')}`,
                    icon_url: avatarURL,
                },
                footer: {
                    text: `Sent in #${channel.name} from ${message.guild.name}`,
                    icon_url: channelIcon,
                },
                timestamp: message.createdTimestamp,
            };

            if (message?.embeds.length > 0 && message?.embeds[0]?.type == 'rich') {
                if (message.embeds.length == 1) {
                    if (message.embeds[0]?.title) embed.title = message.embeds[0].title;
                    if (message.embeds[0]?.url) embed.url = message.embeds[0].url;
                    if (message.embeds[0]?.description) embed.description = message.embeds[0].description;
                    if (message.embeds[0]?.fields) embed.fields = message.embeds[0].fields;
                    if (message.embeds[0]?.image) embed.image = message.embeds[0].image;
                    if (message.embeds[0]?.thumbnail) embed.thumbnail = message.embeds[0].thumbnail;
                } else {
                    embed.description = `\`[ Embeds: ${message.embeds.length} ]\``;
                }
                if (!message?.content) return embed;
            }

            if (message?.content) {
                if (message.content.match(/.(jpg|jpeg|png|gif)$/i) && (message.content.match(/ /g) || []).length == 0) {
                    embed.image = { 'url': message.content };
                } else {
                    embed.description = message.content;
                }
            }

            if (message?.attachments.array().length > 0) {
                if (message.attachments.array()[0]?.height > 0) {
                    embed.image = { 'url': message.attachments.array()[0].url };
                } else {
                    embed.description = `\`[ Attachment: ${message.attachments.array()[0].name} ]\``;
                }
            }

            return embed;

        } catch (error) {
            console.error(chalk.cyan(`[/quote]`) + chalk.grey('\n>> ') + chalk.red(`Error: ${error.message}`));
            return {
                title: 'Error',
                description: `An error occured while quoting a message.`,
                color: 0xe74c3c,
                ephemeral: true,
            };
        }
    },
};

export default Help;
