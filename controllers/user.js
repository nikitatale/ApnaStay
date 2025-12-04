const User = require("../models/user.js");

module.exports.signupForm =  (req, res) => {
   return res.render("users/signup.ejs");
}

module.exports.signup = async(req, res, next) => {
   try {
     let {username, email, password} = req.body;
    let newUser = new User({email, username});
    let registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
        if(err){
            return next(err)
        }
    req.flash("success", "Welcome to ApnaStay!!!");
    return res.redirect("/listings");
    })
   } catch (error) {
     req.flash("error", error.message);
     return res.redirect("/signup");
   }
}

module.exports.loginForm = (req, res) => {
   return res.render("users/login.ejs")
}

module.exports.successfulLogin = async(req, res) => {
 req.flash("success", "Welcome back to ApnaStay! You are logged in."); 
 let redirectUrl = res.locals.redirectUrl || "/listings"
 return res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are Logged Out now");
        return res.redirect("/listings");
    });
}


