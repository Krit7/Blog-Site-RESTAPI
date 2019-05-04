var express = require('express');
var app = express();
app.use(express.static("public"));

//For Overriding Methods
methodOverride = require('method-override');
app.use(methodOverride("_method"));

//For Getting Inputs from HTML Body
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({
    extended: true
}));

var mongoose = require('mongoose');

//DATABASE SETUP,MODEL AND SCHEMA
mongoose.connect("mongodb://localhost/BlogApp");
var BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});
var Blog = mongoose.model("Blog", BlogSchema);

//ROUTES

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTE 
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, Blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index.ejs", {
                Blogs: Blogs
            });
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new.ejs");
});

//CREATE ROUTE
app.post("/blogs", function(req, res) {
    var title = req.body.title;
    var image = req.body.image;
    var body = req.body.body;
    var obj = {
        title,
        image,
        body
    };
    Blog.create(obj, function(err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, FoundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show.ejs", {
                FoundBlog: FoundBlog
            });
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, FoundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs", {
                FoundBlog: FoundBlog
            });
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
    //findByIdAndUpdate(id,newData,callback)
    Blog.findByIdAndUpdate(req.params.id, req.body.Blog, function(err, UpdatedBlog) {
        if (err) {
            res.redirect("/blogs/UpdatedBlog._id");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
    //findByIdAndRemove(id,callback)
    Blog.findByIdAndRemove(req.params.id, function(err, DeletedBlog) {
        if (err) {
            res.redirect("/blogs/DeletedBlog._id");
        } else {
            res.redirect("/");
        }
    });
});


app.listen(3000, function(req, res) {
    console.log("Server Has Started..!!!");
});