window.onload = function() {
  var template = 'http://tile.stamen.com/toner/{Z}/{X}/{Y}.jpg'
  var layer = new MM.TemplatedLayer(template)
  var mapDiv = document.getElementById('map')
  // Disable dragging and zooming support for now (keeps things simple)
  var map = new MM.Map("map", layer, new MM.Point(mapDiv.clientWidth, mapDiv.clientHeight), [])
  setMap(37.31, -122.01, "Cupertino, CA")
  
  var form = document.forms[0]
  var queryElement = document.querySelector('#query')
  
  form.onsubmit = function() {
    var query = queryElement.value
    if (query) query = query.trim()
    findLocation(query, setMap)
    return false
  }
  
  /** Set the map location and title */
  function setMap(latitude, longitude, title) {
    var zoom = 11.5
    map.setCenterZoom(new MM.Location(latitude, longitude), zoom)
    $("header.city_name").html(title)
  }

}


window.onerror = function() {
  console.log('error');
}