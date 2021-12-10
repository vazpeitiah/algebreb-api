const {Router} = require('express')
const router = Router()

const sheetsController = require('../controllers/sheets.controller')
const {verifyToken} = require('../controllers/verfify.controller')

router.get('/byuser/:userId', verifyToken, sheetsController.getSheetsByUser)
router.get('/', verifyToken, sheetsController.getSheets)
router.post('/', verifyToken, sheetsController.createSheet)
router.get('/:sheetId', verifyToken, sheetsController.getSheet)
router.put('/:sheetId', verifyToken, sheetsController.updateSheet)
router.delete('/:sheetId', verifyToken, sheetsController.deleteSheet)

module.exports = router