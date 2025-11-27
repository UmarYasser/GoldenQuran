const router = require('express').Router();
const userCon = require('./../Controllers/userController')


router.route('/displayAll').get(/*authCon.protect,*/userCon.displayAll)
router.route('/displayById/:uuid').get(/*authCon.protect,*/userCon.displayById)
router.route('/createUser').post(/*authCon.protect,*/userCon.createUser)
router.route('/updateById/:uuid').patch(userCon.updateById)
router.route("/deleteById/:uuid").delete(userCon.deleteById)

module.exports = router