const express = require("express");
const router= express.Router();
const {isLoggedIn, isOwner} = require("../utils/middlewares.js");
const {validateListing} = require("../utils/schemaValidation.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { index, renderNewForm, destroy, showListing, renderEditForm, addNewListing, editListing } = require("../controllers/listing.js");

const multer = require('multer');
const {storage} = require("../utils/cloudConfig.js")
const upload = multer({storage});

router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(addNewListing));

//new route
router.get("/new",isLoggedIn,renderNewForm);

router
.route("/:id")
.delete(isLoggedIn,isOwner, wrapAsync(destroy
))
//show route
.get(wrapAsync(showListing))
.patch(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(editListing)
);

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm)
);

// "/" nhi lagaoge toh phrrr url toh phr url uske  aage se shuru hogaaaa "listings/:id" mtlb existing path se aage
// "/" lagaoge toh phrrr url toh phr url  shuru se shuru hogaaaa "listings/:id" 
// yhh upar wali  baat ejs /html me jb path likhoge tb dhyan rkhnaaa hhhhh


//update route


module.exports = router;