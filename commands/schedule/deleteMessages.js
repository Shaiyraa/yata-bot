const fs = require('fs');
const schedule = require('node-schedule');
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js');

class DeleteMessages {
  constructor(interaction) {
    this.interaction = interaction;
    this.args = this.interaction.options.data[0].options;
  }

  weekly() {
    const [day, hour, { channel }] = this.args;

    if (!channel || channel.type !== 0)
      return this.interaction.reply({
        content: 'Invalid channel!',
        ephemeral: true,
      });

    // check if job already exists
    const guildId = this.interaction.guildId;

    const array = fs.readFileSync('active-jobs.txt').toString().split('\r\n');

    let found = false;
    array.forEach((record) => {
      if (record === `${guildId}_weekly_${hour}_${day.value}_${channel.id}`) {
        found = true;
        this.interaction.reply({
          content: 'Weekly job for this channel already exists!',
          ephemeral: true,
        });
      }
    });

    if (found) return;
    let stream = fs.createWriteStream('active-jobs.txt', { flags: 'a' });
    stream.once('open', (fd) => {
      stream.write(
        `${guildId}_weekly_${hour.value}_${day.value}_${channel.id}` + '\r\n'
      );
    });

    // schedule job
    const rule = new schedule.RecurrenceRule();
    rule.hour = hour.value * 1;
    rule.minute = 0;
    rule.dayOfWeek = day.value;
    rule.tz = 'Europe/Copenhagen';

    const job = schedule.scheduleJob(
      `${guildId}_weekly_${hour}_${day.value}_${channel.id}`,
      rule,
      async function () {
        const allMessages = await channel.messages.fetch();
        const deletable = allMessages.filter((message) => !message.pinned);
        await channel.bulkDelete(deletable, true);
      }
    );

    this.interaction.reply({
      content: 'Weekly messages deletion scheduled!',
      ephemeral: true,
    });
  }

  daily() {
    const [hour, { channel }] = this.args;
    if (channel.type !== 0)
      return this.interaction.reply({
        content: 'Invalid channel!',
        ephemeral: true,
      });

    // check if job already exists
    const guildId = this.interaction.guildId;

    const array = fs.readFileSync('active-jobs.txt').toString().split('\r\n');

    let found = false;
    array.forEach((record) => {
      if (record === `${guildId}_daily_${hour.value}_99_${channel.id}`) {
        found = true;
        this.interaction.reply({
          content: 'Daily job for this channel already exists!',
          ephemeral: true,
        });
      }
    });

    if (found) return;
    let stream = fs.createWriteStream('active-jobs.txt', { flags: 'a' });
    stream.once('open', (fd) => {
      stream.write(`${guildId}_daily_${hour.value}_99_${channel.id}` + '\r\n');
    });

    // schedule job
    const rule = new schedule.RecurrenceRule();
    rule.hour = hour.value * 1;
    rule.tz = 'Europe/Copenhagen';

    const job = schedule.scheduleJob(
      `${guildId}_daily_${hour.value}_99_${channel.id}`,
      rule,
      async function () {
        const allMessages = await channel.messages.fetch();
        const deletable = allMessages.filter((message) => !message.pinned);
        await channel.bulkDelete(deletable, true);
      }
    );

    this.interaction.reply({
      content: 'Daily messages deletion scheduled!',
      ephemeral: true,
    });
  }

  async listActiveJobs() {
    const jobNames = Object.keys(schedule.scheduledJobs);
    if (!jobNames.length)
      return this.interaction.reply({
        content: 'No active jobs!',
        ephemeral: true,
      });

    this.interaction.reply({
      content: 'Active jobs:',
      ephemeral: true,
    });

    for (let name of jobNames) {
      const [guildId, type, hour, day, channelId] = name.split('_');
      const channel = await this.interaction.guild.channels.fetch(channelId);

      const daysOfWeek = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
      };

      const response = await this.interaction.channel.send({
        content: `Type: ${type}\nHour: ${hour}:00\n${
          day * 1 === 99 ? '' : `Day: ${daysOfWeek[day]}\n`
        }Channel: ${channel}`,
        ephemeral: true,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(name)
              .setLabel('Delete')
              .setStyle(ButtonStyle.Danger)
          ),
        ],
      });

      const filter = (i) => i.user.id === this.interaction.user.id;
      try {
        const collector = response.createMessageComponentCollector({
          filter,
          dispose: true,
          time: 60000,
        });
        collector.on('collect', async (interaction) => {
          if (interaction.customId === name) {
            schedule.cancelJob(name);

            const array = fs
              .readFileSync('active-jobs.txt')
              .toString()
              .split('\r\n');
            array.forEach((record, i) => {
              if (
                record ===
                `${interaction.guildId}_${type}_${hour}_${day}_${channelId}`
              ) {
                array.splice(i, 1);
                fs.writeFileSync('active-jobs.txt', array.join('\r\n'));
              }
            });

            interaction.reply({
              content: 'Job deleted!',
              ephemeral: true,
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports = DeleteMessages;
