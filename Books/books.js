//load express
const express = require("express");
const app = express();
const bodyparser = require("body-parser");

app.use(
    express.urlencoded({
      extended: true
    })
  )

app.use(express.json())
app.use(bodyparser.json());


const mongoose = require("mongoose");
const { response } = require("express");

require("./book")

const Book = mongoose.model("Book")
const CloudDBuri = "mongodb+srv://atul:Atulpostman@15@cluster0.vzqih.mongodb.net/bookService_atul?retryWrites=true&w=majority";
const localDBUri = "mongodb://localhost:27017/AtulBookStore";
mongoose.connect(CloudDBuri,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
    console.log("mongoose DB is connected..")
}).catch((err) => console.log(err));

//Cloud based mongoDB
// const MongoClient = require('mongodb').MongoClient;

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect().then(() => {
//     //const collection = client.db("bookService_atul").collection("Atul");
//     console.log("DB is connected.."); 
    
//   })
// .catch(err => {
//     console.error('App starting error:', err.stack);
//     process.exit(1)
// });

app.post("/book",  (req,res)=>{
   var newBook = {
    title: req.body.title,
    author: req.body.author,
    numberPages: req.body.numberPages,
    publisher: req.body.publisher
    }
   var book = new Book(newBook)


     book.save().then(() => {
        console.log("New book created")
    }).catch((err) => {
        if(err){
            // Here, what happens if the err variable is not empty?
            // The done function is never called here, hence it may never finish (timeout)
            console.log(err);
          } else{
           
          }

   }) 
   res.send("New book created with success..")
    // console.log(req.body);
    // res.send("post book service");

})

app.get("/", (req,res) => {

console.log("Welcome to atul book store from console.")
  // Book.find().then((books)=> {
  //  // console.log(books)
  //  res.json(books)
  // }).catch((err) => { console.log(err)})
   res.send("Welcome to atul book store");
})

app.get("/book/:id", (req,res) => {

  Book.findById(req.params.id).then((book)=> {   
    if(book){
      res.json(book)
    }
    else{
      res.sendStatus(404);
    }
   
  }).catch((err) => console.log(err));
   
})
const port = process.env.port || 4200;
app.listen(port,()=> {
console.log("book service is running");
})