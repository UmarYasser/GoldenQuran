const router = require("express").Router()
const trackerCon = require("../Controllers/trackerController")
const authCon = require("../Controllers/authController")

router.post('/createTracker',authCon.protect,trackerCon.createTracker)

router.get('/getTracker',authCon.protect,trackerCon.getTracker)
router.get('/getuserTrackers',authCon.protect,trackerCon.getUserTrackers)

router.post('/beaconEditTracker',authCon.protect,trackerCon.editTracker) // This is the route that will be called from the frontend when the user closes the session, it will update the screen time and pages read for that day
router.patch('/editTracker',authCon.protect,trackerCon.editTracker)

router.delete('/deleteTracker',authCon.protect,trackerCon.deleteTracker)

module.exports = router