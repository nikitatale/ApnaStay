<p align="center">
  <h1 align="center">🏡 ApnaStay</h1>
  <p align="center">
    An AI-powered full stack travel platform where users can discover, review, and share unique stays.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black" />
</p>

---

## 🌐 Live Demo

👉 [Open ApnaStay](https://apna-stay-eosin.vercel.app/listings)


---

## 🌐 Live Demo
👉 [Open ApnaStay](https://apna-stay-eosin.vercel.app/listings)

---

## ✨ Features

- 🔐 **User Authentication** — Secure login/signup with Passport.js
- 🏠 **Full CRUD** — Create, read, update, delete listings
- 🤖 **AI Description Generator** — Auto-generate listing descriptions using Groq LLaMA AI
- 🔍 **AI Smart Search** — Natural language search ("beach under ₹2000")
- 📝 **AI Review Summarizer** — Summarize all reviews in 2-3 lines using AI
- 🗂️ **Category Filters** — Browse by Trending, Beach, Mountains, Camping & more
- ⭐ **Reviews & Ratings** — Star rating system with Starability
- 🗺️ **Map Integration** — Google Maps embed on listing detail page
- 📸 **Image Uploads** — Cloudinary integration via Multer
- 💬 **Flash Messages** — Real-time success/error notifications
- 📱 **Fully Responsive** — Mobile-friendly dark theme UI
- ✅ **Form Validation** — Server-side with Joi, client-side with Bootstrap

---

## 🚀 Highlights

✔ Full Stack MVC Architecture  
✔ Authentication & Authorization  
✔ AI Integration (Groq LLaMA 3.1)  
✔ Image Upload System (Cloudinary)  
✔ Smart Natural Language Search  
✔ Responsive UI  
✔ Production Deployment

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | EJS, Bootstrap, Custom CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Passport.js (Local Strategy) |
| File Uploads | Multer + Cloudinary |
| Session | express-session + connect-mongo |
| Validation | Joi |
| AI Features | Groq API (LLaMA 3.1) |
| Architecture | MVC |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Groq API key (free at console.groq.com)

### Installation
```bash
# Clone the repo
git clone https://github.com/nikitatale/ApnaStay.git
cd ApnaStay

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Fill in your .env values

# Run the app
node app.js
```

### Environment Variables
```env
MONGO_URL=your_mongodb_url
SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
GROQ_API_KEY=your_groq_api_key
```

---

## 📁 Project Structure
```
ApnaStay/
├── models/          # Mongoose schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/          # Express routers
│   ├── listings.js
│   ├── reviews.js
│   └── user.js
├── views/           # EJS templates
│   ├── layouts/
│   ├── listings/
│   └── includes/
├── public/          # Static assets
│   ├── css/
│   └── js/
├── utils/           # Helper functions
├── middleware.js
└── app.js
```

---

## 🤖 AI Powered Features (Groq LLaMA 3.1)

### 1. Description Generator
Host fills title + location → clicks **"✨ Generate with AI"** → description auto-fills using LLaMA AI.

### 2. Smart Search
User types natural language query like *"romantic mountain stay under ₹3000"* → AI matches best listings from database.

### 3. Review Summarizer
Listings with 3+ reviews show **"✨ Summarize"** button → AI generates a 2-3 line summary of all guest feedback.

---

## 👨‍💻 Author

**Nikita Tale**
- GitHub: [@NikitaTale](https://github.com/nikitatale)
- LinkedIn: [NikitaTale](https://www.linkedin.com/in/nikita-tale)
