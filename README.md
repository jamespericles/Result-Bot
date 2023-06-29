# Results Bot

## Description

This bot is used to get the results for my local smash scene, [Alulu.](https://www.start.gg/tournament/alulu-135/details) The primary function of the bot is to query the start.gg API the day after the tournament is held, then to mention everyone in our results channel on Discord with the top 3 placements. I've succeeded in doing this by utilizing [Cron](https://www.npmjs.com/package/cron) as well as by hosting the bot on an Ubuntu server with [Vultr](https://www.vultr.com/).

The bot is written primarily in TypeScript, and uses [discord.js](https://discord.js.org/#/) as the library for interacting with Discord, as well as GraphQL to interact with the [start.gg](https://developer.start.gg) API.

## Installation

1. Clone the repository
2. Run `npm install` || `yarn install`
3. Create a `.env` file in the root directory of the project with the following variables:

- `DISCORD_TOKEN` - The token for your Discord bot
- `CLIENT_ID` - The client ID for your Discord bot
- `GUILD_ID` - The guild ID for your Discord bot (The server for which the bot will live in)
- `STARTGG_TOKEN` - The token for your start.gg API key
- `STARTGG_URI` - The URI for your start.gg API key, all requests go through the same URI 'https://api.start.gg/gql/alpha'. You can choose to keep the URI here in the `.env` file as I have, or you can instead replace any usage of `process.env.STARTGG_URI` with the URI itself.

4. Ensure that you are using the correct version of Node as specified by the `.nvmrc` file found in the root of this directory. If you are using [nvm](https://github.com/nvm-sh/nvm) you can simply run `nvm use` to use the correct version of Node.
5. Before you can run the bot locally, be sure to run `npm build` in order to compile all TypeScript files into JavaScript files. This will create a `dist` folder in the root of the project, which is where the compiled JavaScript files will live.
6. Finally, run `npm start` to start the bot locally. If all has worked correctly, the bot should be online in your Discord server.
7. In order to add any commands you may have created, run `yarn deploy:commands`, otherwise the bot will only have access to the commands that are already deployed to the server.

## Deployment

Currently I'm hosting this project on [Vultr](https://www.vultr.com/) using their lowest specs (Cloud Compute, General Purpose Server, 25 GB NVMe). I also opted for Ubuntu 23.04 x64 as my OS.

Initially, production related work relied heavily on secure shell (SSH) file transfers for the purpose of deployment as well as for remote server administration and management. Recently, I've implemented a GitHub action that automates this process for me. Every time I push to `main`, the action automatically SSH into my server and pulls the latest changes from the repository. This has been a huge time saver for me, and I highly recommend learning GitHub actions if you haven't already! See the `.github/workflows/deploy.yml` file for more information.

Additionally, I've created a rudimentary email alert system for whenever the bot exits with an error. This has been a huge help in ensuring that the bot is always live, as well as making my response time much quicker whenever it fails.

## Additional Functionality

### Commands

The bot has a few commands that can be used in the Discord server. These commands are:

- `/get_event_standing` - This command expects a week of Alulu to query, an optionally accepts the number of results you'd like to see, otherwise it returns the top 3 placements for that given tournament.

## Future Plans

Check [the issues](https://github.com/jamespericles/Result-Bot/issues) on GitHub for what is currently being worked on or is coming down the pipeline.
