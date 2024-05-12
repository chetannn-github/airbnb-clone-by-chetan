const Listing = require("../models/listing");
const Review= require("../models/review.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async(req,res) => {
    let allListings = await Listing.find({});
    // console.log(data); 
    res.render("home.ejs" , {allListings} );
};


module.exports.renderNewForm  = (req,res) => {  
    res.render("new.ejs");
};

module.exports.destroy = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id);

    if(listing.reviews.length){
        // console.log("reviews delete hogyee!!!!!!");
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
}

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",
        populate:{
            path:"author"
        }    
    })
    .populate("owner");
    // console.log(listing);
    let calcAvgRating = () =>{
        let {reviews} = listing;
        let totalRatings=0;
        for(review of reviews){
            totalRatings+= review.ratings;
        }   
        return reviews.length? totalRatings/reviews.length : 0;
    }
    
    let avgRating= calcAvgRating();
    listing["avgRating"] = avgRating
    // console.log(listing.reviews);

    res.render("listing.ejs" , {listing} );
}


module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","OOPS !! Listing you try to edit does not exist");
        res.redirect("/listings")
    }

    // console.log(listing);
    res.render("edit.ejs" , {listing} );
}



module.exports.addNewListing = async(req,res,next) => {
    // let {title, description, image , price , country} = req.body;
    // let newUser= new Listing({
    //     title:title,
    //     description:description, 
    //     image:image,
    //     price:price,
    //     country:country
    // });

    // console.log(req.body);
    // if(!req.body){
    //     throw new ExpressError(400,"send valid data for listing")
    // }
    // console.log(req.body.listing);



    let response = await geocodingClient.forwardGeocode({
        query: `${req.body.listing.country}`,
        limit: 1,
      }).send();
       
    let geometry = response.body.features[0].geometry;
    // console.log(geometry);

    let {path, filename } = req.file;
    let newListing = new Listing(req.body.listing);
    newListing.owner =res.locals.currUser._id;   
    newListing.image.url = path;
    newListing.image.filename= filename;  
    newListing.geometry=geometry ;  

    await newListing.save();
    req.flash("success","New Listing Created!!");
    res.redirect("/listings");
   }


module.exports.editListing = async(req,res) =>{
    let {id} = req.params;
    // console.log(req.body.listing);
    

    let result = await Listing.findByIdAndUpdate(id,req.body.listing);
    
    if(req.file){
        let {path,filename} = req.file;
        result.image.url = path;
        result.image.filename = filename;
        result.save();
    }
    

    req.flash("success","Listing Edited Successfully!!");
//    console.log(result);
   res.redirect(`/listings/${id}`);
}