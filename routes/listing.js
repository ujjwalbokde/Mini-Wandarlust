const express = require("express");
const router = express.Router();
const Listing = require("../Models/listing");
const wrapAsync=require("../utils/wrapAsync")
const ExpressError=require("../utils/ExpressError")
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")

//Index route
router.get("/",wrapAsync( async (req, res) => {
    let allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
  }));
  
  router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
  })
  
  //show route
  router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
      path:"reviews",
      populate:{
        path:"author"
      }
    }).populate("owner")
    res.render("listings/show.ejs",{listing})
  }))
  
  //Create Route
  router.post("/",validateListing,wrapAsync(async (req,res,next)=>{ 
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
      req.flash("success","New Listing Created!")
      res.redirect("/listings");
  }))
  


  router.get("/:id/edit",isLoggedIn,isLoggedIn,isOwner,wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
  }))
  
  //update route
  router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync( async (req,res)=>{
    if(!req.body.listing){
      throw new ExpressError(400,"Send valid data for listing")
    }  
    let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success","Listing Updated!")
      res.redirect(`/listings/${id}`)
  }))
  
  //Destroy route
  router.delete("/:id",isLoggedIn,isLoggedIn,isOwner,wrapAsync( async (req,res)=>{
      let {id}=req.params;
      let deletedListing=await Listing.findByIdAndDelete(id);
      req.flash("success","Listing deleted!")
      res.redirect("/listings")
  }))

  module.exports=router;