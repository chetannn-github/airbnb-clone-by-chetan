const express = require("express");
const router= express.Router({mergeParams:true });

const {validateReview} = require("../utils/schemaValidation.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewOwner } = require("../utils/middlewares.js");
const { destroyReview, addNewReview } = require("../controllers/reviews.js");


router.post("/",isLoggedIn,validateReview,wrapAsync(addNewReview));
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(destroyReview));

module.exports = router;