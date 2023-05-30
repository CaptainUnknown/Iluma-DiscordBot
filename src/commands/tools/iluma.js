const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Is Iluma bot online 🤔?'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        const newMessage = `I'm here 😃\nDelay:\`${message.createdTimestamp - interaction.createdTimestamp}ms\``;
        await interaction.editReply({
            content: newMessage
        });
    }
}