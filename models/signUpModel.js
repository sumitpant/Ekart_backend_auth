const mongoose = require('mongoose');
const signupSchema = new mongoose.Schema({
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
    name :{
        type:String,
        required:[true,'Name must not be empty']
    },
    mobile:{
        type:Number,
        required:[true,'Mobile number must be present']
        
    },
    email:{
        type:String,
        required:[true,'Must Provide Email'],
        unique: true
    }

})

module.exports =mongoose.model('SignUp',signupSchema,'logins')