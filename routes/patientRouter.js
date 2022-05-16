// add router
const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const patientRouter = express.Router()

// connect to controller
const patientController = require('../controllers/patientController')

// process routes by calling controller functions
patientRouter.get('/:id', patientController.getPatientInfo)
//patientRouter.get('/:id', (req, res) => patientController.getPatientNote(req,res))

patientRouter.post('/addNote', function (req, res) {
    patientController.addNote(req.body)
    console.log(req.body)
    res.redirect('/patient/' + req.body.patientId.toString())
})

patientRouter.post('/updateSupportMessage', function (req, res) {
    console.log(req.body)

    
    patientController.updateSupportMessage(req.body)
    console.log(req.body)
    res.redirect('/patient/' + req.body.patientId.toString())
})

patientRouter.post('/editDataSetting', function (req, res) {
    patientController.editDataSetting(req.body)
    res.redirect('/patient/' + req.body.patientId.toString())
})

// export router
module.exports = patientRouter
