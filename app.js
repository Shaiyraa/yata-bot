const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const Bot = require('./bot');

const bot = new Bot(process.env.DISCORD_TOKEN);
bot.init();
