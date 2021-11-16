
const jwt =require('jsonwebtoken');
const generatetoken =(userid, exp,secret)=>{

  return  jwt.sign({ userid ,exp:exp },
        secret
    );

}

const verify = (token ,secret) => {
    return jwt.verify(token ,secret)
}

module.exports={
    generatetoken,
    verify
}