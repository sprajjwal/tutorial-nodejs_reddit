const Comment = require('../models/comment')
const Post = require('../models/post')

module.exports = function(app) {

  app.post("/posts/:postId/comments", function(req, res) {
      // INSTANTIATE INSTANCE OF MODEL
    if (req.user) {
      const comment = new Comment(req.body);
      comment.author = req.user._id;
      // SAVE INSTANCE OF Comment MODEL TO DB
      comment
        .save()
        .then(comment => {
            // REDIRECT TO THE ROOT
            return Promise.all([
              Post.findById(req.params.postId)
            ]);
        })
        .then(([post, user]) => {
            post.comments.unshift(comment);
            return Promise.all([
              post.save()
            ]);
        })
        .then(post => {
            res.redirect(`/posts/${req.params.postId}`);
        })
        .catch(err => {
            console.log(err);
        });
    } else {
      res.redirect('/login')
    }
  });
};