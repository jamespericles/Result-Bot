var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client, GatewayIntentBits } from 'discord.js';
import * as commandModules from './commands/index.js';
// import getEventID from './graphql/queries/getEventID'
import * as queryString from './graphql/queries/getEventID.js';
import dotenv from 'dotenv';
const fetch = require('node-fetch');
dotenv.config();
const commands = Object(commandModules);
export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
client.once('ready', () => {
    console.log('🤖 Bot is ready!');
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    // Handles spreading each command from our commands object
    const { commandName } = interaction;
    commands[commandName].execute(interaction, client);
}));
client.login('MTExODk2NzE3NDU3MzMzMDUwNA.GXUTRC.3JLV5_f7ymYUJMWuvLD4tJ3wZozV8BtpQqQjmM');
const { STARTGG_KEY, STARTGG_URI } = process.env;
const getEventID = (eventSlug) => {
    let eventID;
    if (STARTGG_KEY && STARTGG_URI) {
        fetch(STARTGG_URI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${STARTGG_KEY}`,
            },
            body: JSON.stringify({
                query: queryString,
                variables: {
                    slug: eventSlug,
                },
            }),
        })
            .then((res) => res.json())
            .then((data) => {
            console.log(data);
        });
    }
    return 1;
};
getEventID('tournament/alulu-134/event/ultimate-singles');
