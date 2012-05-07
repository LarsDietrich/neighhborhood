  function findLocation(query, mapCallback) {
    if (!query) return
    $.ajax({
      url: "http://localhost/neighborhood/geo_proxy.php",
      data: {query: (encodeURI(query))},
      success: function(data, status, req) {
        var hits = extract(data).sort(function(a, b) { a.score - b.score })
        if (hits)
          mapCallback(hits[0].latitude, hits[0].longitude, query)
      },
      error: function(req, status) {
        console.log(req.statusText)
      }
    })
  }   
  
 /**
  * Extracts the data from the Yahoo geoquery response.
  */
  function extract(data) {
	var hits = $.makeArray($(data).find('hit'))
	return hits.map(function(hit) {
	  return  {latitude: (hit.getAttribute('lat')),
		 longitude: (hit.getAttribute('lon')),
	     score: (hit.getAttribute('score')),
		 node: (hit)}
	})
  }

