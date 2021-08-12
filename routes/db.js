const mongoose = require('mongoose');

const { Schema } = mongoose;
const bookSchema = new Schema({
    title: { type: String, required: true },
    commentcount: { type: Number, default: 0 },
    comment: [String]
});
const Book = mongoose.model('Book', bookSchema);

// First method not recommended --------------------------------------------
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on('error', function (err) {
    console.log(err);
});
mongoose.connection.once('open', function () { console.log('Connected to MongoDb...') });

module.exports.Book = Book;

// ================================We're going to handle errors with try/catch ==============================
// We could as well use // async function main(callback){ code here }
// const main = async (callback) => {
//     try {
//         await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
//         console.log('MongoDb is connected...');
//         await callback(Book);
//     }
//     catch (error) {
//         console.log(error);
//     }
// }
// module.exports.DB = main;