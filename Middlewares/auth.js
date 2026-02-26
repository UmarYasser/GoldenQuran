const util = require('util')
const jwt = require('jsonwebtoken')
const {User} = require('../Models')
const {asyncErHandler} = require("./GlobalErrorHandler")

exports.protect = asyncErHandler(async(req,res,next)=>{
    const token = req.cookies.jwt
    
    if(!token){
        return res.status(401).json({
            status:'fail',
            message:"Invaild Token"
        })
    }
    const decodedToken = await util.promisify(jwt.verify)(token,process.env.SECRET_STR)
    const user = await User.findOne({where:{uuid:decodedToken.id},
        attributes:{exclude:['password']}, raw:true})
    
    if(!user){
        return res.status(401).json({
            status:'fail',
            message:'User not found'
        })
    }

    req.user = user
    next()
})