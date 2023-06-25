import { Client, GatewayIntentBits, TextChannel } from 'discord.js'
import config from './config'
import * as commandModules from 'commands'
import {
  generateResultsPayload,
  getEventID,
  getEventStanding,
} from 'util/index'
import { EventData } from 'types'

import { CronJob } from 'cron'
import fs from 'fs'

import dotenv from 'dotenv'
dotenv.config()

const commands = Object(commandModules)

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.once('ready', () => {
  console.log('🤖 Bot is ready!')
})

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return

  // Handles spreading each command from our commands object
  const { commandName } = interaction
  commands[commandName].execute(interaction, client)
})

function incrementWeekCount() {
  let weekCount = parseInt(fs.readFileSync('WEEK_COUNT.txt', 'utf8'))
  weekCount++

  fs.writeFileSync('WEEK_COUNT.txt', weekCount.toString(), 'utf8')
}

client.on('ready', async () => {
  const job = new CronJob('0 9 * * 3', async () => {
    // 9am every Wednesday
    const weekCount = parseInt(fs.readFileSync('WEEK_COUNT.txt', 'utf8'))
    const channel = client.channels.cache.get(
      process.env.CHANNEL_ID as string
    ) as TextChannel
    const slug = `tournament/alulu-${weekCount}/event/ultimate-singles`

    const eventID = await getEventID(slug)
    const eventStanding: EventData | Error | undefined = await getEventStanding(
      eventID
    )

    if (eventStanding instanceof Error) {
      console.error(eventStanding)
      return
    }

    if (eventStanding && eventStanding.data) {
      const embed = generateResultsPayload(
        weekCount.toString(),
        slug,
        eventStanding
      )
      channel.send({
        embeds: [embed],
        content: `@here Check out the results of Alulu-${weekCount}!`,
      })
      incrementWeekCount()
    }
  })

  job.start()
})

client.login(config.DISCORD_TOKEN)
