const Listing=require("./Models/listing")
const {listingSchema}=require("./schema.js")
const ExpressError=require("./utils/ExpressError")
const {reviewSchema}=require("./schema.js")

module.exports.validateListing=(req,res,next)=>{
  let result=listingSchema.validate(req.body)
  console.log(result);
  if(result.error){
    throw new ExpressError(404,result.error)
  }else{
    next()
  }
}

module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body)
  if(error){
    throw new ExpressError(404,error)
  }else{
    next()
  }
}

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl 
        req.flash("error","You must logged in to create listing!")
        return res.redirect("/login")
      }
      next()
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
  }
  next()
}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id)
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","You are not the owner of this lsisting")
    return res.redirect(`/listings/${id}`)
  }
  next()
}