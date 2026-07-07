const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor, sessionValidator } = require('../util/middleware')

router.delete('/', tokenExtractor, sessionValidator, async (req, res) => {
  await Session.destroy({ where: { userId: req.decodedToken.id } })
  res.status(204).end()
})

module.exports = router
