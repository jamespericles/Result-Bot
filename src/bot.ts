import { Client, GatewayIntentBits } from 'discord.js'
import config from './config'
import * as commandModules from './commands'

const commands = Object(commandModules)

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.once('ready', () => {
  console.log('🤖 Bot is ready!')
})

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return

  // Handles spreading each command from our commands object
  const { commandName } = interaction
  commands[commandName].execute(interaction, client)
})

client.login(config.DISCORD_TOKEN)

// getEventID('tournament/alulu-134/event/ultimate-singles')
