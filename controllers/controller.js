const { hashPassword, decryptPassword } = require('../hash/password');
const jwt = require('jsonwebtoken');
const axios =require('axios');
const Login = require('../models/loginModel');
const Signup = require('../models/signupModel');
const Update = require('../models/updateModel');
const asyncWrapper = require('../middlewares/async');
const { generatetoken ,verify } = require('./tokens')
const { createCustomError } = require('../custom-error/customErr')
require('dotenv').config();
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * This method handles login functionality, verify the required fields and generate JWT token;
 */
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN;
const exp = Math.floor(Date.now() / 1000 + (60*60));
const expRefresh =  Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);
const REGEX_EMAIL =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



const login = asyncWrapper(async (req, res, next) => {
    const { userid, password } = req.body;
    let user = await Login.findOne({ userid: userid }).exec();
    if (user !== null) {
        let compare = await decryptPassword(password, user.password);
        if (compare) {
            const accessToken = generatetoken(userid , exp ,SECRET_KEY);                    
            const refreshToken = generatetoken(userid , expRefresh,REFRESH_TOKEN_KEY)
            const body = {
                userid,
                password: user.password,
                refreshToken: refreshToken,
            }
            const data = await Login.findOneAndUpdate({ userid },
                body, {
                new: true,
                runValidators: true
            });
            if (!data) {
                return next(createCustomError(`Some error Occured `,404))
            }
    
            delete data._doc.refreshToken;
            delete data._doc.password;
            const userbody ={ 
            ...data._doc
            }
            
            

            return res.status(200).json({ msg: 'success', accessToken, refreshToken ,userbody});
        }
        else {
            return next(createCustomError(`Wrong Password `,401))
    
        }

    }
    else {
        return next(createCustomError(`No user with ${userid} `,404))

    }

})

/**
 * @param {*}req
 * @param {*}res
 * This method handles signup , encrypt password and save it in db;
 */

const signup = asyncWrapper(async(req, res, next) => {

    const {userid , name , mobile ,email ,password} = req.body;

    if(REGEX_EMAIL.test(email.toLowerCase())) {
        const user = await Login.find({email}).exec();
        const userId = await Login.find({ userid}).exec();
        if(user !== null && userId !== null) {
            const hashedpassword= await hashPassword(password);
            const body ={
                ...req.body,
                password:hashedpassword
            }
            await Signup.create(body);
           res.status(200).json({msg:'success'});
        }
        else if( user !== null ){
            return next(createCustomError(` ${userid} already exists`,404));
            

        }
        else{
             return next(createCustomError(` ${userid} already exist `,404))
        }
    }
    else{
         return next(createCustomError(`Email not valid `,404))
    }
})

/*
* Update details function
*/
const updateDetails = async(req,res,next)=>{
    const authHeader =req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
       return next(createCustomError("No Token", 401));
    }
    else{
       const isVerfied = await jwt.verify(token,SECRET_KEY);
       if(isVerfied){
          let details= await Update.findOneAndUpdate({userid:isVerfied.userid},
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            )
            return res.status(400).json({msg: `User details updated with ${details}`})

       }
       else{
         return next(createCustomError("Not Authenticated",403));
       }

    }
                 
}

const refresh =asyncWrapper(async(req,res ,next)=>{
     const ref_token = req.body.refreshToken;
     const rfToken = await Login.findOne({refreshToken: ref_token}).exec();
    
      
     if(!ref_token && rfToken!== ref_token){
         return next(createCustomError("User not authenticated",403));

     }
     else{
        console.log("hbjklklkkbnj")
         console.log(ref_token)
          let token = await jwt.verify(ref_token, REFRESH_TOKEN_KEY);
         
          console.log(token)
          if(token){
              const accessToken =generatetoken(token.userid,exp,SECRET_KEY);
             return  res.status(200).json({accessToken});
          }

       return next(createCustomError("User not authenticated",403));
     }

})

const verifyToken =asyncWrapper((req,res ,next)=>{
    
     const token =req.body.token;
      const isVerfied = verify(token ,SECRET_KEY);
      if(isVerfied){
          return res.status(200).send({msg:"Verified" ,user: isVerfied.userid});
      }
      else {
         return res.status(401).send({msg:"User not authenticated"});
      
      }


})

module.exports = {
    login,
    signup,
    updateDetails,
    refresh,
    verifyToken
}