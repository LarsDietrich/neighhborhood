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

  buildTable(getQueries())
  // First location
  showLocation(37.31, -122.01, "Cupertino, CA")

  var form = document.forms[0]
  
  form.onsubmit = function() {
    var queryElement = document.querySelector('#query')
    var query = queryElement.value
    if (query) query = query.trim()
    saveQuery(query)
    findLocation(query, showLocation)
    return false
  }
  
  function saveQuery(query) {
    var queries = getQueries()
    if (queries.indexOf(query) == -1) {
      queries.push(query)
      queries.sort()
      buildTable(queries)
      saveQueries(queries)
    }
  }

  function saveQueries(queries) {
    if (!window.localStorage) return
    if (!queries) {
      localStorage.removeItem('neighborhood')
    } else {
      var obj = {queries: (queries)}
      var json = JSON.stringify(obj)
      localStorage['neighborhood'] = json
    }
  }
  
  function getQueries() {
    if (!window.localStorage) return []
    var queries = []
    var obj = localStorage['neighborhood']
    if (obj) {
      var json = JSON.parse(obj)
      if (json.queries) queries = json.queries
    }
    return queries
  }
    
  function buildTable(queries) {
    if (!queries) return
    var data = { queries: (queries) }
    var table = ich.template(data)
    $("#searches").empty().append(table)
    table.on('click', 'a', function(event) {
     var element = $(event.target)
     findLocation(element.text(), showLocation)
   })

  }
} // window.onload

