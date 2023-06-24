"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const generateResultsPayload = (week, slug, eventStanding) => {
    const embed = new builders_1.EmbedBuilder()
        .setColor(0xefff00)
        .setTitle(`Week ${week} | Ultimate Singles Top 3`)
        .setURL(`https://start.gg/${slug}`);
    if (eventStanding.data) {
        eventStanding.data.event.standings.nodes.forEach((node) => {
            embed.addFields({
                name: `#${node.placement}`,
                value: `[${node.entrant.name}](https://start.gg/user/${node.entrant.id})`,
            });
        });
    }
    return embed;
};
exports.default = generateResultsPayload;
