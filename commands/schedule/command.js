const { PermissionsBitField } = require('discord.js');
const DeleteMessages = require('./deleteMessages');

module.exports.run = async (bot, interaction) => {
  const commandName = interaction.options.getSubcommand();
  const deleteMessages = new DeleteMessages(interaction);

  switch (commandName) {
    case 'weekly': {
      deleteMessages.weekly();
      break;
    }

    case 'daily': {
      deleteMessages.daily();
      break;
    }
    case 'list-jobs': {
      deleteMessages.listActiveJobs();
      break;
    }
    default: {
      break;
    }
  }
};
