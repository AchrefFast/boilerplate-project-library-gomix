const mongoose = require('mongoose');

// Create the book schema.
const { Schema } = mongoose;
const bookSchema = new Schema({
    title: { type: String, required: true },
    commentcount: { type: Number, default: 0 },
    comment: [String]
});
// Create a book collection from which we're going to create book documents.
const Book = mongoose.model('Book', bookSchema);

// First method not recommended --------------------------------------------
// For test purposes, we had to use this way to connect to the database without asynchronous function.

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on('error', function (err) {
    console.log(err);
});
// mongoose.connection.once('open', function () { console.log('Connected to MongoDb...') });
module.exports.mongoose = mongoose;

// Export the book collection.
module.exports.Book = Book;

// ================================We're going to handle errors with try/catch ==============================
// We could as well use // async function main(callback){ code here }
// Because we're using an asynchronous function the test will start before connecting the database which will make the test fails.
// So we had to use the first way. Without test this is the best way to do the connection while catching any kind of error  when happens.


// const main = async (callback) => {
//     try {
//         console.log('MongoDb is connected...');
//         await callback(Book);
//     }
//     catch (error) {
//         console.log(error);
//     }
// }
// module.exports.DB = main;