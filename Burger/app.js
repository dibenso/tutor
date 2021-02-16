require('dotenv').config();
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const burgersController = require('./controllers/burgers_controller')

const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
    layoutsDir: path.join(__dirname, '/views/layouts')
}));
app.use('/', burgersController);
app.listen(port, () => console.log(`App listening on port ${port}`));