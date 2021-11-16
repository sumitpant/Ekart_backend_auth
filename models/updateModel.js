const mongoose = require('mongoose');
const updateSchema = new mongoose.Schema({
 
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

module.exports =mongoose.model('Update',updateSchema,'logins')