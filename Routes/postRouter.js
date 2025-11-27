const router = require('express').Router()
const postCon= require("./../Controllers/postController")

router.route('/readPost/:uuid').get(postCon.readPost)
router.route('/readAllPosts').get(postCon.readAllPosts)
router.route('/readUserPosts').get(postCon.readUserPosts)
router.route('/createPost').post(postCon.addPost)
router.route('/updatePostById/:uuid').patch(postCon.updatePostById)

module.exports = router