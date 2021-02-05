const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

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
	res.json(persons);
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
	const newPerson = req.body;

	if (newPerson.name === undefined || newPerson.number === undefined) {
		res.status(400);
		res.json({ error: 'name or number missing' });
	} else if (nameAlreadyExists(newPerson.name)) {
		res.status(400);
		res.json({ error: 'Person already Exists.' });
	} else {
		newPerson.id = Math.floor(Math.random() * (999 - 0 + 1)) + 0;
		persons.push(newPerson);
		res.json(newPerson);
	}
});

const PORT = 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
