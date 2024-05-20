const Listing = require("../models/listings");
const Review = require("../models/reviews");
const wrapAsync = require("./wrapAsync");


module.exports.isLoggedIn  = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // yh code for convenience of user that kii user jhaa jana chahta thaa wha jaaye after login
    
        req.flash("error","you must be login");
        return res.redirect("/login");
    }
    next();

}


// kuki passport js after login session ko reset krr deti hhh isliye local variable me store krwaya hhh
// you will ask why we are not directly storing in local variable phele state me save krr rheee hh then local me esaa kuuu??
module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};



module.exports.isOwner  = wrapAsync(async(req,res,next) =>{
        let {id} = req.params;
        let listing = await Listing.findById(id); 
    
        if(!(res.locals.currUser&&listing.owner.equals(res.locals.currUser._id))){
            req.flash("error", "you're not the owner this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
        
        }
);



module.exports.isReviewOwner  = wrapAsync(async(req,res,next) =>{
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId); 

    if(!(review.author.equals(res.locals.currUser._id))){
        req.flash("error", "you're not the owner this review");
        return res.redirect(`/listings/${id}`); 
    }
    next();

    }
);
    