const express = require('express');
const app = express();

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

const PORT = 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
