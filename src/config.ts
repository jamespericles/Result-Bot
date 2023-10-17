import dotenv from 'dotenv'
dotenv.config()

const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = process.env
console.log("file: config.ts:5 ~ process.env:", process.env.MY_ENV)

if (!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN) {
  throw new Error('Missing environment variables')
}

const config: Record<string, string> = {
  CLIENT_ID,
  GUILD_ID,
  DISCORD_TOKEN,
}

export default config
