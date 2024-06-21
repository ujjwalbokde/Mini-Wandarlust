const express = require("express");
const app = express();
const cookieParser=require("cookie-parser")
const session=require("express-session")
const flash=require("connect-flash")

const sessionOption={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionOption))
app.use(flash())

app.get("/register",(req,res)=>{
    let {name="Null"}=req.query
    req.session.name=name;
    req.flash("Success","user registed successfully")
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.send(`Hello ${req.session.name}`)
})

app.listen(3000,(req,res)=>{
    console.log("Server started at port 3000");
})