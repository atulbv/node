const express= require("express")
const app = express()
const bodyparser = require("body-parser");
const axios = require("axios")

app.use(bodyparser.json());

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

const mongoose = require("mongoose");

require("./order")

const Order = mongoose.model("Order")

mongoose.connect("mongodb://localhost:27017/AtulOrders",{ useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
    console.log("mongoose DB is connected..")
}).catch((err) => console.log(err));


app.post("/order",  (req,res)=>{
   var neworder = {
    BookId:  mongoose.Types.ObjectId(req.body.BookId),
    initialDate: req.body.initialDate,
    DeliveryDate: req.body.DeliveryDate
    }
   var order = new Order(neworder)


   order.save().then(() => {
        res.send("order created succuessfully")
    }).catch((err) => {
        if(err){
            console.log(err);
          } else{
           
          }

   }) 
   res.send("New order is created with success..")
 
})

app.get("/orders", (req,res) => {

  Order.find().then((books)=> {
   
   res.json(books)
  }).catch((err) => { console.log(err)})
   
})

app.get("/order/:id", (req,res) => {

    Order.findById(req.params.id).then((order)=> {   
    if(order){
      axios.get("http://localhost:4200/book/" + order.BookId).then((response) =>{
    
      var orderobject = {bookTitle: ''}
      orderobject.bookTitle= response

      res.json(orderobject)
      })
     
    }else{

      res.send("Invalid Order")
    }
    
   
  })
   
})

const port = process.env.port || 4201;
app.listen(port,()=> {
    console.log("book service is running");
    })