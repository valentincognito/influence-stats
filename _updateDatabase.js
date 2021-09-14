require('dotenv').config()
const mongoose = require('mongoose')
const axios = require('axios').default
const Crew = require('./models/crew')

const maxTokenId = 5400 //5400
let currentTokenId = 1

async function fetchAndUpdate(_tokenId){
  const options = {
    method: 'GET',
    url: `https://api.opensea.io/api/v1/asset/0x746db7b1728af413c4e2b98216c6171b2fc9d00e/${_tokenId}/`
  }

  axios.request(options).then(async function (response) {
    console.log(currentTokenId)

    let crew = await Crew.findOne({tokenId: response.data.token_id})
    crew = (crew) ? crew : new Crew()

    crew.tokenId = response.data.token_id

    if(crew.owner != null){
      crew.owner.username = response.data.owner.user.username
      crew.owner.address = response.data.owner.address
    }

    if (response.data.last_sale != null) crew.lastSoldPrice = response.data.last_sale.total_price

    crew.traits = response.data.traits

    let classTrait = response.data.traits.find(function (obj) {return obj.trait_type === "Class"})
    crew.class = classTrait.value

    let titleTrait = response.data.traits.find(function (obj) {return obj.trait_type === "Title"})
    crew.title = titleTrait.value

    await crew.save()

    if(currentTokenId > maxTokenId){
      return 'done'
    }else{
      fetchAndUpdate(currentTokenId++)
    }
  }).catch(function (error) {
    console.error(error)

    if(currentTokenId > maxTokenId){
      return 'done'
    }else{
      fetchAndUpdate(currentTokenId++)
    }
  })
}

//mongoose
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/${process.env.DB_NAME}`)
const db = mongoose.connection

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('db connection successful')

  fetchAndUpdate(currentTokenId)
})
