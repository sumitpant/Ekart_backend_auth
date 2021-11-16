require('dotenv').config();
const express = require('express');
const cors =require('cors');
const app = express();
const path =require('path');
const route =require(path.join(__dirname, 'routes/route'));
const connectDb = require(path.join(__dirname, 'db/connection'));
const errorHandler = require(path.join(__dirname, 'middlewares/error'))

app.use(cors());
app.use(express.json());
app.use(route);

app.use(errorHandler)
const PORT =process.env.PORT || 3030;



const start = async()=>{
   try{
       await connectDb(process.env.MONGO_URI);
       app.listen(PORT,()=>{
           console.log(`server runinng at ${PORT}`)
       });
      
   }
   catch(err){
        console.log(err);
   }
}

start();