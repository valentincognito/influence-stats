require('dotenv').config()
const mongoose = require('mongoose')
const axios = require('axios').default
const Crew = require('./models/crew')

const maxTokenId = 5957 //5957
let currentTokenId = 1

const titleTier = {
  'Chief Navigator': 0,
  'Navigator': 1,
  'Cartographer': 2,
  'Observatory Technician': 3,
  'Communication Officer': 4,
  'Provost': 0,
  'Distinguished Professor': 1,
  'Professor': 2,
  'Teacher': 3,
  'Teaching Assistant': 4,
  'Chief Archivist': 0,
  'Curator': 1,
  'Archivist': 2,
  'Historian': 3,
  'Librarian': 4,
  'Chief Medical Officer': 0,
  'Physician': 1,
  'Resident Physician': 2,
  'Physician Assistant': 3,
  'Nurse': 4,
  'Head Of Security': 0,
  'Intelligence Officer': 1,
  'Tactical Officer': 2,
  'Security Officer': 3,
  'Public Safety Officer': 4,
  'Chief Logistics Officer': 0,
  'Logistics Manager': 1,
  'Warehouse Manager': 2,
  'Logistics Specialist': 3,
  'Warehouse Worker': 4,
  'Chief Steward': 0,
  'Facilities Supervisor': 1,
  'EVA Technician': 2,
  'Electrician': 3,
  'Maintenance Technician': 4,
  'Chief Botanist': 0,
  'Plant Geneticist': 1,
  'Nutritionist': 2,
  'Field Botanist': 3,
  'Farmer': 4,
  'Chief Technology Officer': 0,
  'Systems Architect': 1,
  'Embedded Engineer': 2,
  'Software Engineer': 3,
  'Systems Administrator': 4,
  'Chief Cook': 0,
  'Chef': 1,
  'Kitchen Manager': 2,
  'Section Cook': 3,
  'Line Cook': 4,
  'High Commander': 0,
  'Justice': 1,
  'Councilor': 2,
  'Delegate': 3,
  'Block Captain': 4,
  'Head Of Engineering': 0,
  'Reactor Engineer': 1,
  'Propulsion Engineer': 2,
  'Life Support Engineer': 3,
  'Structural Engineer': 4,
  'Entertainement Director': 0,
  'Actor': 1,
  'Musician': 2,
  'Author': 3,
  'Artist': 4
}

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
    crew.name = response.data.name
    crew.description = response.data.description
    crew.image = response.data.image_url

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

    crew.titleTier = titleTier[titleTrait.value]

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
