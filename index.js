const express = require('express')
const moment = require('moment')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

morgan.token('reqJson', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqJson'))

let phone_numbers = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons/', (request, response) => {
    if (phone_numbers) {
        response.json(phone_numbers)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const requestTime = request.time
    const dateTime = moment(requestTime)
    const page = `
    <p>
    Phonebook has info for ${phone_numbers.length} people. <br/>
    ${dateTime.format('ddd MMM DD YYYY HH:mm:ss ZZ')}
    </p>`
    response.send(page)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phone_numbers.find((number) => number.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person_index = phone_numbers.findIndex((number) => number.id === id)
    if (person_index != -1) {
        phone_numbers.splice(person_index, 1)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const person = {...request.body}

    const validations = {
        isName: person.hasOwnProperty('name') ? null : 'Name property must be provided.',
        isNumber: person.hasOwnProperty('number') ? null : 'Number property must be provided.',
        isNameInPhoneBook: !!phone_numbers.find((entry) => entry.name == person.name) ? 'Name must be unique.' : null
    }

    const errors = []

    Object.keys(validations).forEach((key) => validations[key] != null ? errors.push(validations[key]) : null)

    if (errors.length != 0) {
        response.status(400).json(errors)
    } else {
        const id = Math.floor(Math.random() * 10000000)

        person.id = id

        phone_numbers = phone_numbers.concat(person)
        response.json(person)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})