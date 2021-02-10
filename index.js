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

app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/info/', (req, res, next) => {
	Person.count({}, (error, result) => {
		if (error) {
			next(error);
		} else {
			res.send(`<div>The phonebook has ${result} entries.</div>
			<div>${new Date()}</div>`);
		}
	});
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).end())
		.catch((error) => next(error));
});

app.post('/api/persons/', (req, res, next) => {
	let personToAdd = req.body;

	if (personToAdd.name === undefined || personToAdd.number === undefined) {
		res.status(400);
		res.json({ error: 'name or number missing' });
	} else {
		personToAdd = new Person(personToAdd);

		personToAdd
			.save(personToAdd)
			.then((newPerson) => {
				res.json(newPerson);
			})
			.catch((error) => next(error));
	}
});

app.put('/api/persons/:id', (req, res, next) => {
	const personToUpdate = req.body;
	const id = req.params.id;
	Person.findByIdAndUpdate(id, personToUpdate, { new: true })
		.then((updatePerson) => {
			return res.json(updatePerson);
		})
		.catch((error) => {
			next(error);
		});
});

const errorHandler = (error, req, res, next) => {
	console.error(error.message);
	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' });
	}
	if (error.name === 'ValidationError') {
		return res.status(409).send({ error: 'name needs to be unique' });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
