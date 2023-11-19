const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Hriday2406:OE6L3UZVQHiNzWO8@cluster0.ataj31s.mongodb.net/");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogDBSchema = new mongoose.Schema({
  postTitle : String,
  postData : String
});

const Blogdata = mongoose.model("Blogdata",blogDBSchema);

app.get("/",async function(req,res){
  const result = await Blogdata.find({});
  res.render("home",{posts : result});
});

app.get("/about",function(req,res){
  res.render("about");
});

app.get("/contact",function(req,res){
  res.render("contact");
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",async function(req,res){
  const postTitle = req.body.newTitle;
  const postData = req.body.newBlog;

  const newBlog = new Blogdata({
    postTitle: postTitle,
    postData: postData
  });

  try {
    await newBlog.save();
    res.redirect(`/posts/${postTitle}`);
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete",async (req,res) => {
  await Blogdata.findOneAndDelete({postTitle:req.body.deleteButton});
  res.redirect("/"); 
});

app.get("/posts/:postname",async function(req,res){
  const requestedTitle = _.lowerCase(req.params.postname);
  const result = await Blogdata.find({});

  result.forEach(function(post){
    const storedTitle = _.lowerCase(post.postTitle);
    if(requestedTitle === storedTitle){
      res.render("post",{head : post.postTitle , body : post.postData});
    }
    else{
      console.log("match not found");
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
