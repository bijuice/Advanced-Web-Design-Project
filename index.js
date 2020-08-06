const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const jsonParser = bodyParser.json();
const fileName = 'hobby.json';
const login = require('./login.js')
const url = require('url');


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

function fetch_all(){
    let rawData = new fs.readFileSync(fileName);
    let data = JSON.parse(rawData);
    return data
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
	response.render('home',{"user":check_loggedin(request),hobby:fetch(request.session.username),message:login.msg(request.session.username)});
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

app.post('/signup', jsonParser, (request, response) => {
    if (login.checkuser(request.body.username)){
        request.flash('message', 'Username already exists');
        response.redirect('/create_ac');
        response.end();
    }
    else{
        data = login.fetch()
        var user = {
                "username":request.body.username,
                "password":login.hashpassword(request.body.password),
                "fname":request.body.fname,
                "lname":request.body.lname
        }
        data.push(user)
        fs.writeFileSync('user.json', JSON.stringify(data, null, 2));

        hobby_data = fetch_all()
        hobby_data[request.body.username] = {}
        hobby_data[request.body.username]["intrest"] = []
        fs.writeFileSync(fileName, JSON.stringify(hobby_data, null, 2));
        response.redirect('/login');
    }
});

app.get('/create_ac', (request, response) => {
    if (request.session.flash){
        var message = request.session.flash["message"]
        request.session.flash["message"] = []
        response.render('create_ac',{"user":check_loggedin(request),"flash":message});
    }
    else {
        response.render('create_ac',{"user":check_loggedin(request)});
        }
});


app.get('/edit_ac', (request, response) => {
    if (loggedin(request, response)){
        if (request.session.flash){
            var message = request.session.flash["message"]
            request.session.flash["message"] = []
            response.render('edit_ac',{"user":check_loggedin(request),"flash":message,"info":login.user_dets(request.session.username)});
        }
        else {
            response.render('edit_ac',{"user":check_loggedin(request),"info":login.user_dets(request.session.username)});
            }
    }
});

app.get('/edit', (request, response) => {
    response.render('edit_hby',{"user":check_loggedin(request)});
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
    var password = request.body.password;
    var found = false;
	if (username && password) {
        var users = login.fetch()
        users.forEach(element => {
            if (username == element.username && login.checkhash(password,element.password)) {
                request.session.loggedin = true;
                request.session.username = username;
                found = true;
            }            
        });
        if (found){
            response.redirect('/');
            response.end();                	
        }
        else{
            request.flash('message', 'Incorrect Username and/or Password!');
            response.redirect('/login');
            response.end();
        }
    } 
    else {
        request.flash('message', 'Incorrect Username and/or Password!');
		response.redirect('/login');
		response.end();
	}
});

app.post('/addhobyy', jsonParser, (request, response) => {
    data = fetch_all()
    var hby = {
        "id":data[request.session.username]["intrest"].length+1,     
        "name":request.body.name,          
        "note":request.body.note,
        "color": request.body.color,
        "info":[]
    }
    data[request.session.username]["intrest"].push(hby)
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.redirect('/');
    response.end();
});

app.post('/edithobby', jsonParser, (request, response) => {
    data = fetch_all()
    data[request.session.username]["intrest"].forEach(hby => {
        if (hby.id == request.body.id){
            hby.name = request.body.name;
            hby.note = request.body.note;
            hby.color = request.body.color;
        }
    })
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.redirect('/');
    response.end();
});

app.get('/delete', jsonParser, (request, response) => {
    var q = url.parse(request.originalUrl, true);
    var qdata = q.query;
    data = fetch(request.session.username)
    data["intrest"].forEach(function(hby,index,Object){
        if (hby.id == qdata.id){
            Object.splice(index,1);
        }
    })
    data["intrest"].forEach( function(hoby,index,Object){
        hoby.id = index+1;
    });
    overall_data = fetch_all()
    overall_data[request.session.username] = data;
    fs.writeFileSync(fileName, JSON.stringify(overall_data, null, 2));
    response.redirect('/');
    response.end();
});

function check_date(date,hbyid,username){
    data = fetch_all()
    var found = false;
    data[username]["intrest"].forEach(hby => {
        if (hby.id == hbyid){
            hby.info.forEach( date_array => {
                if (date_array.date == date){
                    found = true;
                }
            });
        }
    });
    return found;
}

app.post('/add_date', jsonParser, (request, response) => {
    if (check_date(request.body.date,request.body.id,request.session.username)){
        response.status(400).send({
            message: 'That Date already exists'
         });
    }
    else{
        data = fetch_all()
        data[request.session.username]["intrest"].forEach(hby => {
            if (hby.id == request.body.id){
                hby.info.push({
                    "date": request.body.date,
                    "actual": parseInt(request.body.actual),
                    "expected": parseInt(request.body.expected)
                });
            }
        })
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
        response.redirect('/');
    }
});

app.post('/edit_date_actual', jsonParser, (request, response) => {
    data = fetch_all()
    data[request.session.username]["intrest"].forEach(hby => {
        if (hby.id == request.body.id){
            hby.info.forEach( date_array => {
                if (date_array.date == request.body.date){
                    date_array.actual = parseInt(request.body.final);
                }
            }); 
        }
    })
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.send("Done!");
});

app.post('/edit_date_expected', jsonParser, (request, response) => {
    data = fetch_all()
    data[request.session.username]["intrest"].forEach(hby => {
        if (hby.id == request.body.id){
            hby.info.forEach( date_array => {
                if (date_array.date == request.body.date){
                    date_array.expected = parseInt(request.body.expected);
                }
            }); 
        }
    })
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.send("Done!");
});

app.get('/get_array', (request, response) => {
    var q = url.parse(request.originalUrl, true);
    var qdata = q.query;
    var data = fetch(request.session.username);
    var output = [];
    data["intrest"].forEach(hby => {
        if (hby.id == qdata.id){
            hby.info.forEach( dt => {
                output.push([dt.date,dt.actual,dt.expected])
            })
        }
    })
    response.send(output);
    response.end();
});

app.get('/get_cal', (request, response) => {
    var q = url.parse(request.originalUrl, true);
    var qdata = q.query;
    var data = fetch(request.session.username);
    var output = {};
    data["intrest"].forEach(hby => {
        if (hby.id == qdata.id){
            hby.info.forEach( dt => {
                var date = new Date(dt.date);
                var day = date.getDate();
                var month = date.getMonth()+1;
                var year = date.getFullYear()
                if (!(year in output) && !(month in output)){
                    output[year] = {};
                    output[year][month] = {};
                }
                else if ((year in output) && !(month in output[year])){
                    output[year][month] = {};
                }              
                output[year][month][day] = ["Expected: "+dt.expected+" minutes","Actual: "+dt.actual+" minutes"]
            })
        }
    })
    response.send(output);
    response.end();
});

app.post('/edit_ac_password', (request, response) => {

    var password = request.body.password;
    var found = false;
    var users = login.fetch()
    users.forEach(element => {
        if (request.session.username == element.username && login.checkhash(password,element.password)) {
                element.password = login.hashpassword(request.body.npassword);
                found = true;
            }            
        });
    fs.writeFileSync('user.json', JSON.stringify(users, null, 2));
    if (found){
        request.flash('message', 'Settings changed');
        response.redirect('/edit_ac');
        response.end();                	
    }
    else{
        request.flash('message', 'Incorrect Password!, please try again');
        response.redirect('/edit_ac');
        response.end();
    }
});

app.post('/edit_ac_dets', (request, response) => {
    var found = false;
    var users = login.fetch()
    users.forEach(element => {
        if (request.session.username == element.username) {
                element.fname = request.body.fname;
                element.lname = request.body.lname;
                found = true;
            }            
        });
    fs.writeFileSync('user.json', JSON.stringify(users, null, 2));
    if (found){
        request.flash('message', 'Settings changed');
        response.redirect('/edit_ac');
        response.end();                	
    }
    else{
        request.flash('message', 'Incorrect Password!, please try again');
        response.redirect('/edit_ac');
        response.end();
    }

});


app.listen(port);
console.log('server listening on port 3000');
console.log('http://localhost:3000/');