const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  const page = parseInt(req.query.page) || 1; 
  const limit = 8; 
  const query = category ? { category } : {};

  const totalListings = await Listing.countDocuments(query);
  const totalPages = Math.ceil(totalListings / limit);

  const allListings = await Listing.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  res.render("listings/index", { 
    allListings, 
    category, 
    currentPage: page, 
    totalPages 
  });
};



module.exports.RenderNewForm = (req, res) => {
    res.render('listings/new')
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path: 'reviews', populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render('listings/show', {listing});
}

module.exports.createListing = async(req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New Listing Created!");
  return res.redirect('/listings');
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you are looking for does not exist");
        return res.redirect("/listings");
    }

    let originaLlImageUrl = listing.image.url;
    originaLlImageUrl = originaLlImageUrl.replace("/upload", "/upload/w_250")

    res.render('listings/edit', {listing, originaLlImageUrl});
}

module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }

    req.flash("success", "Listing Successfully Updated!");
    return res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}



