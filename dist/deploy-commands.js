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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config_1 = __importDefault(require("./config"));
const commandModules = __importStar(require("./commands"));
// All commands must be registered before they can be used.
const commands = [];
for (const module of Object.values(commandModules)) {
    commands.push(module.data);
}
const rest = new rest_1.REST({ version: '9' }).setToken(config_1.default.DISCORD_TOKEN);
// Register commands to the guild.
// TODO: Automatically run yarn deploy:commands when prod is updated, add to deployment pipeline
rest
    .put(v9_1.Routes.applicationGuildCommands(config_1.default.CLIENT_ID, config_1.default.GUILD_ID), {
    body: commands,
})
    .then(() => {
    console.log('Successfully registered application commands.');
})
    .catch(console.error);
