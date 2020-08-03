const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
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

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use(flash());

// Load data from file
function fetch(username){
    let rawData = new fs.readFileSync(fileName);
    let data = JSON.parse(rawData);
    return data[username]
}

function check_loggedin(request) {
    if (!request.session.loggedin){
        return false
    }
    else {
        return true
    }
}

function loggedin(request, response) {
    if (!request.session.loggedin){
        response.redirect('/landing');
        return false
    }
    else {
        return true
    }
}

app.get('/', (request, response) => {
    if (loggedin(request, response))
	response.render('home',{"user":check_loggedin(request),hobby:fetch(request.session.username)});
});

app.get('/landing', (request, response) => {
    response.render('landing',{"user":check_loggedin(request)});
});

app.get('/login', (request, response) => {
    if (request.session.flash){
        var message = request.session.flash["message"]
        request.session.flash["message"] = []
        response.render('login',{"user":check_loggedin(request),"flash":message});
    }
    else {
            response.render('login',{"user":check_loggedin(request)});
        }    
});

app.get('/logout', (request, response) => {
    request.session.loggedin = false;
    request.session.username = null;
    response.redirect('/');
});

app.get('/create_ac', (request, response) => {
    response.render('create_ac',{"user":check_loggedin(request)});
});

app.get('/edit_ac', (request, response) => {
    if (loggedin(request, response))
    response.render('edit_ac',{"user":check_loggedin(request)});
});

app.get('/edit?hobby_id', (request, response) => {
    response.render('edit_hby',{"user":check_loggedin(request)});
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
    var password = request.body.password;
	if (username && password) {
        var users = login.fetch()
        users.forEach(element => {
            if (username == element.username && login.checkhash(password,element.password)) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/');
            } else {
                request.flash('message', 'Incorrect Username and/or Password!');
                response.redirect('/login');
            }			
            response.end()            
        });
    } 
    else {
        request.flash('message', 'Incorrect Username and/or Password!');
		response.redirect('/login');
		response.end();
	}
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