var places = []

var redrawPlaces = function() {
  var ul = document.createElement('ul')
  ul.setAttribute('class', 'places')

  places.forEach(function (place) {
    var li = document.createElement('li')

    ul.appendChild(li);
    li.appendChild(document.createTextNode(place.content))
  })

  var placesElement = document.getElementById("places")
  if (placesElement.hasChildNodes()) {
    placesElement.removeChild(placesElement.childNodes[0]);
  }
  placesElement.appendChild(ul)
}

var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    places = JSON.parse(this.responseText)
    redrawPlaces()
  }
}

xhttp.open("GET", "/data.json", true)
xhttp.send()

var sendToServer = function (place) {
  var xhttpForPost = new XMLHttpRequest()
  xhttpForPost.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 201) {
      console.log(this.responseText)
    }
  }

  xhttpForPost.open("POST", '/new_place_spa', true)
  xhttpForPost.setRequestHeader("Content-type", "application/json")
  xhttpForPost.send(JSON.stringify(place));
}

window.onload = function (e) {
  var form = document.getElementById("places_form")
  form.onsubmit = function (e) {
    e.preventDefault()

    var place = {
      content: e.target.elements[0].value,
      date: new Date()
    }

    places.push(place)
    e.target.elements[0].value = ""
    redrawPlaces()
    sendToServer(place)
  }
}
