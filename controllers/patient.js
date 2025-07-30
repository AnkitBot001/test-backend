const patient = require('../models/patient')

exports.createPatient = async (req, res) => {
    try {
        const { first_name, last_name, age, email, disease, married } = req.body;

        const exhist = await patient.findOne({email});
        if (exhist) return res.status(400).json({ error: 'Email already exhist' });

        const newPatient = new patient({
            first_name,
            last_name,
            age,
            email,
            disease,
            marrital_status: married
        });

        const savedPatient = await newPatient.save();

        res.status(201).json({
            code: 200,
            message: 'Patient Created sucessfuly',
            data: savedPatient
        })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}