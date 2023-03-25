const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { cards } = require('../../constants/iluma');
const {
    color,
    footerText,
    imageBaseURL,
    authorIcon,
    authorURL,
    redirectBaseURL,
    thumbnailBaseURL,
    authorName,
    footerIconURL
} = require('../../constants/constants');


const getCID = (ipfsURL) => {
    return ipfsURL.split("://")[1].slice(0, -1)
}
const hash = getCID(cards[0].image);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Replies with Pong!'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const embed = new EmbedBuilder({
            title: 'Name!',
            description: `Name Test! \`${message.createdTimestamp - interaction.createdTimestamp}ms\``,
            color: color,
            image: {
                url: imageBaseURL + hash,  // client.user.displayAvatarURL()
            },
            // thumbnail: {
            //     url: thumbnailBaseURL + hash,  // client.user.displayAvatarURL()
            // },
            timestamp: new Date(),
            author: {
                name: authorName,
                iconURL: authorIcon,  // client.user.displayAvatarURL()
                url: authorURL
            },
            footer: {
                text: footerText,
                iconURL: footerIconURL,  // client.user.displayAvatarURL()
            },
            url: redirectBaseURL + hash
            // fields: [
            //     {
            //         name: 'Field 1',
            //         value: 'Hello, this is a field',
            //         inline: true
            //     }
            // ]
        });

        // const newMessage = `Pong! \`${message.createdTimestamp - interaction.createdTimestamp}ms\``;
        await interaction.editReply({
            embeds: [embed]
        });
    }
}