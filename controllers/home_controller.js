const Post = require("../models/Post");

const homeView = (req, res) => {

    res.render("home", {pageName: "home"});
}

const postView = (req, res) => {

    const postId = req.params.postId;

    Post.findById(postId, (err, foundPost) => {
        if(err) {
            console.log(err);
        } else {
            if(foundPost) {
                res.render("post", {pageName: "home", post: foundPost});
            }
        }
    })

    
}

module.exports = {
    homeView,
    postView,
}