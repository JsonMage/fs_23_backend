const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://acidroot64:${password}@phone-data.o73apqm.mongodb.net/?retryWrites=true&w=majority&appName=phone-data`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length === 3) {
    Note.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)            
        })
        mongoose.connection.close()
    })
} else {
    const note = new Note({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    note.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phone book`)
        mongoose.connection.close()
    })
}

