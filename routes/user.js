const express = require("express");
const router= express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../utils/middlewares.js");
const { renderLoginForm, login, renderSignUpForm, signup, logout } = require("../controllers/user.js");




router
.route("/login")
.get(renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}), wrapAsync(login));

router
.route("/signup")
.get(renderSignUpForm)
.post(wrapAsync(signup));

router.get("/logout", isLoggedIn,logout);

module.exports = router;