const surahCon = require("./../Controllers/surahController")
const authCon = require('./../Controllers/authController')
const router = require("express").Router()

router.route('/createSurah').post(surahCon.createSurah)
router.route('/bulkCreateSurah').post(surahCon.bulkCreateSurah)

router.route('/getSurah/:id').get(surahCon.getSurah)
router.route('/getAllSurahs').get(surahCon.getAllSurahs)

router.route('/editSurah/:id').patch(surahCon.editSurah)
router.route('/deleteSurah/:id').delete(surahCon.deleteSurah)

module.exports = router