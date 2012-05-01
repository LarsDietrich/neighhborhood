  function findLocation(query, mapCallback) {
    if (!query) return
    $.ajax({
      url: "http://www.geonames.org/search.html",
      data: {q: (query)},
      success: function(data, status, req) {
        var firstHit = $(data).find('span.geo').first()
        var latitude = firstHit.find('span.latitude').text()
        var longitude = firstHit.find('span.longitude').text()
        mapCallback(latitude, longitude, query)
      },
      error: function(req, status) {
        console.log(req.statusText)
      }
    })
  }   
  