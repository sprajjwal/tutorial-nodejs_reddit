const Post = require('../models/post');

module.exports = app => {
  // CREATE
    app.post("/posts/new", (req, res) => {
        const post = new Post(req.body);

        post.save((err, post) => {
            return res.redirect(`/`);
        })
    });

    app.get("/posts/index", (req, res) => {
        console.log('in here')
        Post.find({})
        .then(posts => {
            res.render("posts-index", {posts});
        })
        .catch(err => {
            console.log(err.message);
        });
    })
};