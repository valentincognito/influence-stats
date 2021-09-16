const mongoose = require('mongoose')

const CrewSchema = new mongoose.Schema({
  tokenId: Number,
  image: String,
  owner: {
    username: String,
    address: String,
  },
  lastSoldPrice: Number,
  name: String,
  description: String,
  titleTier: Number,
  class: String,
  title: String,
  traits: [{
    trait_type: String,
    value: String,
    display_type: String,
    max_value: String,
    trait_count: Number,
    order: String
  }],
  created: {type: Date, default: Date.now},
  modified: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Crew', CrewSchema)
