const express = require("express");
const router = express.Router();
const User=require("../Models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup",(req,res)=>{
    res.render("users/signup")
})

router.post("/signup",wrapAsync(async(req,res,next)=>{
try{
    let {username,email,password}=req.body
    const newUser=new User({email,username})
    const registeredUser=await User.register(newUser,password)
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Welcome to Wanderlust!")
        res.redirect("/listings")
    })
}catch(e){
    req.flash("error",e.message)
    res.redirect("/signup")
}
}))

router.get("/login",(req,res)=>{
    res.render("users/login")
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(async(req,res)=>{
    try{
        req.flash("success","Welcome to Wanderlust!, You're Logged in!")
        let redirectUrl=res.locals.redirectUrl ||"/listings";   
        res.redirect(redirectUrl)
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}))

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You're Logged Out!")
        res.redirect("/listings");
    })
})
module.exports=router;