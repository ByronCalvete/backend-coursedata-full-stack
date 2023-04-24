const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// This not necessary because this data come from the MongoDB
// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body', request.body)
  console.log('----')
  next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hi Byron J Calvete</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  // const id = Number(request.params.id)
  // const note = notes.find(note => note.id === id)

  // if(note) {
  //   response.json(note)
  // } else {
  //   response.statusMessage = `There are no resources corresponding to the note with id number ${id}`
  //   response.status(404).end()
  // }
  Note.findById(request.params.id).then(note =>  {
    response.json(note)
  })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if(!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  // notes = [...notes, note]
  note.save().then(savedNote => {
    console.log('note saved!')
    response.json(savedNote)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  const updatedNote = {...note, important: !note.important}

  notes = notes.map(note => note.id === id ? updatedNote : note)
  response.json(updatedNote)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Serve running on port ${PORT}`)
})
