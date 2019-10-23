require('dotenv').config()
const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', () => {
  console.log('App started!')
})

bot.on('message', message => {
  // Listen for command
  if (message.content.startsWith('m!')) {
    let command_name = message.content.slice(2).split(' ')

    try {
      // Look for the approriate file and execute it
      const commandFile = require(`./commands/${command_name}.js`)
      commandFile.run()
    } catch {
      // If the file doesn't exist, throw an error
      message.channel.send('Command is not found')
    }
  }
})

// Bot login
bot.login(process.env.DISCORD_TOKEN)
