import { EmbedBuilder } from '@discordjs/builders'
import { EventData } from 'types'

const generateResultsPayload = (
  week: string | number,
  slug: string,
  eventStanding: EventData
): EmbedBuilder => {
  const embed = new EmbedBuilder()
    .setColor(0xefff00)
    .setTitle(`Week ${week} | Ultimate Singles Top 8`)
    .setURL(`https://start.gg/${slug}`)

  if (eventStanding.data) {
    eventStanding.data.event.standings.nodes.forEach((node) => {
      embed.addFields({
        name: ' ',
        value: `#${node.placement}: [${node.entrant.name}](https://start.gg/user/${node.entrant.id})`,
      })
    })
  }

  return embed
}

export default generateResultsPayload
