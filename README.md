![Static Badge](https://img.shields.io/badge/Total%20Instances%20-%202%20-%20green)
![Static Badge](https://img.shields.io/badge/Test%20Coverage%20-%20100%25%20-%20blue)
![Static Badge](https://img.shields.io/badge/Congruent%20Users%20-%20%3E%20400%20-%20gold)

# Results Bot

## Description

This bot was originally created to serve my local Smash Ultimate Scene [Alulu.](https://www.start.gg/tournament/alulu-135/details) I was recently approached by another local tournament organizer to spin up an instance for their scene as well. This led to me rewriting the bot to be less specific to Alulu so it can be easily deployed to other servers.

The primary function of the bot is to query the start.gg API the day after the tournament is held, then to mention everyone in our results channel on Discord with the top 8 placements. I've succeeded in doing this by utilizing [Cron](https://www.npmjs.com/package/cron) as well as by hosting the bot on an Ubuntu server with [Vultr](https://www.vultr.com/).

I also integrated the [Top8er](https://github.com/ShonTitor/Top8er) API so that I could generate a top 8 graphic along with the usual top 8 placements message. A big thank you to [@ShonTitor](https://github.com/ShonTitor) for explaining their project and API to me, as well as helping me realize this new exciting feature!

The bot is written in TypeScript, and uses [discord.js](https://discord.js.org/#/) to integrate with the Discord app, as well as GraphQL to interact with the [start.gg](https://developer.start.gg) API.

![Week-144](/../screenshots/screenshots/week-144.png?raw=true 'Week 144 Results')

## Installation

1. Clone the repository
2. Run `npm install` || `yarn install`
3. Create a `.env` file in the root directory of the project and copy the format of `env.temp` using `cp .env.temp .env`. You will need to fill in the following values:

- `TOURNAMENT_NAME` - The name of your tournament
- `TOURNAMENT_COORDS` - The coordinate of your tournament. This can be found easily using google. This is used in `utils/getTournamentByCoords`
- `CRON_JOB_CADENCE` - The string for the Cron Job. Check out [Cron](https://www.npmjs.com/package/cron) for more information.
- `DISCORD_TOKEN` - The token for your Discord bot
- `CLIENT_ID` - The client ID for your Discord bot
- `GUILD_ID` - The guild ID for your Discord bot (The server for which the bot will live in)
- `CHANNEL_ID` - The channel ID for your Discord bot (The channel for which the bot will post in)
- `STARTGG_KEY` - The token for your start.gg API key
- `STARTGG_URI` - The URI for your start.gg API key, all requests go through the same URI 'https://api.start.gg/gql/alpha'. You can choose to keep the URI here in the `.env` file as I have, or you can instead replace any usage of `process.env.STARTGG_URI` with the URI itself.
- `SMTP_USERNAME` - The username for your email client (if you choose to use the email alert system)
- `SMTP_PASSWORD` - The password for your email client
- `SMTP_RECIPIENT` - The email address that will receive the alerts
- `TOP8ER_URI` - The URI for the Top8er API. This is used to generate the top 8 graphic. Please reach out to [@ShonTitor](https://github.com/ShonTitor) for this URI as well as for permission to use the API.

4. Ensure that you are using the correct version of Node as specified by the `.nvmrc` file found in the root of this directory. If you are using [nvm](https://github.com/nvm-sh/nvm) you can simply run `nvm use` to use the correct version of Node.
5. Before you can run the bot locally, be sure to run `npm build` in order to compile all TypeScript files into JavaScript files. This will create a `dist` folder in the root of the project, which is where the compiled JavaScript files will live.
6. Finally, run `npm start` to start the bot locally. If all has worked correctly, the bot should be online in your Discord server.
7. In order to add any commands you may have created, run `yarn deploy:commands`, otherwise the bot will only have access to the commands that are already deployed to the server.

## Deployment

All instances are hosted on [Vultr](https://www.vultr.com/) using their lowest specs (Cloud Compute, General Purpose Server, 25 GB NVMe). I also opted for Ubuntu 23.04 x64 as my OS.

## Additional Functionality

### Commands

The bot has a few commands that can be used in the Discord server. These commands are:

- `/get_event_standing` - This command expects a week of Alulu to query, and optionally accepts the number of results you'd like to see, otherwise it returns the top 3 placements for that given tournament.

## Future Plans

Check [the issues](https://github.com/jamespericles/Result-Bot/issues) on GitHub for what is currently being worked on or is coming down the pipeline.
