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

  buildSearchTable(getSavedSearches()) // <=== Storage
  // First location
  showLocation(37.31, -122.01, "Cupertino, CA")
  addCanvasOverlay(map, mapDiv) // <=== Canvas
  showCurrentLocation() // <=== Geolocation
  
  /* ============================================
   * Forms
   */
  var form = document.forms[0]
  
  form.onsubmit = function() {
    var queryElement = document.querySelector('#query')
    var query = queryElement.value
    if (query) query = query.trim()
//    findLocation(query, showLocation)
    findLocation(query, saveAndShow) // <=== Storage
    return false
  }

  /* ============================================
   * Storage
   */
   
  function getSavedSearches() {
    var json = localStorage['neighborhood']
    var savedSearches
    if (json) {
      var obj = JSON.parse(json)
      savedSearches = obj.searches || []
    } else {
      savedSearches = []
    }
    return savedSearches
  }
  
  function saveSearches(searchArray) {
    if (!searchArray) {
      localStorage.removeItem('neighborhood')
    } else {
      // Same as localStorage['neighborhood'] = ...
      var obj = {searches: (searchArray) }
      var json = JSON.stringify(obj)
      localStorage.setItem('neighborhood', json)
    }
  }
  
  /** Save the search results then show on the map */
  function saveAndShow(latitude, longitude, title) {
    var searches = getSavedSearches()
    var lcTitle = title.toLowerCase()
    if (!searches.some(function(item) { return item.query.toLowerCase() === lcTitle })) {
      // Hasn't been saved yet
      searches.push({query:(title), latitude:(latitude), longitude:(longitude)})
      searches.sort(function (a,b) { return a.query < b.query })
      saveSearches(searches)
      buildSearchTable(searches)
    }
    showLocation(latitude, longitude, title)
  }

  function buildSearchTable(searches) {
    // Take advantage of jQuery here
    if (!searches || searches.length === 0) {
      $("#searches").html("<p>No saved searches</p>")
    } else {
      var table = $("<table><thead><tr><th>Saved searches</th></tr></thead></table>")
      $("#searches").empty().append(table)
      var tbody = $("<tbody />").appendTo(table)
      searches.forEach(function(search) {
        // {query:"...", latitude:..., longitude:...} ==> <tr><td><a latitude="..." longitude="...">query</a></td></tr>
        var a = $("<a />").attr("latitude", search.latitude).attr("longitude", search.longitude).text(search.query)
        tbody.append($("<tr />").append($("<td />").append(a)))
      })
      var handleClick = function (event) { 
        var element = $(event.target)
        showLocation(element.attr("latitude"), element.attr("longitude"), element.text()) 
      }
      tbody.on('click', 'a', handleClick) 
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