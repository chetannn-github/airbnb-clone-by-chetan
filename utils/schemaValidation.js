const {listingSchema,reviewSchema} = require("./schema.js");
const wrapAsync = require("./wrapAsync.js")

const validateListing =wrapAsync(async(req,res,next)=>{
    // console.log("hiiii i am validator");
    // console.log(req.body.listing );
    await listingSchema.validateAsync(req.body.listing);
    next();
});



const validateReview =wrapAsync(async(req,res,next)=>{
    
    await reviewSchema.validateAsync(req.body.review);
    next();
});

module.exports = {validateListing,validateReview};  