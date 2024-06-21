const express = require("express");
const router = express.Router({mergeParams:true});
const Review=require("../Models/review")
const wrapAsync=require("../utils/wrapAsync")
const Listing = require("../Models/listing");
const {isLoggedIn,validateReview}=require("../middleware.js")


//post review route
router.post("/",validateReview,isLoggedIn,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review)
    listing.reviews.push(newReview)
    let {id}=req.params;
    await newReview.save()
    await listing.save()
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${id}`)
  }))
  
  //delete review route
  router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}` )
  }))
  
  module.exports=router;