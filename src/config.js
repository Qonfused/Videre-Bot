import dotenv from 'dotenv';

dotenv.config();

// Bot config vars
const config = {
  // Discord bot prefix
  prefix: process.env.PREFIX || '!',
  // Whitelisted Global commands
  globalCommands: ['card'],
  // Server for local testing of slash commands
  guild: process.env.GUILD,
  // Server for mana symbol emojis
  emojiGuild: process.env.EMOJI_GUILD,
  // Discord bot token
  token: process.env.TOKEN,
  // Database DATABASE_URL
  database: process.env.DATABASE_URL,
  // Imgur API
  client_id: process.env.CLIENT_ID,
  api_key: process.env.API_KEY,
};

export default config;
