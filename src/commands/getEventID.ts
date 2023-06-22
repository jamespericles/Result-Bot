import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { getEventID } from '../util'

export const data = new SlashCommandBuilder()
  .setName('test')
  .setDescription('test')
  .addIntegerOption((option) =>
    option
      .setName('tournament')
      .setDescription('The tournament to get the standings for')
      .setRequired(true)
  )

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true })

  const tournamentNumber = interaction.options.getUser('tournament')
  const event = 'ultimate-singles'
  let eventID: number

  try {
    let data = await getEventID(
      `tournament/alulu-${tournamentNumber}/event/${event}`
    )
  } catch (err) {
    console.error(err)
  } finally {
    await interaction.editReply('123')
  }
}
