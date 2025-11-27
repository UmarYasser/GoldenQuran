const {User} = require("./../Models")
const { asyncErHandler } = require("./GlobalErrorHandler")
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const util = require('util')

const signToken = (ID) =>{
    return jwt.sign({id:ID},process.env.SECRET_STR)
}

exports.signUp = asyncErHandler(async(req,res)=>{
    const {email,password} = req.body
    
    
    
    
    if(await User.findOne({where:{email:email}})){
        console.log('Duplicate Email')
        return res.status(400).json({
            status:'fail',
            message:"This email is already taken"
        })
    }
    
    const user = await User.create(req.body)
    const token = signToken(user.uuid)

    const cookieOptions = {
        httpOnly:true,
        sameSite:'strict',
        secure: true,
        maxAge: 24*60*60*1000
    }
    res.cookie('jwt',token,cookieOptions)

    res.status(200).json({
        status:'success',
        user
    })
})

exports.logIn = asyncErHandler(async(req,res)=>{
    const {email,password} = req.body
    const user = await User.findOne({where:{email:email}, logging:console.log})
    console.log(user)
    //Compare Password with instance method
    if(!user){
        return res.status(404).json({
            status:'fail',
            message:'No user with email was found'
        })
    }
    
    const isMatch = await user.comparePassword(password,user.password)
    if(!isMatch){
        return res.status(401).json({
            status:'fail',
            message:'Incorrect email or password'
        })
    }

    const cookieOptions = {
        httpOnly:true,
        sameSite:'strict',
        secure:process.env.NODE_ENV === 'production',
        maxAge:24*60*60*1000
    }

    let data = user
    if(process.env.NODE_ENV == 'production')
        data = 'Welcome New User👌'
    const token = signToken(user.uuid)
    res.cookie('jwt',token,cookieOptions)

    res.status(201).json({
        status:'success',
        message:'Siginning Up Successfully',
        data
    })
})

exports.protect = asyncErHandler(async(req,res,next)=>{
    const token = req.cookies.jwt
    if(!token){
        return res.status(401).json({
            status:'fail',
            message:"Invaild Token"
        })
    }
    const decodedToken = util.promisify(jwt.verify)(token,process.env.SECRET_STR)

    const user = await User.findOne({where:{uuid:decodedToken._id},
        attributes:{exclude:['password']}})

    if(!user){
        return res.status(401).json({
            status:'fail',
            message:'User not found'
        })
    }

    req.user = user
    next()
})

exports.logout = asyncErHandler(async(req,res)=>{
    res.cookie('jwt','loggoutOut',{
        expires:new Date(Date.now() + 1000)
    })

    res.status(200).json({
        status:'success',
        message:"Loggout Out Successfully"
    })
})