const User = require("../models/user.js");


module.exports.renderLoginForm= (req,res,next)=>{
    res.render("login.ejs");
}


module.exports.login = async(req,res,next)=>{
    req.flash("success", "Welcome To Airbnb ");
    let url =(res.locals.redirectUrl&& res.locals.redirectUrl ==!"/logout") ? res.locals.redirectUrl : "/listings";
    res.redirect(url) ;
}


module.exports.renderSignUpForm= (req,res,next)=>{
    res.render("signup.ejs");
}


module.exports.signup=  async(req,res,next)=>{ 
    try{
        let {username,email, password} = req.body;
    email = email.trim();
    username= username.trim();
    const newUser = new User ({email,username});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){return next(err);}
       req.flash("success","welcome to airbnb!!!!");
        res.redirect("/listings");
    })
    
    }catch(e){
        // console.log(e.message);
        req.flash("error",e.message);
        res.redirect("/signup")
    }
 }


module.exports.logout =(req,res,next) =>{
    // console.log(req.logout);
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","logged you out!");
    res.redirect("/listings");
    })
}