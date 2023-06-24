import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { getEventID, getEventStanding, generateResultsPayload } from '../util'
import { EventData } from '../types'

export const data = new SlashCommandBuilder()
  .setName('get_event_standing')
  .setDescription('Get the top 3 placements for a given tournament!')
  .addIntegerOption((option) =>
    option
      .setName('alulu')
      .setDescription('Which Alulu tournament?')
      .setRequired(true)
  )

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const alulu = interaction.options.get('alulu')
  const slug = `tournament/alulu-${alulu?.value}/event/ultimate-singles`

  const eventID = await getEventID(slug)

  if (eventID) {
    const eventStanding: EventData | Error | undefined = await getEventStanding(
      eventID
    )

    if (eventStanding instanceof Error) {
      return await interaction.editReply(
        'Error, double check the tournament ID!'
      )
    }

    if (eventStanding && eventStanding.data) {
      const embed = generateResultsPayload(
        alulu?.value as string,
        slug,
        eventStanding
      )

      return await interaction.editReply({ embeds: [embed] })
    }
  }
}
