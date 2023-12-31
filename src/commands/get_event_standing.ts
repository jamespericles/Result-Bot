import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import {
  getEventID,
  getEventStanding,
  generateResultsPayload,
} from 'util/index'
import { Standings } from 'util/getEventStanding'
import fs from 'fs'

export const data = new SlashCommandBuilder()
  .setName('get_event_standing')
  .setDescription('Get the top 3 placements for a given tournament!')
  .addIntegerOption((option) =>
    option
      .setName('alulu')
      .setDescription('Which Alulu tournament?')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('results')
      .setDescription('How many results do you want to see? Defaults to 3')
      .setRequired(false)
  )

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const alulu = interaction.options.get('alulu')
  const numberOfResults = interaction.options.get('results')
  const slug = `tournament/alulu-${alulu?.value}/event/ultimate-singles`
  const weekCount = parseInt(fs.readFileSync('WEEK_COUNT.txt', 'utf8'))

  if (alulu?.value && weekCount) {
    if (typeof alulu.value === 'number' && alulu.value > weekCount) {
      return await interaction.editReply(
        `This week hasn't happened yet! The most recent Alulu tournament is week ${weekCount}.`
      )
    }
  }

  const eventID = await getEventID(slug)

  if (eventID) {
    const eventStanding: Standings | Error | undefined = await getEventStanding(
      eventID,
      1,
      numberOfResults?.value as number
    )

    if (eventStanding instanceof Error) {
      console.error(eventStanding)
      console.error(eventStanding.stack)

      return await interaction.editReply(
        'Error, double check the tournament ID!'
      )
    }

    if (eventStanding) {
      const embed = generateResultsPayload(
        alulu?.value as string,
        slug,
        eventStanding
      )

      return await interaction.editReply({ embeds: [embed] })
    }
  }
}
