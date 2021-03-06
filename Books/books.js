const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());
app.use(bodyparser.json());

const publicPath = path.join(__dirname, '../public');

const template_path = path.join(__dirname, '../Views');

const mongoose = require('mongoose');
const { response } = require('express');

app.use(express.static(publicPath));

app.set('view engine', 'hbs');

app.set('Views', template_path);

require('./book');

const Book = mongoose.model('Book');
const CloudDBuri = process.env.DATABASE;

mongoose
  .connect(CloudDBuri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('mongoose DB is connected..');
  })
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Demo done');
  // res.render('index', {
  //   apiUrl: req.apiGateway
  //     ? `https://${req.apiGateway.event.headers.Host}/${req.apiGateway.event.requestContext.stage}`
  //     : 'http://localhost:4200',
  // });
  // res.send(req.apiGateway.event.headers.Host + "" + req.apiGateway.event.headers.Host );
});

app.get('/addBook', (req, res) => {
  // console.log(req.get('Host') );
  // console.log(req.url);
  //res.render('https://' + req.get('Host') + "index")
});

app.get('/book/:id', (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book) {
        res.json(book);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => console.log(err));
});

app.post('/addBook', (req, res) => {
  var newBook = {
    title: req.body.title,
    author: req.body.author,
    numberPages: req.body.numberPages,
    publisher: req.body.publisher,
  };
  var book = new Book(newBook);

  book
    .save()
    .then(() => {
      console.log('New book created');
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      } else {
      }
    });
  res.send('New book created with success..');
  // console.log(req.body);
  // res.send("post book service");
});

const port = process.env.port || 4200;
app.listen(port, () => {
  console.log('book service is running');
});

module.exports = app;
