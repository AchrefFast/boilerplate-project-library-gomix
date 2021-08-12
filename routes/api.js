/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../routes/db').Book;
const ObjectId = require('mongoose').Types.ObjectId;
module.exports = function (app) {


  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function (err, docs) {
        if (err) res.json('Something went wrong');
        res.json(docs);
      });

    })

    .post(function (req, res) {

      let title = req.body.title;
      if (!title) return res.send('missing required field title');
      const newBook = new Book({ title: title });
      newBook.save(function (err, doc) {
        if (err) res.send('missing required field title')
        res.json({ _id: doc._id, title: doc.title });
      })
      //response will contain new book object including atleast _id and title
    })


    .delete(function (req, res) {
      Book.deleteMany({}, function (err, docs) {
        if (err) return res.send("Could not remove.");
        else return res.send("complete delet successful");
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res, next) {
      let bookid = req.params.id;
      Book.findById(bookid, function (err, doc) {
        if (err) return res.send('no book exists');
        else {
          if (!doc)
            return res.send('no book exists');

          else
            res.json({ "_id": doc._id, "title": doc.title, "comments": doc.comment });
        }
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) return res.send('missing required field comment');


      Book.findOneAndUpdate(
        { _id: bookid },
        { $push: { 'comment': comment }, $inc: { 'commentcount': 1 } },
        { new: true, lean: true },
        function (err, doc) {
          if (err) return res.send('no book exists');
          else {
            res.json(doc);
          }
        })


      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findOneAndDelete({ _id: bookid }, function (err, doc) {
        if (err) return res.send('no book exists');
        else {
          if (!doc)
            return res.send('no book exists');
          else
            return res.send('delete successful');
        }
      })
    });

  //404 Not Found Middleware
  app.use(function (err, req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });


};


