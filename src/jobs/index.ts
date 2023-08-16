import { TextChannel } from 'discord.js'
import {
  generateResultsPayload,
  getEventStanding,
  getTournamentsByCoord,
  generateTop8er,
  getSelectionValByGame,
} from 'util/index'
import { client } from 'bot'
import { Standings } from 'util/getEventStanding'
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
  // '0 9 * * 3',
  '*/5 * * * * *',
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

    const slug = `tournament/${name}/event/ultimate-singles`
    // @TODO - This can be bypassed, getEventStanding can take the slug
    const eventStanding: Standings | Error | undefined = await getEventStanding(
      id
    )
    const selectionSample = await getSelectionValByGame(slug)

    if (eventStanding instanceof Error) {
      console.error(eventStanding)
      return
    }

    if (selectionSample instanceof Error) {
      console.error(selectionSample)
      return
    }

    if (eventStanding && selectionSample) {
      const top8er = await generateTop8er(eventStanding, selectionSample)

      if (top8er && top8er.success) {
        const embed = generateResultsPayload(
          weekCount.toString(),
          slug,
          eventStanding
        )
        channel.send({
          embeds: [embed],
          content: `@everyone Check out the results of Alulu-${weekCount}!`,
          files: ['graphic.png'],
        })

        incrementWeekCount()
      } else {
        const embed = generateResultsPayload(
          weekCount.toString(),
          slug,
          eventStanding
        )
        channel.send({
          embeds: [embed],
          content: `@everyone Check out the results of Alulu-${weekCount}!`,
        })
        incrementWeekCount()
      }
    }
  },
  null,
  true,
  'America/Chicago'
)

job.stop()
export default job
