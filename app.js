var express    = require("express"),
     app        = express(),
     mongoose   = require("mongoose"),
     bodyParser = require("body-parser"),
     sanitizer  =require("express-sanitizer"), 
     methodOverride = require("method-override");
     
     app.use(express.static("public"));
     app.use(bodyParser.urlencoded({extended:true}));
     app.use(sanitizer());
     app.set("view engine","ejs");
     mongoose.connect("mongodb://localhost:27017/blogsdb" ,{ useNewUrlParser: true });
     app.use(methodOverride("_method"));
     
     var blogSchema = mongoose.Schema({
         title: String,
         image: String,
         description:String,
         created:{type:Date, default:Date.now}
         
     });
     
     var Blog = mongoose.model("Blog", blogSchema);
   
     app.get("/",function(req , res){
         res.redirect("/blogs");
         
         
     });
     
     app.get("/blogs",function(req, res){
         
         Blog.find({},function(err, blogs){
             if(err){
                 console.log("Ooops!!!!!!!!");
                 console.log(err);
             }
             else{
                 
                 res.render("index", {blogs:blogs});
             }
         });
         
         
     });
     
     app.get("/blogs/new",function(req, res){
          
        res.render("new");
      
     });
     
     app.post("/blogs",function(req, res){
      req.body.blog.description = req.sanitize( req.body.blog.description);
      var newblog = req.body.blog;
      Blog.create(newblog,function(err, blog){
       if(err){
        console.log("oops...error");
        console.log(err);
        res.redirect("/blogs/new");
       }
       else{
        console.log("We successfully added your blog!");
        console.log(blog);
        res.redirect("/blogs");
        
       }
      });
      
     });
     
     app.get("/blogs/:id",function(req, res){
         Blog.findById(req.params.id, function(err, blog){
          if(err){
           console.log(err);
           res.redirect("/blogs");
          
           
          }
          else{
           res.render("show",{blog: blog});
           
          }
     });
     });
     
     app.get("/blogs/:id/edit", function(req, res){
      Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
        console.log(err);
        res.redirect("/blogs");
       }
       else{
           res.render("edit", {blog : foundBlog});
       }
       
      });
      
     });
     
     app.put("/blogs/:id", function(req, res){
       req.body.blog.description = req.sanitize( req.body.blog.description);  
      Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
        console.log(err);
        res.redirect("/blogs");
       }
       else{
         res.redirect("/blogs/"+ req.params.id);
       }
       
      });
     });
     
     app.delete("/blogs/:id", function(req, res){
      Blog.findByIdAndDelete(req.params.id, function(err){
       if(err){
        console.log(err);
        res.redirect("/blogs");
       }
       else{
         res.redirect("/blogs");
       }
      });
     } );
     
     
     app.listen(process.env.PORT, process.env.ID, function(){
        console.log("Blog app server has started...."); 
     });
     
