const JWT=require('jsonwebtoken');
//const createError=require('http-errors') 6.4k(gzipped:2.6K)
module.exports={
    signAccessToken:(_id)=>{
        return new Promise((resolve,reject)=>{
            
            const options={
                expiresIn:"2h"
            }
            JWT.sign(payload,secret,options,(err,token)=>{
                if(err){
                    return reject(err)
                }
                else{
                    resolve(token)
                }
            })
        })
    }
}