const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Add after body parser initialization!
app.use(expressValidator());

require('./controllers/posts')(app);

require('./data/reddit-db');



// app.get('/', (req, res) => res.render('posts-index'))
app.get('/post/new', (req, res) => res.render('posts-new'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



module.exports = app;