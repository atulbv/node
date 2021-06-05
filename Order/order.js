const mongoose = require("mongoose")

const orderschema = new mongoose.Schema({
        BookId :{
            type: mongoose.SchemaTypes.ObjectId,
            required:true
        },
        initialDate :{
            type: Date,
            required:true
        },
        DeliveryDate :{
            type: Date,
            required:true
        }
})

const order = new mongoose.model("Order", orderschema);
