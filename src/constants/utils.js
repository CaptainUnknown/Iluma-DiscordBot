const {cards} = require("./iluma");
const {EmbedBuilder} = require("discord.js");
const {
    color,
    imageBaseURL,
    thumbnailBaseURL,
    authorName,
    authorIcon,
    authorURL,
    footerText,
    redirectBaseURL
} = require("./constants");
const {IDs} = require("./scids");

const searchObjectsByName = (searchName) => {
    for (let i = 0; i < cards.length; i++) {
        const name = (cards[i].name).toLowerCase();
        if (name === (searchName).toLowerCase() || name.includes((searchName).toLowerCase())) {
            return i;
        }
    }
    return -1;
}

const filterByRarity = (rarity) => {
    const filteredMetadata = [];
    for (const data of cards) {
        if (data.attributes.Rarity === rarity) {
            filteredMetadata.push(data);
        }
    }
    return filteredMetadata;
}

const filterBySuit = (leftCards, suit) => {
    const filteredMetadata = [];
    for (const data of leftCards) {
        if (data.attributes.Suit === suit) {
            filteredMetadata.push(data);
        }
    }
    return filteredMetadata;
}

const getCID = (ipfsURL) => {
    return ipfsURL.split("://")[1].slice(0, -1)
}

const buildEmbed = (client, index) => {
    currentCard = cards[index];
    const hash = getCID(currentCard.image);
    const fields = [];
    for (const property in currentCard.attributes) {
        fields.push({
            name: property,
            value: currentCard.attributes[property],
            inline: true
        });
    }

    return new EmbedBuilder({
        title: currentCard.name,
        description: currentCard.description,
        color: color,
        image: {
            url: imageBaseURL + hash,
        },
        thumbnail: {
            url: thumbnailBaseURL + hash,
        },
        timestamp: new Date(),
        author: {
            name: authorName,
            iconURL: authorIcon,
            url: authorURL
        },
        footer: {
            text: footerText,
            iconURL: client.user.displayAvatarURL(),  // footerIconURL
        },
        url: redirectBaseURL + IDs[index],
        fields: fields
    });
}

module.exports = {
    searchObjectsByName: searchObjectsByName,
    filterBySuit: filterBySuit,
    filterByRarity: filterByRarity,
    buildEmbed: buildEmbed,
    getCID: getCID
};