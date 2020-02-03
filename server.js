const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

require('./controllers/posts')(app);

require('./data/reddit-db');



app.get('/', (req, res) => res.render('posts-index'))
app.get('/posts/new', (req, res) => res.render('posts-new'))
// app.get('/posts/index', (req, res) => res.render('posts-index'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');