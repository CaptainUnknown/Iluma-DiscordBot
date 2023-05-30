const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { cards } = require('../../constants/iluma');
const { searchObjectsByName, buildEmbed } = require('../../constants/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('Read about a card 🎴!')
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("name of the card")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const name = interaction.options.getString("name");
        const index = searchObjectsByName(name);
        if (index === -1) {
            await interaction.reply({
                content: "Card not found! 😔",
                ephemeral: true
            });
            return;
        }

        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Get a random card')
            .setCustomId('give_random_card');
        const disabledButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Get a random card')
            .setCustomId('give_random_card')
            .setDisabled(true);

        await interaction.reply({
            embeds: [buildEmbed(client, index)],
            components: [new ActionRowBuilder().addComponents(button)],
        });

        const filter = (i) => i.customId === 'give_random_card' && i.user.id === interaction.user.id;
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