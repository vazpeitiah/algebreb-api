const {Router} = require('express')
const router = Router()

const sheetsController = require('../controllers/sheets.controller')
const {verifyToken} = require('../controllers/verfify.controller')

router.route('/').get(verifyToken, sheetsController.getSheets)
router.route('/byuser/:userId').get(verifyToken, sheetsController.getSheetsByUser)
router.route('/:sheetId').get(verifyToken, sheetsController.getSheet)

router.route('/').post(verifyToken, sheetsController.createSheet)
router.route('/:sheetId').put(verifyToken, sheetsController.updateSheet)
router.route('/:sheetId').delete(verifyToken, sheetsController.deleteSheet)


module.exports = router