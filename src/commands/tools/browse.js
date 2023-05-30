const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { filterByRarity, filterBySuit} = require('../../constants/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('browse')
        .setDescription('Browse by category 📚.')
        .addStringOption((option) =>
            option
                .setName('rarity')
                .setDescription("Rarity of the card.")
                .setAutocomplete(true)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('suit')
                .setDescription("Suit Attribute of the Card.")
                .setAutocomplete(true)
                .setRequired(true)
        ),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const optionSelected = interaction.options.getFocused(true).name;

        const rarityChoices = ["Mythic Ultra Rare", "Mythic Very Rare", "Mythic Rare", "Uncommon", "Common"];
        const suitChoices = ["Coins", "Cups", "Swords", "Wands", "NONE"];

        if (optionSelected === 'rarity') {
            const filtered = rarityChoices.filter(choice => choice.includes((focusedValue).toLowerCase()));
            await interaction.respond(
                filtered.map((choice) => ({ name: choice, value: choice })),
            );
        } else if (optionSelected === 'suit') {
            const filtered = suitChoices.filter(choice => choice.includes((focusedValue).toLowerCase()));
            await interaction.respond(
                filtered.map((choice) => ({ name: choice, value: choice })),
            );
        }
    },
    async execute(interaction, client) {
        const raritySelected = interaction.options.getString("rarity");
        const suitSelected = interaction.options.getString("suit");

        const matchingCards = filterBySuit(filterByRarity(raritySelected), suitSelected);

        if (matchingCards.length === 0) {
            await interaction.reply({
                content: `No cards found with the given parameters. Use Up arrow key to try with parameters 😉.`,
                ephemeral: true
            });
            return;
        }

        const menuOptions = [];
        for (const card of matchingCards) {
            menuOptions.push({
                label: card.name,
                description: card.description.substring(0, 50) + '...',
                value: card.name
            });
        }


        const menu = new StringSelectMenuBuilder()
            .setCustomId('card-menu')
            .setPlaceholder('Select a card')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(menuOptions);

        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(menu)]
        })
    }
}