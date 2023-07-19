var CronJob = require('cron').CronJob
import { client } from 'bot'
import { TextChannel } from 'discord.js'
import { EventData } from 'types'
import {
  generateResultsPayload,
  getEventID,
  getEventStanding,
} from 'util/index'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

function incrementWeekCount() {
  let weekCount = parseInt(fs.readFileSync('WEEK_COUNT.txt', 'utf8'))
  weekCount++

  fs.writeFileSync('WEEK_COUNT.txt', weekCount.toString(), 'utf8')
}

const job = new CronJob('0 14 * * 3', async () => {
  console.log('*** Cron job running ***')
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

export default job
