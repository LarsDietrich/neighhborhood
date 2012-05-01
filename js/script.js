window.onload = function() {
  var template = 'http://tile.stamen.com/toner/{Z}/{X}/{Y}.jpg'
  var layer = new MM.TemplatedLayer(template)
  var mapDiv = document.getElementById('map')
  // Disable dragging and zooming support for now (keeps things simple)
  var map = new MM.Map("map", layer, new MM.Point(mapDiv.clientWidth, mapDiv.clientHeight), [])

  /** Set the map location and title */
  function showLocation(latitude, longitude, title) {
    var zoom = 11.5
    map.setCenterZoom(new MM.Location(latitude, longitude), zoom)
    $("header.city_name").html(title)
  }

  buildTable(getQueries()) // <=== Storage
  // First location
  showLocation(37.31, -122.01, "Cupertino, CA")
//  addCanvasOverlay(map, mapDiv) // <=== Canvas
//  showCurrentLocation() // <=== Geolocation


  /* ============================================
   * Forms
   */
  var form = document.forms[0]
  
  form.onsubmit = function() {
    var queryElement = document.querySelector('#query')
    var query = queryElement.value
    if (query) query = query.trim()
    saveQuery(query)
    findLocation(query, showLocation)
    return false
  }

  /* ============================================
   * Storage
   */
   
   var queries = []
   
   function saveQuery(query) {
     var queries = getQueries()
     if (queries.indexOf(query) == -1) {
       queries.push(query)
       queries.sort()
       buildTable(queries)
       saveQueries(queries)
     }
   }
   
   function buildTable(queries) {
     if (!queries) return
     var data = {queries: (queries) }
     var table = ich.template(data)
     $("#searches").empty().append(table)
     table.on('click', 'a', function(event) {
       var element = $(event.target)
       findLocation(element.text(), showLocation)
     })
   }
   
  function getQueries() {
    var json = localStorage['neighborhood']
    var queries = []
    if (json) {
      var obj = JSON.parse(json)
      queries = obj.queries || []
    }
    return queries
  }
  
  function saveQueries(queries) {
    if (!queries) {
      localStorage.removeItem('neighborhood')
    } else {
      var obj = {queries: (queries) }
      var json = JSON.stringify(obj)
      // Same as localStorage['neighborhood'] = ...
      localStorage.setItem('neighborhood', json)
    }
  }
  
  
  /* ============================================
   * Canvas
   */
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

  /* ============================================
   * Geolocation
   */
 
  function showCurrentLocation() {
    // Now look for our current position
    if (navigator.geolocation) {
      var successHandler = function(position) {
        showLocation(position.coords.latitude, position.coords.longitude, "Your location")
      }
      var errorHandler = function(error) {
        console.log(error.message)
      }
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler) 
    }
  }

} // window.onload

/*
window.onerror = function() {
  console.log('error');
}
*/