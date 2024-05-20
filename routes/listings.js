const express = require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn, isOwner} = require("../utils/middlewares.js");
const {validateListing} = require("../utils/schemaValidation.js");
const { index, renderNewForm, destroy, showListing, renderEditForm, addNewListing, editListing } = require("../controllers/listings.js");

const multer = require('multer');
const {storage} = require("../utils/cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(addNewListing));

//new route
router.get("/new",isLoggedIn,renderNewForm);

router.route("/:id")
.get(wrapAsync(showListing))
.delete(isLoggedIn,isOwner, wrapAsync(destroy))
.patch(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(editListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm));

// "/" nhi lagaoge toh phrrr url toh phr url uske  aage se shuru hogaaaa "listings/:id" mtlb existing path se aage
// "/" lagaoge toh phrrr url toh phr url  shuru se shuru hogaaaa "listings/:id" 
// yhh upar wali  baat ejs /html me jb path likhoge tb dhyan rkhnaaa hhhhh



module.exports = router;