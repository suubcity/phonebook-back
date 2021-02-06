require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

morgan.token('showData', (req, res) => {
	return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :showData'));

let persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1,
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 2,
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3,
	},
	{
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
		id: 4,
	},
	{
		name: 'Martyn Thomas',
		number: '123456',
		id: 8,
	},
];

const nameAlreadyExists = (name) => {
	return persons.find((person) => {
		return person.name === name;
	});
};

app.get('/api/persons', (req, res) => {
	Person.find({}).then((result) => {
		res.json(result);
	});
});

app.get('/info', (req, res) => {
	res.send(`
    <div>
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date()}</p>
    </div>`);
});

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id;

	const person = persons.find((person) => {
		return person.id === +id;
	});
	res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id;

	persons = persons.filter((person) => {
		return person.id !== +id;
	});
	console.log(persons);
	res.status(204).end();
});

app.post('/api/persons/', (req, res) => {
	let newPerson = req.body;

	if (newPerson.name === undefined || newPerson.number === undefined) {
		res.status(400);
		res.json({ error: 'name or number missing' });
	} else if (nameAlreadyExists(newPerson.name)) {
		res.status(400);
		res.json({ error: 'Person already Exists.' });
	} else {
		newPerson = new Person(newPerson);

		newPerson.save(newPerson).then((newPerson) => {
			res.json(newPerson);
		});
	}
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
