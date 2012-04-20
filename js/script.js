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
};


/*
window.onerror = function() {
  console.log('error');
}
*/