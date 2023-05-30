const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { buildEmbed } = require('../../constants/utils');
const { cards } = require('../../constants/iluma');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('iluma')
        .setDescription('Get your lucky card ✨!'),
    async execute(interaction, client) {
        const index = Math.floor(Math.random() * cards.length);

        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Randomize')
            .setCustomId('give_random');
        const disabledButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Randomize')
            .setCustomId('give_random')
            .setDisabled(true);

        await interaction.reply({
            embeds: [buildEmbed(client, index)],
            components: [new ActionRowBuilder().addComponents(button)],
        });

        const filter = i => i.customId === 'give_random' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 600000 });

        collector.on('collect', async (i) => {
            const randomIndex = Math.floor(Math.random() * cards.length);
            await i.update({
                embeds: [buildEmbed(client, randomIndex)],
                components: [new ActionRowBuilder().addComponents(button)],
            });
        });
        collector.on('end', async (collected) => {
            console.log(`Collected ${collected.size} items`);
            await interaction.editReply({
                embeds: [buildEmbed(client, index)],
                components: [new ActionRowBuilder().addComponents(disabledButton)],
            })
        });
    }
}