const express = require('express')
const router = express.Router()

const Crew = require('../models/crew')

router.post('/asset', async function(req, res, next) {
  let crew = await Crew.findOne({tokenId: req.body.tokenId})
  let sameTitleCrews = await Crew.find({title: crew.title})

  res.json({status: 'success', data: {crew: crew, sameTitleCrews: sameTitleCrews}})
})


module.exports = router
