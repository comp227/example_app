var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement('ul')
    ul.setAttribute('class', 'places')

    data.forEach(function(place){
      var li = document.createElement('li')

      ul.appendChild(li);
      li.appendChild(document.createTextNode(place.name))
    })

    document.getElementById("places").appendChild(ul)
  }
}

xhttp.open("GET", "/data.json", true)
xhttp.send()