// test/posts.js
const app = require("./../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const agent = chai.request.agent(app);
const User = require("../models/user")
// Import the Post model from our models folder so we
// we can use it in our tests.
const Post = require('../models/post');
// const server = require('../server');

chai.should();
chai.use(chaiHttp);

describe('Posts', function() {
  // const agent = chai.request.agent(server);
  // Post that we'll use for testing purposes
  const newPost = {
      title: 'post title',
      url: 'https://www.google.com',
      summary: 'post summary',
      subreddit: 'try'
  };
  const user = {
    username: 'poststest',
    password: 'testposts'
  };

  it("shouldn't create a post without auth", function(done) {
    Post.estimatedDocumentCount()
      .then(function(initialDocCount) {
        agent
          .post("/post/new")
          .set("content-type", "application/x-www-form-urlencoded")
          .send(newPost)
          .then(function(res) {
            Post.estimatedDocumentCount()
              .then(function(newDocCount) {
                expect(res).to.have.status(401);
                expect(newDocCount).to.be.equal(initialDocCount)
                done();
              })
              .catch(function(err) {
                console.log(err)
                done();
              })
          })
          .catch(function(err) {
            console.log(err)
            done();
          })
      })
      .catch(function(err) {
        console.log(err)
        done();
      })
  })
  
  before(function (done) {
    agent
      .post('/sign-up')
      .set("content-type", "application/x-www-form-urlencoded")
      .send(user)
      .then(function (res) {
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });
  it("should create with valid attributes at POST /post/new", function (done) {
    // Checks how many posts there are now
    Post.estimatedDocumentCount()
    .then(function (initialDocCount) {
        agent
          .post("/post/new")
          // This line fakes a form post,
          // since we're not actually filling out a form
          .set("content-type", "application/x-www-form-urlencoded")
          // Make a request to create another
          .send(newPost)
          .then(function (res) {
            Post.estimatedDocumentCount()
              .then(function (newDocCount) {
                  // Check that the database has one more post in it
                expect(res).to.have.status(200);
                // Check that the database has one more post in it
                expect(newDocCount).to.be.equal(initialDocCount + 1)
                done();
              })
              .catch(function (err) {
                done(err);
              });
          })
          .catch(function (err) {
            done(err);
          });
    })
    .catch(function (err) {
      done(err);
    });
  });


  
  after(function (done) {
    Post.findOneAndDelete(newPost)
    .then(function (res) {
      agent.close()

      User.findOneAndDelete({
        username: user.username
      })
      .then(function (res) {
        done()
      })
      .catch(function (err) {
        done(err);
      });
    })
    .catch(function (err) {
      done(err);
    });
  });
});