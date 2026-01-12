const router = require("express").Router()
const trackerCon = require("../Controllers/trackerController")
const authCon = require("../Controllers/authController")

router.post('/createTracker',authCon.protect,trackerCon.createTracker)

router.get('/getTracker',authCon.protect,trackerCon.getTracker)
router.get('/getuserTrackers',authCon.protect,trackerCon.getUserTrackers)

router.patch('/editTracker',authCon.protect,trackerCon.editTracker)

router.delete('/deleteTracker',authCon.protect,trackerCon.deleteTracker)

module.exports = router