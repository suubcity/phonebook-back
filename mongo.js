const { text } = require('express');
const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

console.log(password);

const url = `mongodb+srv://fullstack:${password}@cluster0.fc3dh.mongodb.net/phonebook?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name === undefined && number === undefined) {
	Person.find({}).then((result) => {
		console.log('phonebook:');
		result.forEach((person) => {
			console.log(person.name);
			console.log(person.number);
		});
	});
} else {
	const newPerson = new Person({
		name: name,
		number: number,
	});

	newPerson.save().then(console.log(`added ${name} number ${number} to phonebook`));
	mongoose.connection.close();
}

mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(console.log('Connected to MongoDB'));
