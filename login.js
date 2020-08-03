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
        return data
    }
}