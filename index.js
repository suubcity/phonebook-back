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

app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			next(error);
		});
});

// app.get('/info', (req, res) => {
// 	res.send(`
//     <div>
//         <p>Phonebook has info for ${persons.length} people.</p>
//         <p>${new Date()}</p>
//     </div>`);
// });

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			next(error);
		});
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).end())
		.catch((error) => next(error));
});

app.post('/api/persons/', (req, res, next) => {
	let newPerson = req.body;

	if (newPerson.name === undefined || newPerson.number === undefined) {
		res.status(400);
		res.json({ error: 'name or number missing' });
	} else if (nameAlreadyExists(newPerson.name)) {
		res.status(400);
		res.json({ error: 'Person already Exists.' });
	} else {
		newPerson = new Person(newPerson);

		newPerson
			.save(newPerson)
			.then((newPerson) => {
				res.json(newPerson);
			})
			.catch((error) => next(error));
	}
});

const errorHandler = (error, req, res, next) => {
	console.error(error.message);
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
