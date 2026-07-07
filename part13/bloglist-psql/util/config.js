require('dotenv').config()

const PORT = process.env.PART13_PORT || 3001
const DATABASE_URL = process.env.PART13_DATABASE_URL
const TEST_DATABASE_URL = process.env.PART13_TEST_DATABASE_URL
const SECRET = process.env.PART13_SECRET

module.exports = { PORT, DATABASE_URL, TEST_DATABASE_URL, SECRET }
