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

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

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
app.use(express.json());

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


// Route For Smart Search

app.get("/listings/ai-results", (req, res) => {
  res.render("listings/ai-results");
});

// Routes for Listings
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews/", reviewRouter);
app.use('/', userRouter);

app.get('/', (req, res) => {
  res.redirect('/listings');
});

// Route for generating description using AI for listing when user create a new listing
app.post("/generate-description", async (req, res) => {
  const { title, location, country, category, price } = req.body;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{
            role: "user",
            content: `Write a short, attractive travel listing description (max 3 sentences) for:
           Title: ${title}
           Location: ${location}, ${country}
           Category: ${category}
           Price: ₹${price} per night

           Make it warm, inviting and highlight the experience. No bullet points, just flowing text.`
          }],
          max_tokens: 300
        })
      }
    );

    const data = await response.json();
    const description = data?.choices?.[0]?.message?.content || "Failed to generate. Try again.";
    res.json({ description });

  } catch(err) {
    console.log("Groq API error:", err);
    res.status(500).json({ error: "Failed to generate description" });
  }
});


// Route for summarize reviews using AI to get best guidance about places - Good/Bad
app.post("/summarize-reviews", async (req, res) => {
  const { reviews } = req.body;

  if (!reviews || reviews.length < 3) {
    return res.json({ summary: null });
  }

  const reviewText = reviews
    .map((r, i) => `Review ${i+1} (${r.rating}/5): ${r.comment}`)
    .join("\n");

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{
            role: "user",
            content: `Summarize these guest reviews in 2-3 sentences. Mention what guests loved and any concerns. Be concise and helpful for future travelers:
            ${reviewText}`
          }],
          max_tokens: 150
        })
      }
    );

    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content || "Could not summarize reviews.";
    res.json({ summary });

  } catch(err) {
    console.log("Groq summarize error:", err);
    res.status(500).json({ error: "Failed to summarize" });
  }
});


//Route for Smart Searching Using AI - user can add their choice in search
app.post("/ai-search", async (req, res) => {
  const { query } = req.body;
  const allListings = await require('./models/listing.js').find({});

  const listingsSummary = allListings.map(l => ({
    id: l._id,
    title: l.title,
    location: l.location,
    country: l.country,
    category: l.category,
    price: l.price,
    description: l.description
  }));

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{
            role: "user",
            content: `You are a travel listing search assistant. Based on the user query, return ONLY a JSON array of matching listing IDs. Nothing else, no explanation.
            User query: "${query}"
           Available listings:
          ${JSON.stringify(listingsSummary, null, 2)}
          Return format: ["id1", "id2", "id3"]
          If no match found return: []`
          }],
          max_tokens: 500
        })
      }
    );

    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content?.trim() || "[]";
    content = content.replace(/```json|```/g, '').trim();
    const matchedIds = JSON.parse(content);

    const matchedListings = allListings.filter(l =>
      matchedIds.includes(l._id.toString())
    );

    res.json({ listings: matchedListings });

  } catch(err) {
    console.log("AI Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});


//Error Handling Part
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