const router = require('express').Router()
const authCon = require('./../Controllers/authController')

router.route('/login').post(authCon.logIn)
router.route('/signUp').post(authCon.signUp)
router.route('/logout').post(authCon.logout)


module.exports = router