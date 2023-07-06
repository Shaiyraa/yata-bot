const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

const testCommand = new SlashCommandBuilder()
  .setName('schedule')
  .setDescription('Schdeule when you want messages to be deleted')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcommand) =>
    subcommand
      .setName('weekly')
      .setDescription('Delete messages on a weekly basis')
      .addStringOption((option) =>
        option
          .setName('day')
          .setDescription('The day of the week you want messages to be deleted')
          .setRequired(true)
          .addChoices(
            { name: 'Monday', value: '1' },
            { name: 'Tuesday', value: '2' },
            { name: 'Wednesday', value: '3' },
            { name: 'Thursday', value: '4' },
            { name: 'Friday', value: '5' },
            { name: 'Saturday', value: '6' },
            { name: 'Sunday', value: '0' }
          )
      )
      .addStringOption((option) =>
        option
          .setName('hour')
          .setDescription('The hour of the day you want messages to be deleted')
          .setRequired(true)
          .addChoices(
            { name: '00:00', value: '0' },
            { name: '01:00', value: '1' },
            { name: '02:00', value: '2' },
            { name: '03:00', value: '3' },
            { name: '04:00', value: '4' },
            { name: '05:00', value: '5' },
            { name: '06:00', value: '6' },
            { name: '07:00', value: '7' },
            { name: '08:00', value: '8' },
            { name: '09:00', value: '9' },
            { name: '10:00', value: '10' },
            { name: '11:00', value: '11' },
            { name: '12:00', value: '12' },
            { name: '13:00', value: '13' },
            { name: '14:00', value: '14' },
            { name: '15:00', value: '15' },
            { name: '16:00', value: '16' },
            { name: '17:00', value: '17' },
            { name: '18:00', value: '18' },
            { name: '19:00', value: '19' },
            { name: '20:00', value: '20' },
            { name: '21:00', value: '21' },
            { name: '22:00', value: '22' },
            { name: '23:00', value: '23' }
          )
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setRequired(true)
          .setDescription('The channel to delete messages from')
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('daily')
      .setDescription('Delete messages on a daily basis')
      .addStringOption((option) =>
        option
          .setName('hour')
          .setDescription('The hour of the day you want messages to be deleted')
          .setRequired(true)
          .addChoices(
            { name: '00:00', value: '0' },
            { name: '01:00', value: '1' },
            { name: '02:00', value: '2' },
            { name: '03:00', value: '3' },
            { name: '04:00', value: '4' },
            { name: '05:00', value: '5' },
            { name: '06:00', value: '6' },
            { name: '07:00', value: '7' },
            { name: '08:00', value: '8' },
            { name: '09:00', value: '9' },
            { name: '10:00', value: '10' },
            { name: '11:00', value: '11' },
            { name: '12:00', value: '12' },
            { name: '13:00', value: '13' },
            { name: '14:00', value: '14' },
            { name: '15:00', value: '15' },
            { name: '16:00', value: '16' },
            { name: '17:00', value: '17' },
            { name: '18:00', value: '18' },
            { name: '19:00', value: '19' },
            { name: '20:00', value: '20' },
            { name: '21:00', value: '21' },
            { name: '22:00', value: '22' },
            { name: '23:00', value: '23' }
          )
      )
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setRequired(true)
          .setDescription('The channel to delete messages from')
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('list-jobs').setDescription('List all scheduled jobs')
  );

module.exports = testCommand.toJSON();
