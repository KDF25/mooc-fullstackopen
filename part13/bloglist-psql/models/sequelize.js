const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('../utils/config')

const useSsl =
  DATABASE_URL?.includes('neon.tech') ||
  DATABASE_URL?.includes('aivencloud.com') ||
  DATABASE_URL?.includes('sslmode=require')

const sequelize = new Sequelize(DATABASE_URL, {
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

module.exports = sequelize
