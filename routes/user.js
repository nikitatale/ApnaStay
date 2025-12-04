const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");
const { signupForm, signup, loginForm, successfulLogin, logout } = require("../controllers/user.js");

router.route("/signup")
.get(signupForm)
.post(wrapAsync(signup));

router.route("/login")
.get(loginForm)
.post(saveRedirect, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), successfulLogin);

router.get("/logout", logout);

module.exports = router;