const router = require('express').Router()
const Tafseer = require('./../Controllers/tafseerController')

router.route('/createTafseer/:sa').post(Tafseer.createTafseer)
router.route('/getTafseer/:sa').get(Tafseer.getTafseer)
router.route('/updateTafseer/:sa').patch(Tafseer.updateTafseer)
router.route('/deleteTafseer/:sa').delete(Tafseer.deleteTafseer)

router.route('/bulkCreate/:surahId/:ayahRange').post(Tafseer.bulkCreateTafseer)

module.exports = router