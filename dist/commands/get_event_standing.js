"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const util_1 = require("../util");
exports.data = new builders_1.SlashCommandBuilder()
    .setName('get_event_standing')
    .setDescription('Get the top 3 placements for a given tournament!')
    .addIntegerOption((option) => option
    .setName('alulu')
    .setDescription('Which Alulu tournament?')
    .setRequired(true));
function execute(interaction) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferReply({ ephemeral: true });
        const alulu = interaction.options.get('alulu');
        const slug = `tournament/alulu-${alulu === null || alulu === void 0 ? void 0 : alulu.value}/event/ultimate-singles`;
        const eventID = yield (0, util_1.getEventID)(slug);
        if (eventID) {
            const eventStanding = yield (0, util_1.getEventStanding)(eventID);
            const standing = (_c = (_b = (_a = eventStanding === null || eventStanding === void 0 ? void 0 : eventStanding.data) === null || _a === void 0 ? void 0 : _a.event) === null || _b === void 0 ? void 0 : _b.standings) === null || _c === void 0 ? void 0 : _c.nodes;
            if (standing) {
                const embed = new discord_js_1.EmbedBuilder()
                    .setColor(0xefff00)
                    .setTitle(`Alulu ${alulu === null || alulu === void 0 ? void 0 : alulu.value} | Ultimate Singles Top 3`)
                    .setURL(`https://start.gg/${slug}`);
                standing.forEach((node) => {
                    embed.addFields({
                        name: `#${node.placement}`,
                        value: `[${node.entrant.name}](https://start.gg/user/${node.entrant.id})`,
                    });
                });
                return yield interaction.editReply({ embeds: [embed] });
            }
        }
    });
}
exports.execute = execute;
