const Sheet = require('../models/Sheet')
const Exam = require('../models/Exam')
const ApplyExam = require('../models/ApplyExam')

const sheetsController = {};

sheetsController.getSheets = async (req, res) => {
    try {
        const sheets = await Sheet.find({ hidden:false })
        return res.json({ success: true, sheets })
    } catch (err) {
        return res.json({ success:false, message: err.message })
    }
}

sheetsController.getSheetsByUser = async (req, res) => {
    try {
        const sheets = await Sheet.find({user: req.params.userId, hidden:false}, '-params -exercises -solutionsType -user').sort({date: -1})
        return res.json({ success: true, sheets})
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

sheetsController.getSheet = async (req, res) => {
    try {
        const sheet = await Sheet.findById(req.params.sheetId)
        return res.json({ success: true, sheet })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

sheetsController.createSheet = async (req, res) => {
    const {description, date, type, user, exercises, params} = req.body

    if(!description || !type || !user) {
        return res.json({ 
            success: false,
            message: 'Provea los parametros description, type y user'
        })
    }

    try {
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
        return res.json({ success: true, sheet })
    } catch (err) {
        return res.json({ success:false, message: err.message })
    }
}

sheetsController.updateSheet = async (req, res) => {
    const {description, type, exercises, solutionsType, params} = req.body;

    if(!description || !type || !solutionsType) {
        return res.json({ 
            success: false,
            message: 'Provea los parametros description, type y solutionsType'
        })
    }

    try {
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

        return res.json({ success: true, sheet })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

sheetsController.deleteSheet = async (req, res) => {
    try {
        const sheet = await Sheet.findByIdAndDelete(req.params.sheetId);
        const exams = await Exam.find({sheet: sheet._id})

        for (let j = 0; j < exams.length; j++) {
            const deletedExam = await Exam.findByIdAndDelete(exams[j]._id)
            const arr = await ApplyExam.find({exam: deletedExam._id})
            for(let i=0; i<arr.length; ++i) {
                const deleted = await ApplyExam.findByIdAndDelete(arr[i]._id)
                if(!deletedExam.sheet.equals(deleted.sheet)) {
                await Sheet.findByIdAndDelete(deleted.sheet);
                }
            }
        }
        return res.json({ success: true, sheet });
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

module.exports = sheetsController;