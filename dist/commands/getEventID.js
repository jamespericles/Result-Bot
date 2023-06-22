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
    .setName('test')
    .setDescription('test')
    .addIntegerOption((option) => option
    .setName('tournament')
    .setDescription('The tournament to get the standings for')
    .setRequired(true));
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferReply({ ephemeral: true });
        const tournamentNumber = interaction.options.getUser('tournament');
        const event = 'ultimate-singles';
        let eventID;
        try {
            let data = yield (0, util_1.getEventID)(`tournament/alulu-${tournamentNumber}/event/${event}`);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            yield interaction.editReply('123');
        }
    });
}
exports.execute = execute;
