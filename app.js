if(process.env.NODE_ENV != "production"){
 require("dotenv").config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8080;
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ExpressError = require('./utils/ExpressError.js');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user.js');


const listingRouter = require('./routes/listings.js');
const reviewRouter = require('./routes/reviews.js');
const userRouter = require("./routes/user.js");



const dbURL = process.env.MONGO_URL

main().then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbURL);
}

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionOption = session({
    store: store,
    secret: process.env.SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}); 

// app.get('/', (req, res) => {
//     res.send('Hi, I am root');
// });

app.use(sessionOption);
app.use(flash());

app.use(passport.initialize());  //middleware for initialized passport
app.use(passport.session());  //to identify users as they browse from page to page
passport.use(new LocalStrategy(User.authenticate())); //to login users

passport.serializeUser(User.serializeUser());  //store info in session - no need login again
passport.deserializeUser(User.deserializeUser()); //remove into from session
//implemented algorithm in hashing -> pdkdf-2

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser", async(req, res) => {
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "abc"
//     });

//    const newUser =  await User.register(fakeUser, "helloWorld"); 
//    res.send(newUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews/", reviewRouter);
app.use('/', userRouter);

app.get('/', (req, res) => {
  res.redirect('/listings');
});

app.all('/*splat', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
})

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    
    let {status=500, message='something went wrong'} = err;
    res.status(status).render('listings/error', {message});
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})