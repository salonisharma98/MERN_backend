const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../jwt/keys")
const mongoose=require('mongoose');
const User = mongoose.model('User');

module.exports=(req,res,next)=>{
    
    const{authorization}=req.headers
    console.log(authorization)
    if(!authorization){
       return res.status(401).json({error:"user must be logged in"})
    }
   const token= authorization.replace("Bearer ","")
   jwt.verify(token,JWT_SECRET,(err,payload)=>{ 
       if(err){
           return res.status(401).json({error:"you must be logged in"})
       }
       else{
       const {_id}=payload
       User.findById(_id).then(userdata=>{
           req.User=userdata
           next();
       })
    }
       
   })
}