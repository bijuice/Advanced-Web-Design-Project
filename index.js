const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const fileName = 'hobby.json';
const login = require('./login.js')

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

// Load data from file
function fetch(){
    let rawData = new fs.readFileSync(fileName);
    let data = JSON.parse(rawData);
    console.log(data)
    return data
}

let data = fetch()

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));


app.get('/', (request, response) => {
    console.log(data)
    response.render('home',fetch());
});

app.get('/landing', (request, response) => {
    response.render('landing');
});

app.get('/login', (request, response) => {
    login.login()
    response.render('login');
});

app.get('/create_ac', (request, response) => {
    response.render('create_ac');
});

app.get('/edit_ac', (request, response) => {
    response.render('edit_ac');
});

app.get('/edit?hobby_id', (request, response) => {
    response.render('edit_hby');
});

// This is a RESTful GET web service
app.get('/students', (request, response) => {
    data.sort((a, b) => (a.name > b.name) ? 1 : -1 );
    response.send(data);
});

// This is a RESTful POST web service
app.post('/students', jsonParser, (request, response) => {
    data.push(request.body);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.end();
});

app.listen(port);
console.log('server listening on port 3000');
console.log('http://localhost:3000/');