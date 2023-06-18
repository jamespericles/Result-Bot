// import { SlashCommandBuilder } from '@discordjs/builders';
// import { CommandInteraction } from 'discord.js';

// export const data = new SlashCommandBuilder()
//   .setName('getEventStanding')
//   .setDescription('Returns the top 3 placements of a given event')
//   .addStringOption(option =>
//     option.setName('tournament')
//       .setDescription('The tournament to get the standings for')
//       // TODO: Add autocomplete for this, suggest this week's alulu, or last week's
//       // .addChoices
//       .setRequired(true))
//   .addStringOption(option =>
//     option.setName('event')
//       .setDescription('The event to get the standings for')
//       .addChoices({
//         name: 'ultimate-singles', value: 'ultimate-singles'
//       })
//       .setRequired(true))

// export async function execute(interaction: CommandInteraction) {
//   const tournament = interaction.options.getUser('tournament')
//   const event = interaction.options.getUser('event')
//   const eventSlug = `tournament/${tournament}/event/${event}`

//   return // TODO
// }
