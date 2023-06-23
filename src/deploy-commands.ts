import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import config from './config'
import * as commandModules from './commands'

// TODO: refine this type to remove any
// any is used here because chaining an `.add_____Option` to the SlashCommandBuilder makes the type incompatible with Command
type Command = {
  data: {
    options?: any[]
    name: string
    description: string
  }
}

// All commands must be registered before they can be used.
const commands = []

for (const module of Object.values<Command>(commandModules)) {
  commands.push(module.data)
}

const rest = new REST({ version: '9' }).setToken(config.DISCORD_TOKEN)

// Register commands to the guild.
// TODO: Automatically run yarn deploy:commands when prod is updated, add to deployment pipeline
rest
  .put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), {
    body: commands,
  })
  .then(() => {
    console.log('\u001b[34m Successfully registered application commands.')
  })
  .catch(console.error)
