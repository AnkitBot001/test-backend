const express = require('express');
const router = express.Router();
const patinetContorller = require("../controllers/patient");

router.post('/createPatient', patinetContorller.createPatient);
router.get('/getPatientList', patinetContorller.patientList);
router.get('/getPatinetById',patinetContorller.getPatientById);

module.exports = router;