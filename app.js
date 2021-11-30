const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb", {useNewUrlParser: true});


const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);

// app.route("/articles").get().post().delete();   //first we did this....then put the function(req,res) in get, post and delete parenthesis........another syntax


////////////request targeting ALL articles is below///////////////////////////

app.route("/articles")
.get(function(req,res){  //check line above
  Article.find(function(err,foundArticles){  //foundArticles is all the articles we found out
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
}) //no semicolon here since we dont want it to end at 'get'....we want it to check for 'post' and 'delete' also
.post(function(req,res){
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("successfully added new article");
    }else{
      res.send(err);
    }
  });
})  //no semicolon here since we dont want it to end at 'post'....we want it to check for 'delete' also
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("delete successful");
    }else{
      res.send(err);
    }
  });
});  //semicolon here since we want to end the route here........we have checked for all 3....get post and delete



////////////request targeting a single article is below///////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle} , function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);  //return that article with matching title
    }else{
      res.send("No article found with such title");
    }
  });
})//no semicolon......since not the end
.put(function(req,res){  //get post put patch delete.....these were the so called CRUD operations in restAPI
  Article.replaceOne({title:req.params.articleTitle},{title:req.body.title , content:req.body.content}, {overwrite:true}, function(err){  //see replaceOne syntax...1st parameter is for what to replace.....2nd is for what is the replacement content....3rd is for options, here {overwrite:true} is MANDATORY in mongoose.....then we have a call back-function
    if(!err){
      res.send("updated successfully");
    }
  });
})//no semicolon ........since not the end
.patch(function(req,res){
  Article.update({title:req.params.articleTitle}, {$set:req.body}, function(err){  //see syntax....1st parameter is of which thing to replace......2nd parameter is of what to replace it with, here its {$set:req.body} because in patch we can change anything like title or body or both, so it needs to be dynamic, thus we use $set for it.....NO NEED FOR {overwrite:true} IN PATCH
    if(!err){
      res.send("patch successful");
    }else{
      res.send(err);
    }
  });
})//no semicolon ........ since not the end

.delete(function(req, res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    });
});///semicolon AAYA!!!!!!



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
