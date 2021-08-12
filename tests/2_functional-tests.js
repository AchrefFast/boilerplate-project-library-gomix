/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../routes/db').Book;

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({
            'title': 'Test title'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'response should contain an _id ');
            assert.property(res.body, 'title', 'response should contain a title )');
            assert.equal(res.body.title, 'Test title', 'both titles should match');
            done();
          })
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({
            'title': ''
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], '_id', 'each element in the array should contain property of _id');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'comment');
            assert.equal(res.status, 200);
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/1')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
        //done();
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        const newBook = new Book({ 'title': 'Test Book' });
        newBook.save(function (err, doc) {
          const _id = doc._id;
          chai.request(server)
            .get('/api/books/' + _id)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.equal(res.body._id, _id);
              assert.equal(res.body.title, 'Test Book')
              done();
            })

        })
        //done();
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        const newBook = new Book({ 'title': 'Test Comment' });
        newBook.save(function (err, doc) {
          const _id = doc._id;
          chai.request(server)
            .post('/api/books/' + _id)
            .send({
              'comment': 'This is a Test Comment'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.equal(res.body._id, _id);
              assert.equal(res.body.title, 'Test Comment')
              assert.property(res.body, 'comments');
              done();
            })

        });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        const newBook = new Book({ 'title': 'Test Comment' });
        newBook.save(function (err, doc) {
          const _id = doc._id;
          chai.request(server)
            .post('/api/books/' + _id)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field comment')
              done();
            })

        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {

        chai.request(server)
          .post('/api/books/1')
          .send({
            'comment': 'This is a Test Comment'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })


      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {

        const newBook = new Book({ 'title': 'Test Delete' });
        newBook.save(function (err, doc) {
          const _id = doc._id;
          chai.request(server)
            .delete('/api/books/' + _id)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'delete successful')
              done();
            })

        });

      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/1')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })

      });

    });

  });

});
