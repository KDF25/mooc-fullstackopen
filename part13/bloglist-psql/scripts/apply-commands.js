const fs = require('fs')
const path = require('path')
const sequelize = require('../models/sequelize')

const applyCommands = async () => {
  const sqlPath = path.join(__dirname, '..', 'commands.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')
  const statements = sql
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0)

  try {
    await sequelize.authenticate()
    for (const statement of statements) {
      await sequelize.query(statement)
    }
    console.log('commands.sql applied successfully')
    await sequelize.close()
  } catch (error) {
    console.error('Failed to apply commands.sql:', error)
    process.exit(1)
  }
}

applyCommands()
