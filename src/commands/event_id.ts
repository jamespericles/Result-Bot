import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { getEventID } from 'util/index'

export const data = new SlashCommandBuilder()
  .setName('event_id')
  .setDescription('Replies with the event ID!')
  .addIntegerOption((option) =>
    option
      .setName('alulu')
      .setDescription('Which Alulu tournament?')
      .setRequired(true)
  )

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const alulu = interaction.options.get('alulu')

  const eventID = await getEventID(
    `tournament/alulu-${alulu?.value}/event/ultimate-singles`
  )

  await interaction.editReply(`Event ID: ${eventID}`)
  return
}
