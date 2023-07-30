import { TextChannel } from 'discord.js'
import {
  generateResultsPayload,
  getEventStanding,
  getTournamentsByCoord,
} from 'util/index'
import { client } from 'bot'
import { EventData } from 'types'
import fs from 'fs'
import dotenv from 'dotenv'
import { CronJob } from 'cron'
dotenv.config()

function incrementWeekCount() {
  let weekCount = parseInt(fs.readFileSync('WEEK_COUNT.txt', 'utf8'))
  weekCount++

  fs.writeFileSync('WEEK_COUNT.txt', weekCount.toString(), 'utf8')
}

const job = new CronJob(
  '0 9 * * 3',
  async () => {
    console.log('*** Cron job running ***')
    // 9am every Wednesday
    const weekCount = parseInt(fs.readFileSync('WEEK_COUNT.txt', 'utf8'))
    const channel = client.channels.cache.get(
      process.env.CHANNEL_ID as string
    ) as TextChannel

    const { id, name } = await getTournamentsByCoord(
      1,
      '41.85488981724496,-87.66285400268926',
      '1mi',
      weekCount
    )

    if (id === null) return console.error('No tournament found')
    const eventStanding: EventData | Error | undefined = await getEventStanding(
      id
    )

    const slug = `tournament/${name}/event/ultimate-singles`
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
  },
  null,
  true,
  'America/Chicago'
)

export default job
