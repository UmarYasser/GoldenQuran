const {User,Post} = require('./../Models')
const {asyncErHandler} = require('./GlobalErrorHandler.js')

exports.readAllPosts = asyncErHandler(async(req,res)=>{
    const posts = await Post.findAll({include:User})

    res.status(200).json({
        status:'success',
        length:posts.length,
        data:posts
    })
})

exports.readPost = asyncErHandler(async(req,res)=>{
    const postUuid = req.params.uuid
    const post = await Post.findOne({where:{uuid:postUuid}})

    if(!post){
        return res.status(404).json({
            status:'fail',
            message:"Can't find Post"
        })
    }

    res.status(200).json({
        status:'success',
        data:{
            caption:post.caption,
            body:post.body
        }
    })
})

exports.readUserPosts = asyncErHandler(async(req,res) =>{
    const {userUuid,postUuid} = req.body
    const user = await User.findOne({where:{uuid:userUuid}})
    const posts = await Post.findAll({where:{userId:user.id}})

    res.status(200).json({
        status:'success',
        length:posts.length,
        data:posts
    })
})

exports.addPost = asyncErHandler(async(req,res)=>{
  //Should take the userId after a protect middleware to get/authenticate the current user
  const {userUuid, body,caption} = req.body
  
  const user = await User.findOne({where:{uuid:userUuid}})
  const post = await Post.create({caption:caption,body:body, userId:user.id })
  res.status(201).json({
    status:'success',
    data:post
  })
})

exports.updatePostById = asyncErHandler(async(req,res) =>{
    const uuid = req.params.uuid
    const post = await Post.findOne({where:{uuid:uuid}})
    if(!post){
        res.status(404).json({
            status:'fail',
            message:"No post was found with this ID"
        })
    }
    await post.update(req.body)
    res.status(200).json({
        status:'success',
        data:post
    })
})

