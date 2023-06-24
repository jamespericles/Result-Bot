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
const util_1 = require("../util");
exports.data = new builders_1.SlashCommandBuilder()
    .setName('get_event_standing')
    .setDescription('Get the top 3 placements for a given tournament!')
    .addIntegerOption((option) => option
    .setName('alulu')
    .setDescription('Which Alulu tournament?')
    .setRequired(true));
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferReply({ ephemeral: true });
        const alulu = interaction.options.get('alulu');
        const slug = `tournament/alulu-${alulu === null || alulu === void 0 ? void 0 : alulu.value}/event/ultimate-singles`;
        const eventID = yield (0, util_1.getEventID)(slug);
        if (eventID) {
            const eventStanding = yield (0, util_1.getEventStanding)(eventID);
            if (eventStanding instanceof Error) {
                return yield interaction.editReply('Error, double check the tournament ID!');
            }
            if (eventStanding && eventStanding.data) {
                const embed = (0, util_1.generateResultsPayload)(alulu === null || alulu === void 0 ? void 0 : alulu.value, slug, eventStanding);
                return yield interaction.editReply({ embeds: [embed] });
            }
        }
    });
}
exports.execute = execute;
