"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("./config"));
const commandModules = __importStar(require("./commands"));
const util_1 = require("./util");
const cron_1 = require("cron");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const commands = Object(commandModules);
exports.client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages],
});
exports.client.once('ready', () => {
    const channel = exports.client.channels.cache.get(process.env.CHANNEL_ID);
    channel.send({ content: '@here' });
    console.log('🤖 Bot is ready!');
});
exports.client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    // Handles spreading each command from our commands object
    const { commandName } = interaction;
    commands[commandName].execute(interaction, exports.client);
}));
function incrementWeekCount() {
    let weekCount = parseInt(fs_1.default.readFileSync('WEEK_COUNT.txt', 'utf8'));
    weekCount++;
    fs_1.default.writeFileSync('WEEK_COUNT.txt', weekCount.toString(), 'utf8');
}
exports.client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    const job = new cron_1.CronJob('0 9 * * 3', () => __awaiter(void 0, void 0, void 0, function* () {
        // 9am every Wednesday
        const weekCount = parseInt(fs_1.default.readFileSync('WEEK_COUNT.txt', 'utf8'));
        const channel = exports.client.channels.cache.get(process.env.CHANNEL_ID);
        const slug = `tournament/alulu-${weekCount}/event/ultimate-singles`;
        const eventID = yield (0, util_1.getEventID)(slug);
        const eventStanding = yield (0, util_1.getEventStanding)(eventID);
        if (eventStanding instanceof Error) {
            console.error(eventStanding);
            return;
        }
        if (eventStanding && eventStanding.data) {
            const embed = (0, util_1.generateResultsPayload)(weekCount.toString(), slug, eventStanding);
            channel.send({ embeds: [embed] });
            incrementWeekCount();
        }
    }));
    job.start();
}));
exports.client.login(config_1.default.DISCORD_TOKEN);
