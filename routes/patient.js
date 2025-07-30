const express = require('express');
const router = express.Router();
const patinetContorller = require("../controllers/patient");

router.post('/createPatient', patinetContorller.createPatient)

module.exports = router;