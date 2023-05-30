const {ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require("discord.js");
const {cards} = require("../../constants/iluma");
const { searchObjectsByName, buildEmbed } = require("../../constants/utils");


module.exports = {
    data: {
        name: 'card-menu'
    },
    async execute(interaction, client) {
        const index = searchObjectsByName(interaction.values[0]);
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
            .setCustomId('give_random_card_menu');
        const disabledButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Get a random card')
            .setCustomId('give_random_card_menu')
            .setDisabled(true);

        await interaction.reply({
            embeds: [buildEmbed(client, index)],
            components: [new ActionRowBuilder().addComponents(button)],
        });

        const filter = (i) => i.customId === 'give_random_card_menu' && i.user.id === interaction.user.id;
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