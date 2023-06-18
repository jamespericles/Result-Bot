# Results Bot

## Description

This bot is used to get the results for my local smash scene, [Alulu.](https://www.start.gg/tournament/alulu-135/details) The primary function of the bot is to query the start.gg API the day after the tournament is held, then to mention everyone in our results channel on discord with the top 3 placements. This function hasn't been built out yet, but the plan is for the bot to be hosted on Heroku and to work with a Cron job to run this function every Wednesday at 9am CST.

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

## Future Plans

**MVP1**

- [ ] Add a function to mention everyone in the results channel with the top 3 placements of the most recent tournament
  - [ ] Automate this function to run every Wednesday at 9am CST using a Cron job

---

- [ ] Add a function to query the start.gg API and return the top 3 placements for a specific tournament
- [ ] Track improvement of players over time in some meaningful way
