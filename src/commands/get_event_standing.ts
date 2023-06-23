import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { getEventID, getEventStanding } from '../util'
import { EventData, StandingsNode } from '../types'

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
    // const standing = (eventStanding as EventData)?.data?.event?.standings?.nodes

    if (eventStanding instanceof Error) {
      return await interaction.editReply(
        'Error, double check the tournament ID!'
      )
    }

    if (eventStanding && eventStanding.data) {
      const embed = new EmbedBuilder()
        .setColor(0xefff00)
        .setTitle(`Alulu ${alulu?.value} | Ultimate Singles Top 3`)
        .setURL(`https://start.gg/${slug}`)

      eventStanding.data.event.standings.nodes.forEach(
        (node: StandingsNode) => {
          embed.addFields({
            name: `#${node.placement}`,
            value: `[${node.entrant.name}](https://start.gg/user/${node.entrant.id})`,
          })
        }
      )

      return await interaction.editReply({ embeds: [embed] })
    }
  }
}
