const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js')


const listingSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
     url: String,
     fileName: String
  },
    price: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }, 
   category: {
  type: String,
  required: true,
  enum: ["Trending", "Rooms", "IconicCities", "Mountains", "AmazingPools", "Camping", "Beach", "Farms"]
},

});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
  await Review.deleteMany({_id : {$in: listing.reviews}});
  }
})

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;