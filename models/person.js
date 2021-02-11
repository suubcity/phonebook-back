const mongoose = require('mongoose');
require('dotenv').config();
const uniqueValidator = require('mongoose-unique-validator');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(console.log('Connected to MongoDB'));

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		minlength: 3,
	},
	number: { type: String, minlength: 8 },
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);
