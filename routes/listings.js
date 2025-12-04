const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index, RenderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing } = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.get('/new', isLoggedIn, RenderNewForm);

router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(createListing));

router.route('/:id')
.get(wrapAsync(showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(deleteListing));

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;
