const express = require('express')
const app = express()
const port = 3000
require('dotenv').config();
const path = require('path')

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static("public")); // enables supplying static files

// Add after body parser initialization!
app.use(expressValidator());

// enable JWT
app.use(cookieParser());

const checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
      req.user = null;
    } else {
      var token = req.cookies.nToken;
      var decodedToken = jwt.decode(token, { complete: true }) || {};
      req.user = decodedToken.payload;
    }
  
    next();
  };
app.use(checkAuth);

require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);

require('./data/reddit-db');



// app.get('/', (req, res) => res.render('posts-index'))
app.get('/post/new', (req, res) => res.render('posts-new'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



module.exports = app;