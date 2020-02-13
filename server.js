const express = require('express')
const app = express()
const port = 3000
require('dotenv').config();

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

// Add after body parser initialization!
app.use(expressValidator());

// enable JWT
app.use(cookieParser());

require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);


require('./data/reddit-db');



// app.get('/', (req, res) => res.render('posts-index'))
app.get('/post/new', (req, res) => res.render('posts-new'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



module.exports = app;