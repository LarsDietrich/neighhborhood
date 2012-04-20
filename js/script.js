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
  var canvas = document.createElement('canvas')
  canvas.width = mapDiv.clientWidth
  canvas.height = mapDiv.clientHeight
  canvas.style.position = 'absolute'
  map.parent.appendChild(canvas)
  
  map.addCallback('drawn', function() {
    // place a small triangle in the center of the map
    var context = canvas.getContext('2d')
    var cx = canvas.width / 2
    var cy = canvas.height / 2
    
    context.beginPath()
    context.moveTo(cx, cy-5)
    context.lineTo(cx+7, cy+7)
    context.lineTo(cx-7, cy+7)
    context.lineTo(cx, cy-5)
    context.closePath()
    context.strokeStyle = "#f00"
    context.fillStyle = "#ff0"
    
    context.fill()
    context.stroke()
  })

  // Now look for our current position
  if (navigator.geolocation) {
    var successHandler = function(position) {
      document.querySelector(".city_name").innerHTML = "Your location"
      var loc = new MM.Location(position.coords.latitude, position.coords.longitude)
      map.setCenterZoom(loc, zoom)
    }
    var errorHandler = function(error) {
      console.log(error.message)
    }
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler) 
  }
}


/*
window.onerror = function() {
  console.log('error')
}
*/