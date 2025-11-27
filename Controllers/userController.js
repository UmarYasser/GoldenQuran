const {User} = require("./../Models")
const {asyncErHandler} = require('./GlobalErrorHandler.js')
//⭐ You call the index.js model like above,
//⭐ And it discovers all the models and import here what's needed


exports.displayAll = asyncErHandler(async(req,res) =>{
    const users = await User.findAll()
    res.status(200).json({
        status:'success',
        length:users.length,
        data:users
    })
    
    if(!users){
        res.status(500).json({
            status:'error',
            message:`Error`
        })
    }
})

exports.displayById = asyncErHandler(async(req,res) =>{
    const user = await User.findOne({where: {uuid:req.params.uuid}})
    if(!user){
        return res.status(404).json({
            status:'fail',
            message:"No User found with this ID"
        })
    }
    res.status(200).json({
        status:'success',
        data:user
    })

})

exports.createUser = asyncErHandler(async(req,res) =>{
    const {name,age,role,email} = req.body
    try{
        const user = await User.create(req.body)
        return res.status(201).json({
            status:'success',
            data:user
        })
    }catch(err){
        res.status(500).json({
            status:'error',
            message:`Error: ${err}`
        })
    }
})

exports.updateById = asyncErHandler(async(req,res)=>{
    const user = await User.findOne({where:{uuid:req.params.uuid}})
    if(!user){
        return res.status(404).json({
            status:'fail',
            message:'No User was found with this ID'
        })
    }
    const {name,age,role,email} = req.body
    await user.update(req.body)
    // user.name = name
    // user.age = age
    // user.role = role
    // user.email = email
    await user.save()
    await user.save()
    res.status(200).json({
        status:'success',
        data:user        
    })
})

exports.deleteById = asyncErHandler(async(req,res) =>{
    const user = await User.findOne({where:{uuid:req.params.uuid}})
    await user.destroy()
    if(!user){
        return res.status(404).json({
            status:'fail',
            message:'No User was found with this ID'
        })
    }
    res.status(200).json({
        status:'success',
        data:user
    })
})