$(function() {
  const GLOBALS = {
    totalCrewAmount: 5400
  }

  getAssetInfo(1594) //get a random asset 1594, 299

  $('.search-input').bind('input', function() {
    const crewUrlRegex = /https:\/\/opensea.io\/assets\/0x746db7b1728af413c4e2b98216c6171b2fc9d00e\/\d{1,4}/g

    if(crewUrlRegex.test($(this).val())){
      let urlSplit = $(this).val().split('/')
      let tokenId = urlSplit[urlSplit.length - 1]

      $('.search-legend').html(`Searching asset with token id: ${tokenId}`)

      getAssetInfo(tokenId)
    }else{
      $('.search-legend').html(`This is not an OpenSea crew asset url !`)
    }
  })

  function getAssetInfo(_tokenId){
    $('.loading').removeClass('hide')
    $('.asset-info-container').addClass('hide')

    $('.search-input').blur()

    $.ajax({
      url: '/api/asset',
      type: 'POST',
      data: {
        tokenId: _tokenId
      },
      success: function(data) {
        console.log(data)

        $('.same-title-list').empty()
        $('.traits-list').empty()

        const crew = data.data.crew
        const sameTitleCrews = data.data.sameTitleCrews

        let distinctTraitCount = 0
        let totalTraitCountValue = 0

        let sameTitleSoldCount = 0
        let totalPriceWithSameTitle = 0

        for (const crew of sameTitleCrews) {
          if (crew.lastSoldPrice) {
            let html = `<li><span class='txt-blue'>[crew#${crew.tokenId}]</span> last sold for: ${crew.lastSoldPrice / 1000000000000000000} ETH</li>`
            $('.same-title-list').append(html)

            totalPriceWithSameTitle += crew.lastSoldPrice
            sameTitleSoldCount++
          }
        }

        const avgPriceWithSameTitle = totalPriceWithSameTitle / sameTitleSoldCount
        $('.same-title-avg-price').html(`avg price with same title: ${avgPriceWithSameTitle / 1000000000000000000} ETH`)

        $('.tokenId').html(`token id: ${crew.tokenId}`)

        if(crew.lastSoldPrice){
          $('.last-sold-price').html(`last sold for: ${crew.lastSoldPrice / 1000000000000000000} ETH`)
        }else{
          $('.last-sold-price').html(`last sold for: <span class='txt-warning'>no info yet</span>`)
        }


        for (const trait of crew.traits) {
          let html = `<li><span class='txt-blue'>[${trait.trait_type}]</span> ${trait.value} (${(trait.trait_count * 100 / GLOBALS.totalCrewAmount).toFixed(2)}%)</li>`
          $('.traits-list').append(html)

          if(trait.trait_count > 0){
            totalTraitCountValue += trait.trait_count
            distinctTraitCount++
          }
        }

        let avgPropPercentage = totalTraitCountValue * 100 / (GLOBALS.totalCrewAmount * distinctTraitCount)

        $('.avgPropertiesPercentage').html(`average percentage: ${avgPropPercentage.toFixed(2)}%`)


        $('.loading').addClass('hide')
        $('.asset-info-container').removeClass('hide')

      },
      error: function (request, status, error) {
        console.log('code: '+request.status+' error: '+error)
      }
    })
  }
})
