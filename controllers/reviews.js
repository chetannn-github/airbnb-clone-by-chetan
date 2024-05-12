const Listing = require("../models/listing");
const Review= require("../models/review.js");


module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId}= req.params;
    
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}



module.exports.addNewReview =  async(req,res) =>{
    let {id} = req.params;
    
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);

    await newReview.save();

    // method 1
    // const updatedListing= await Listing.findByIdAndUpdate(id, {$push:{reviews: newReview}});

    // method 2
    const listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success","Review Created!!");

    // console.log(id);
    res.redirect(`/listings/${id}`);
    
    
}