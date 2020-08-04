const fs = require('fs');
const passwordHash = require('password-hash');

module.exports = {
    hashpassword: function(password){
        return passwordHash.generate(password);
    },
    checkhash: function(password,hashedPassword){
        return passwordHash.verify(password, hashedPassword);
    },
    fetch: function (){
        let rawData = new fs.readFileSync('user.json');
        let data = JSON.parse(rawData);
        return data;
    },
    msg: function (username){
        let rawData = new fs.readFileSync('user.json');
        let data = JSON.parse(rawData);
        var stirng = "";
        data.forEach(user =>{
            if (user.username == username){
                string = "Welcome "+user.fname+" "+user.lname;
            }
        });
        return string
    },
    checkuser: function (username){
        let rawData = new fs.readFileSync('user.json');
        let data = JSON.parse(rawData);
        var found = false;
        data.forEach(user =>{
            if (user.username == username){
                found = true;
            }
        });
        return found;
    }
}