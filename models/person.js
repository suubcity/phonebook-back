const mongoose = require('mongoose');
require('dotenv').config();

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
	name: String,
	number: String,
});

module.exports = mongoose.model('Person', personSchema);
