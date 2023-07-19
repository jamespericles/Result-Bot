import { Client, GatewayIntentBits } from 'discord.js'
import config from './config'
import * as commandModules from 'commands'
import { exitHandler } from 'util/index'
import job from 'jobs/index'
import dotenv from 'dotenv'
dotenv.config()

const commands = Object(commandModules)

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.once('ready', () => {
  console.log('🤖 Bot is ready!')
  try {
    job.start()
  } catch (e) {
    console.log(e)
  }
  console.log('\u001b[31mCalled job start!\u001b[0m')
})

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return

  // Handles spreading each command from our commands object
  const { commandName } = interaction
  commands[commandName].execute(interaction, client)
})

client.login(config.DISCORD_TOKEN)

// Bind email alert to exit events
// process.on('exit', (code) => exitHandler(code))
/*******REMOVE BEFORE PUSH********/
