var express =require("express");
var app     =express();
var bodyParser=require("body-parser");
var mongoose =require("mongoose");
var methodOverride=require("method-override");


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));


///////        Mongo Db Setup


mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true });
//Schema
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
 
    created:
           { 
               type: Date,
               default:Date.now
            }

});
// Model
var blog=mongoose.model("blog",blogSchema);

// blog.create({
// title:"test",
// image:"https://images.unsplash.com/photo-1564991922793-bc9003473313?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
// body:"hello bhai ye sab randaap hai",




// });



//Routes


app.get("/",function(req,res){
res.redirect("/blogs");
}).listen(8080)

app.get("/blogs",function(req,res){

blog.find({},function(err,allblogs){
if(err){
    console.log(err);
}
else{
    res.render("index",{blogs:allblogs});
}
});
    

});

//// New route

app.get("/blogs/new",function(req,res){
    res.render("new");
    });
    

app.post("/blogs",function(req,res){
//create blog 

blog.create(req.body.blog,function(err,newBlog){
      if(err){
          res.render("/blogs/new")
      } 
      else{
           res.render("show",{blog:newBlog});
      }
});



});

/////Show route
app.get("/blogs/:id", function(req, res){
	blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/");
		} else {
            
			res.render("show", {blog: foundBlog});
		}
	});
});

/////Edit Route

app.get("/blogs/:id/edit",function(req,res){


    blog.findById(req.params.id,function(err,foundBlog){
          if(err){
              res.redirect("/blogs");
          }
          else{

            res.render("edit",{blog:foundBlog});
          }


    });



});


///Update Route
app.put("/blogs/:id",function(req,res){
    
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
     if(err){
         res.redirect("blogs");
     } 
      else{
         res.redirect("/blogs/"+req.params.id);


      }


    });

});


///Delete Route

app.delete("/blogs/:id",function(req,res){

blog.findByIdAndRemove(req.params.id,function(err){
if(err){


    res.redirect("/blogs");
}
else{


    res.redirect("/blogs");
}

});
});