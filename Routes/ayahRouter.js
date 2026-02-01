const authCon = require("./../Controllers/authController")
const ayahCon = require("./../Controllers/ayahController")
const router = require('express').Router()

router.post('/createAyah',ayahCon.createAyah)
router.post('/bulkCreate/:surahId',ayahCon.bulkCreateAyah)

router.get('/getAllAyat',ayahCon.getAllAyat)
router.get('/getAyahPage', ayahCon.getAyahPage)
router.get('/liveSearch',ayahCon.searchAyah)
router.get('/ayahQuiz',ayahCon.ayahQuiz)

// router.patch('/bulkPageAssign/:pageNo',ayahCon.bulkPageAssign)
router.patch('/bulkPageAssign',ayahCon.bulkPageAssign)
router.patch('/editAyah/:surahId/:ayahNumber',ayahCon.editAyah)

router.delete('/deleteAyah/:surahId/:ayahNumber',ayahCon.deleteAyah)
module.exports = router