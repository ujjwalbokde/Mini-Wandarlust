const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError")
const listingRoute=require("./routes/listing")
const reviewRoute=require("./routes/review.js")
const userRoute=require("./routes/user.js") 

const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./Models/user")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}


main()
.then((res) => {
  console.log("Connection Successfull");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
})

// app.get("/demoUser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"std@gmail.com",
//     username:"angel2340"
//   })
//   let registeredUser=await User.register(fakeUser,"abcpass")
//   res.send(registeredUser)
// })

app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",userRoute);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found!"))
})

//error handling 
app.use((err,req,res,next)=>{
  let {status=500,message="Something went wrong"}=err
  res.status(status).render("error.ejs",{message})
})

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
