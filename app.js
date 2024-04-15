if(process.env.NODE_ENV != 'production'){
require('dotenv').config();
}


const express = require("express");
const app = express();
const port = 8080;
const methodOverride =require("method-override");
const path = require("path");
const mongoose= require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");



const ExpressError = require("./utils/ExpressErrorClass");
const listings = require("./routes/listings");
const reviews = require("./routes/reviews");
const user = require("./routes/user.js")

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public/stylesheet"))); 
app.use(express.static(path.join(__dirname,"/public/js")));

const MONGO_URL =process.env.MONGO_LINK;

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",() =>{
    console.log("error in mongosession store", err);
});


const sessionOptions = {
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const wrapAsync = require("./utils/wrapAsync.js");
const { index} = require("./controllers/listing.js");

app.use((req,res,next) =>{ 
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    
    res.locals.currUser = req.user;
    next();
})


main().then(() => {
    console.log(`connected to db!!!`);
})
.catch((err) =>{
    console.log(err);
});

async function main(){
     await mongoose.connect(MONGO_URL);
}

// ___________________routes__________________________
app.get("/", wrapAsync(index));

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user)



 

app.all("*",(req,res,next)=>{
    throw new ExpressError(404,"Page not found!!");
    // next(new ExpressError(404,"Page not found!!"));
});


app.use((err,req,res,next)=>{
   let{statusCode=500,message="something went wrong"}= err;
//    console.log(err.message);
   res.status(statusCode).render("error.ejs",{err});
})


 app.listen(port,() => {
    console.log(`listening to port ${port}`);
});


// doubtt  listing.ejs me jb css link krne prrr / hatane prr dikkt nhii hoo rhiii but 
// new.ejs me kuuu ho rhii hhh