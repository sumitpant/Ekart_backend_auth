const bcrypt = require('bcrypt');
const salt = 10;

const hashPassword = (password) => {
     return bcrypt.hash(password ,salt);
}

const decryptPassword = (password , hashPassword) => {
    return bcrypt.compare(password , hashPassword);
}

module.exports ={
    hashPassword,
    decryptPassword,
}