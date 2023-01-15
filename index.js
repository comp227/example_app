const express = require('express')
const path = require('path')
const boyParser = require('body-parser')

const PORT = process.env.PORT || 5000
const MAX_PLACES = 100;
const PATH_PREFIX = '';

const app = express()

app.use(boyParser())

const places = [
    {
        content: 'El Pazcifico',
        date: new Date('2023-01-13T17:30:31.098Z'),
    },
    {
        content: 'Mazaa Kabob House',
        date: new Date('2023-01-13T18:39:34.091Z'),
    },
    {
        content: 'Journey to the Dumpling',
        date: new Date('2023-01-13T19:20:14.298Z'),
    },
]

const isValidPlace = place => {
    return typeof place === 'object' && typeof place.content === 'string' && !isNaN(new Date(place.date).getTime())
}

const createPlace = place => {
    places.push(place);

    if (places.length > MAX_PLACES) {
        places.shift()
    }
}

const formatPlace = place => {
    return {
        content: place.content.substring(0, 200),
        date: new Date(place.date),
    }
}

const places_page = `
<!DOCTYPE html>
<html>
<head>
  <title>Places Page</title>
  <link rel="stylesheet" type="text/css" href="${PATH_PREFIX}/main.css" />
  <link rel="icon" href="/favicon.png">
  <script type="text/javascript" src="${PATH_PREFIX}/main.js"></script>
</head>
<body>
  <div class='container'>
    <h1>Places</h1>
    <div id='places'>
    </div>
    <form action='${PATH_PREFIX}/new_place' method='POST'>
      <input type="text" name="place"> 
      <input type="submit" value="Add a Place">
    </form>
  </div>
</body>
</html>
`

const places_spa = `
<!DOCTYPE html>
<html>
<head>
  <title>Places Page</title>
  <link rel="stylesheet" type="text/css" href="${PATH_PREFIX}/main.css" />
  <link rel="icon" href="/favicon.png">
  <script type="text/javascript" src="${PATH_PREFIX}/spa.js"></script>
</head>
<body>
  <div class='container'>
    <h1>Places -- single page app</h1>
    <div id='places'>
    </div>
    <form id='places_form'>
      <input type="text" name="place"> 
      <input type="submit" value="Add a Place">
    </form>
  </div>
</body>
</html>
`

const getFronPageHtml = (placeCount) => {
    return (`
<!DOCTYPE html>
    <html>
      <head>
      <title>COMP 227 Example</title>
      <link rel="icon" href="/favicon.png">
      </head>
      <body>
        <div class='container'>
          <h1>COMP 227 Example</h1>
          <p>Are you ready to travel around the area? We have <strong>${placeCount} place${(placeCount === 1 ? '' : 's')}</strong> for you.</p>
          <h2><a href='${PATH_PREFIX}/places'>Places</a></h2>
          <img src='bear.png' width='450' />
        </div>
      </body>
    </html>
`)
}

const router = express.Router();

router.use(express.static(path.join(__dirname, 'public')))

router.get('/', (req, res) => {
    const page = getFronPageHtml(places.length)
    res.send(page)
})

router.get('/reset', (req, res) => {
    places.splice(0, places.length)
    res.status(201).send({message: 'places reset'})
})

router.get('/places', (req, res) => {
    res.send(places_page)
})

router.get('/spa', (req, res) => {
    res.send(places_spa)
})

router.get('/data.json', (req, res) => {
    res.json(places)
})

router.post('/new_place_spa', (req, res) => {
    if (!isValidPlace(req.body)) {
        return res.send('invalid place').status(400)
    }

    createPlace(formatPlace(req.body))

    res.status(201).send({message: 'place created'})
})

router.post('/new_place', (req, res) => {
    if (typeof req.body.place === 'string') {
        createPlace(formatPlace({
            content: req.body.place,
            date: new Date()
        }))
    }

    res.redirect(`${PATH_PREFIX}/places`)
})

if (process.env.NODE_ENV === 'development') {
    app.use(PATH_PREFIX, router)
} else {
    app.use('/', router)
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`))