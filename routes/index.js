const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
  res.render('index')
})

router.get('/explore', function(req, res, next) {
  res.render('explore')
})

module.exports = router
