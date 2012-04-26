  function findLocation(query, mapCallback) {
    if (!query) return
    $.ajax({
      url: "http://www.geonames.org/search.html?",
      data: {q: (encodeURI(query))},
      success: function(data, status, req) {
        var firstHit = data.querySelector('span.geo')
        var latitude = firstHit.querySelector('span.latitude').innerHTML
        var longitude = firstHit.querySelector('span.longitude').innerHTML
        mapCallback(latitude, longitude, query)
      },
      error: function(req, status) {
        console.log(req.statusText)
      }
    })
  }   
  