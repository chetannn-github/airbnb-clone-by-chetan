const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    price:Number,
    country:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true,},
        coordinates:{
            type:[Number],
            required:true}
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;