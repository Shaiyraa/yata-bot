const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const schedule = require('node-schedule');

class Bot {
  constructor(token) {
    this.client = new Discord.Client({
      intents: [
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.MessageContent,
      ],
    });
    this.token = token;
    this.rest = new REST({ version: '10' }).setToken(token);
    this.commands = [];
  }

  async _registerCommands() {
    try {
      const commandNames = await fs.promises.readdir('./commands/');
      this.commands = commandNames.map((cmd) =>
        require(`./commands/${cmd}/register.js`)
      );
    } catch (err) {
      console.error('Error occurred while reading directory!', err);
    }
  }

  async init() {
    // set activity
    this.client.once('ready', async () => {
      this.client.user.setPresence({
        activities: [{ name: 'type /help' }],
        status: 'idle',
      });
    });

    // register commands
    await this._registerCommands();

    try {
      console.log('Started refreshing application (/) commands.');
      await this.rest.put(
        Discord.Routes.applicationCommands(process.env.CLIENT_ID),
        {
          body: this.commands,
        }
      );
      this.client.login(this.token);
    } catch (err) {
      console.log(err);
    }

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const commandFile = require(`./commands/${interaction.commandName}/command`);
      if (commandFile) {
        await commandFile.run(this.client, interaction);
      }
    });

    this.createJobs();
  }

  async createJobs() {
    const array = fs.readFileSync('active-jobs.txt').toString().split('\r\n');

    array.forEach(async (record) => {
      const [guildId, type, hour, day, channelId] = record.split('_');
      const dayOfWeek = day * 1;
      if (!channelId) return;
      const guild = await this.client.guilds.fetch(guildId);
      const channel = await guild.channels.fetch(channelId);

      const rule = new schedule.RecurrenceRule();
      rule.tz = 'Europe/Copenhagen';
      rule.hour = hour * 1;
      if (dayOfWeek !== 99) rule.dayOfWeek = dayOfWeek;

      const job = schedule.scheduleJob(
        `${guildId}_${type}_${hour}_${dayOfWeek}_${channel.id}`,
        rule,
        async function () {
          const allMessages = await channel.messages.fetch();
          const deletable = allMessages.filter((message) => !message.pinned);
          await channel.bulkDelete(deletable, true);
        }
      );

      console.log('Jobs rescheduled!');
    });
  }
}

module.exports = Bot;
