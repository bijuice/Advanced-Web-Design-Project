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
    user_dets: function (username){
        let rawData = new fs.readFileSync('user.json');
        let data = JSON.parse(rawData);
        var user_info = {};
        data.forEach(user =>{
            if (user.username == username){
                user_info["fname"] = user.fname;
                user_info["lname"] = user.lname;
            }
        });
        return user_info
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