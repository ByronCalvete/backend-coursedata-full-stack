const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://coursedata:${password}@clusterforcoursedata.szvwi4y.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note =  new Note({
  content: 'Mongoose makes things easy',
  important: false,
})

// Fetching objects from the database
Note.find({ important: false }).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

// Generate new note
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
