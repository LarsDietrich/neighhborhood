window.onload = function() {
  var template = 'http://tile.stamen.com/toner/{Z}/{X}/{Y}.jpg'
  var layer = new MM.TemplatedLayer(template)
  var mapDiv = document.getElementById('map')
  // Disable dragging and zooming support for now (keeps things simple)
  var map = new MM.Map("map", layer, new MM.Point(mapDiv.clientWidth, mapDiv.clientHeight), [])

  // First location
  setMap(37.31, -122.01, "Cupertino, CA")
  addCanvasOverlay(map, mapDiv)
  showCurrentLocation()
  
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
  
  function addCanvasOverlay(map, mapDiv) {
    var canvas = document.createElement('canvas')
    canvas.width = mapDiv.clientWidth
    canvas.height = mapDiv.clientHeight
    canvas.style.position = 'absolute'
    map.parent.appendChild(canvas)
  
    map.addCallback('drawn', drawCenterTriangle)
    
    function drawCenterTriangle() {
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
    }
  }

  function showCurrentLocation() {
    // Now look for our current position
    if (navigator.geolocation) {
      var successHandler = function(position) {
        setMap(position.coords.latitude, position.coords.longitude, "Your location")
      }
      var errorHandler = function(error) {
        console.log(error.message)
      }
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler) 
    }
  }

} // window.onload

window.onerror = function() {
  console.log('error');
}
