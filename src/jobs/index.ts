import { TextChannel } from 'discord.js'
import {
  generateResultsPayload,
  getEventStanding,
  getTournamentsByCoord,
  generateTop8er,
  getSelectionValByGame,
  sanitizeTournamentName
} from 'util/index'
import { client } from 'bot'
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

    const { id, slug } = await getTournamentsByCoord(
      1,
      process.env.TOURNAMENT_COORDS as string,
      '1mi',
      weekCount
      )

    if (id === null) return console.error('ID not generated')
    if (slug === null) return console.error('Slug not generated')
    console.log("file: index.ts:43 ~ slug:", slug)

    // @TODO - This can be bypassed, getEventStanding can take the slug
    const eventStanding = await getEventStanding(
      id
    )

    if (eventStanding instanceof Error) {
      console.error(eventStanding)
      return
    }

    const selectionSample = await getSelectionValByGame(slug)

    if (selectionSample instanceof Error) {
      console.error(selectionSample)
      return
    }

    if (eventStanding && selectionSample && slug) {
      const top8er = await generateTop8er(
        eventStanding,
        selectionSample,
        weekCount
      )

      if (top8er && top8er.success) {
        const embed = generateResultsPayload(
          weekCount.toString(),
          slug,
          eventStanding
        )
        channel.send({
          embeds: [embed],
          content: `@everyone Check out the results of ${sanitizeTournamentName(process.env.TOURNAMENT_NAME as string)}-${weekCount}!`,
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
          content: `@everyone Check out the results of ${sanitizeTournamentName(process.env.TOURNAMENT_NAME as string)}-${weekCount}!`,
        })
        incrementWeekCount()
      }
    }
  },
  null,
  true,
  'America/Chicago'
)

export default job
