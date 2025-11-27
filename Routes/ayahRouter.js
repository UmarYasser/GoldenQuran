const authCon = require("./../Controllers/authController")
const ayahCon = require("./../Controllers/ayahController")
const router = require('express').Router()

router.route('/createAyah')
    .post(/*authCon.protect,*/ ayahCon.createAyah)
router.route('/getAllAyat').get(ayahCon.getAllAyat)
router.get('/getAyahPage', ayahCon.getAyahPage)
router.delete('/deleteAyah/:surahId/:ayahNumber',ayahCon.deleteAyah)
router.patch('/editAyah/:surahId/:ayahNumber',ayahCon.editAyah)

router.route('/bulkCreate/:surahId').post(ayahCon.bulkCreateAyah)
router.route('/bulkPageAssign/:pageNo').patch(ayahCon.bulkPageAssign)
router.route('/ayahQuiz').get(ayahCon.ayahQuiz)
module.exports = router