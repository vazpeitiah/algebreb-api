const sheetsController = {};

const Sheet = require('../models/Sheet')

sheetsController.getSheets = async (req, res) => {
    const sheets = await Sheet.find()
    res.json(sheets)
}

sheetsController.getSheet = async (req, res) => {
    const sheet = await Sheet.findById(req.params.sheetId);
    res.json(sheet);
}

sheetsController.getSheetsByUser = async (req, res) => {
    const sheets = await Sheet.find({user: req.params.userId}).sort({date: -1})
    res.json(sheets)
}

sheetsController.createSheet = async (req, res) => {
    const {description, date, type, user, exercises, params} = req.body

    let body = {
        description,
        date,
        type,
        user,
        solutionsType: 'oculta',
        hidden: false
    }

    if(exercises  && params) {
        body = {...body, exercises, params, date: Date.now(), hidden: true}
    }

    const sheet = await Sheet.create(new Sheet(body));
    res.json(sheet)
}

sheetsController.updateSheet = async (req, res) => {
    const {description, type, exercises, solutionsType, params} = req.body;

    const updSheet = {
        description,
        date: Date.now(),
        type,
        solutionsType,
        params
    }

    const sheet = await Sheet.findByIdAndUpdate(req.params.sheetId, updSheet, {new: true});
    sheet.exercises = exercises;
    sheet.markModified('exercises')
    sheet.save()
    res.json(sheet)
}

sheetsController.deleteSheet = async (req, res) => {
    await Sheet.findByIdAndDelete(req.params.sheetId);
    res.json({message: "Sheet deleted"});
}

module.exports = sheetsController;