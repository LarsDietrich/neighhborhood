window.onload = function() {
  var template = 'http://tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg'
  var layer = new MM.TemplatedLayer(template)
  var mapDiv = document.getElementById('map')
  // Disable dragging and zooming support for now (keeps things simple)
  var map = new MM.Map("map", layer, new MM.Point(mapDiv.clientWidth, mapDiv.clientHeight), [])
  
  var latitude=37.31
  var longitude = -122.01
  var zoom = 11.5
  
  map.setCenterZoom(new MM.Location(latitude, longitude), zoom)
  
  var form = document.forms[0]
  var queryElement = document.querySelector('#query')
  
  form.onsubmit = function() {
    var query = queryElement.value
    if (query) query = query.trim()
    sendQuery(query)
    return false
  }
  
  function sendQuery(query) {
    if (!query) return
    $.ajax({
      url: "http://localhost/geo_proxy.php",
      data: {query: (encodeURI(query))},
      success: function(data, status, req) {
        console.log(data)
      },
      error: function(req, status) {
        console.log(req.statusText)
      }
    })
  }   
}


window.onerror = function() {
  console.log('error');
}