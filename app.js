require('dotenv').config()
const Discord = require('discord.js')
const bot = new Discord.Client()
const mongoose = require('mongoose')

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

bot.on('ready', () => {
  console.log('App started!')
})

bot.on('message', message => {
  // Listen for command
  if (message.content.startsWith('m!')) {
    let content = message.content.slice(2).split(' ')
    let command = content.shift().toLowerCase()
    try {
      // Look for the approriate file and execute it
      const commandFile = require(`./commands/${command}.js`)

      content = content.filter(item => {
        return /\S/.test(item)
      })
      commandFile.run(content, message)
    } catch (error) {
      // If the file doesn't exist, throw an error
      console.log(error)
      message.channel.send('Command is not found')
    }
  }
})

// Bot login
bot.login(process.env.DISCORD_TOKEN)
