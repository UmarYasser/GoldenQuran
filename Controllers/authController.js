const {User} = require("./../Models")
const { asyncErHandler } = require("./../Middlewares/GlobalErrorHandler")
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const util = require('util')
const dotenv =require('dotenv')
dotenv.config({path:'./config.env',quiet:true})

const signToken = (ID) =>{
    return jwt.sign({id:ID},process.env.SECRET_STR)
}

exports.signUp = async(req,res)=>{
    const {email} = req.body
    try{

        if(await User.findOne({where:{email}})){
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
            user,
            token: process.env.NODE_ENV =='development' ? token : 'token?'
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({
            status:'fail',
            message:e.message
        })
    }
}

exports.logIn = asyncErHandler(async(req,res)=>{
    const {email,password} = req.body

    // Don't pass the password as it is, for the one in db is encrypted while this isn't.
    const user = await User.findOne({where:{email/*,password:password*/}})
    //Compare Password with instance method
    if(!user){
        return res.status(404).json({
            status:'fail',
            message:'Incorrect email or password'
        })
    }

    const salt = await bcrypt.genSalt(10)
    let hashed = await bcrypt.hash(password,salt)
    // await User.
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

    res.status(200).json({
        status:'success',
        message:'Logging In Successfully',
        token: process.env.NODE_ENV =='development' ? token : 'token?'
    })
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