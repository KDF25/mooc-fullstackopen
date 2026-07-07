const path = require('path')
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL, TEST_DATABASE_URL } = require('./config')

const databaseUrl =
  process.env.TESTING === 'true'
    ? TEST_DATABASE_URL || DATABASE_URL
    : DATABASE_URL

const useSsl =
  databaseUrl?.includes('neon.tech') ||
  databaseUrl?.includes('aivencloud.com') ||
  databaseUrl?.includes('sslmode=require')

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  ...(useSsl && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
})

const migrationConf = {
  migrations: {
    glob: ['*.js', { cwd: path.join(__dirname, '../migrations') }],
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }
