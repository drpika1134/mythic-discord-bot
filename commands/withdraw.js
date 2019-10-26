const Log = require('../models/Log')
const User = require('../models/User')

const users = require('../users')

function validateInput(content) {
  const regex = /^\$*[0-9,.]+$/
  if (content.length != 12) {
    return false
  }
  if (!content.every(item => regex.test(item))) {
    return false
  }

  return true
}

async function withdrawFromAccount(name, rss, bot) {
  await User.findOne({ name }, (err, user) => {
    if (err) {
      return
    }
    let account = user.account
    user.account.money = parseFloat((account.money - rss[0]).toFixed(2))
    user.account.food = parseFloat((account.food - rss[1]).toFixed(2))
    user.account.gasoline = parseFloat((account.gasoline - rss[8]).toFixed(2))
    user.account.munition = parseFloat((account.munition - rss[9]).toFixed(2))
    user.account.steel = parseFloat((account.steel - rss[10]).toFixed(2))
    user.account.alum = parseFloat((account.alum - rss[11]).toFixed(2))
    user.account.ura = parseFloat((account.ura - rss[4]).toFixed(2))
    user.account.coal = parseFloat((account.coal - rss[2]).toFixed(2))
    user.account.oil = parseFloat((account.oil - rss[3]).toFixed(2))
    user.account.lead = parseFloat((account.lead - rss[5]).toFixed(2))
    user.account.iron = parseFloat((account.iron - rss[6]).toFixed(2))
    user.account.bauxite = parseFloat((account.bauxite - rss[7]).toFixed(2))

    user.markModified('account')
    user.save()

    bot.reply('Successfully Withdrew')
  })
}

async function recordLog(name, rss) {
  const date = new Date()
  let year = date.getUTCFullYear()
  let month = date.getUTCMonth() + 1
  let day = date.getUTCDate()

  if (month <= 9) month = '0' + month
  if (day <= 9) day = '0' + day

  const UTC_time = `${year}-${month}-${day}`

  const newLog = new Log({
    name: name,
    type: 'Withdraw',
    date: UTC_time,
    resources: {
      money: rss[0],
      food: rss[1],
      gasoline: rss[8],
      munition: rss[9],
      steel: rss[10],
      alum: rss[11],
      ura: rss[4],
      coal: rss[2],
      oil: rss[3],
      lead: rss[5],
      iron: rss[6],
      bauxite: rss[7]
    }
  })
  await newLog.save()
}

module.exports = {
  run: (content, bot) => {
    const isValid = validateInput(content)

    if (isValid) {
      // Remove the dollar sign
      content[0] = content[0].slice(1)

      // Convert everything to a decimal
      for (let i = 0; i < content.length; i++) {
        content[i] = parseFloat(content[i].replace(/,/g, ''))
      }

      // Save to DB
      const user_id = Object.keys(users)
      for (let i = 0; i < user_id.length; i++) {
        const id = user_id[i]
        if (bot.member.id == id) {
          withdrawFromAccount(users[id], content, bot)
          recordLog(users[id], content)
        }
      }
    }
  }
}
