const Post = require('../models/post');
const User = require('../models/user')


module.exports = app => {
  // CREATE
  app.post("/post/new", (req, res) => {
    if (req.user) {
      console.log(req.user)
      const post = new Post(req.body);
      post.author = req.user._id;
      post
        .save()
        .then(post => {
          return User.findById(req.user._id)
        })
        .then(user => {
          user.posts.unshift(post);
          user.save();
          res.redirect(`/posts/${post._id}`)
        })
        .catch(err => {
          console.log(err.message)
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  app.get("/", (req, res) => {
    const currentUser = req.user;
    console.log(req.cookies);
    Post.find({}).populate('author')
    .then(posts => {
        res.render("posts-index", {posts, currentUser});
    })
    .catch(err => {
        console.log('error', err.message);
    });
  });

  app.get("/posts/:id", function(req, res) {
    // LOOK UP THE POST
    Post.findById(req.params.id).populate('comments')
      .then(post => {
        res.render("posts-show", { post });
      })
      .catch(err => {
        console.log(err.message);
      });
    });
  app.get("/n/:subreddit", function(req, res) {
    const currentUser = req.user
    Post.find({ subreddit: req.params.subreddit }).lean()
    .then(posts => {
      res.render("posts-index", { posts, currentUser });
    })
    .catch(err => {
      console.log(err);
    });
  });
};