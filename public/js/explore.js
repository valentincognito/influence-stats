$(function() {
  const totalCrewAmount = 5400

  $('.search-button').click(function(e){
    e.preventDefault()
    getAssetInfo(1)
  })

  getAssetInfo(299) //test

  function getAssetInfo(_tokenId){
    $.ajax({
      url: '/api/asset',
      type: 'POST',
      data: {
        tokenId: _tokenId
      },
      success: function(data) {
        console.log(data)

        const crew = data.data.crew
        const sameTitleCrews = data.data.sameTitleCrews

        let distinctTraitCount = 0
        let totalTraitCountValue = 0

        let sameTitleSoldCount = 0
        let totalPriceWithSameTitle = 0
        for (const crew of sameTitleCrews) {
          if (crew.lastSoldPrice) {
            totalPriceWithSameTitle += crew.lastSoldPrice
            sameTitleSoldCount++
          }
        }

        const avgPriceWithSameTitle = totalPriceWithSameTitle / sameTitleSoldCount
        $('.same-title-avg-price').html(`avg price with same title: ${avgPriceWithSameTitle / 1000000000000000000} ETH`)

        $('.tokenId').html(`token id: ${crew.tokenId}`)
        $('.last-sold-price').html(`last sold for: ${crew.lastSoldPrice / 1000000000000000000} ETH`)

        for (const trait of crew.traits) {
          let html = `<li>${trait.trait_type}: ${trait.value} (${(trait.trait_count * 100 / totalCrewAmount).toFixed(2)}%)</li>`
          $('.traits-list').append(html)

          if(trait.trait_count > 0){
            totalTraitCountValue += trait.trait_count
            distinctTraitCount++
          }
        }

        let avgPropPercentage = totalTraitCountValue * 100 / (totalCrewAmount * distinctTraitCount)

        $('.avgPropertiesPercentage').html(`average percentage: ${avgPropPercentage.toFixed(2)}%`)
      },
      error: function (request, status, error) {
        console.log('code: '+request.status+' error: '+error)
      }
    })
  }
})
