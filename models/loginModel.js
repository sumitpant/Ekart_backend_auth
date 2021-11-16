const mongoose = require('mongoose');
const loginSchema = new mongoose.Schema({
    userid:{
        type:String,
        required : [true , 'Must Provide userId'],
        trim : true,
        maxLength:[20]
    },
    password:{
        type:String,
        required:[true , 'Password cannot be empty'],
        minLength:[8 , 'Password must be atleast 8 characters']
    },
    refreshToken:{
        type:String,  
    },


})

module.exports =mongoose.model('Login',loginSchema, 'logins')