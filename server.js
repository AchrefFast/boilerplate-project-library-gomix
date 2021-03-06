'use strict';
// const DB = require('./routes/db').DB;
const express = require('express');
// const bodyParser  = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const mongoose = require('./routes/db').mongoose;
const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Index page (static HTML)
mongoose.connection.once('open', function () {
  console.log('Connected to MongoDb...');

  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
    });


  //For FCC testing purposes
  fccTestingRoutes(app);

  //Routing for API 
  apiRoutes(app);

  // Didn't work with test.
  // DB(async Book => {
  //   //For FCC testing purposes
  //   fccTestingRoutes(app);

  //   //Routing for API 
  //   apiRoutes(app, Book);

  // });



  //Start our server and tests!
  app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + process.env.PORT);
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch (e) {
          let error = e;
          console.log('Tests are not valid:');
          console.log(error);
        }
      }, 1500);
    }
  });
});
module.exports = app; //for unit/functional testing
