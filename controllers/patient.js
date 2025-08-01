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

exports.patientList = async (req, res) => {
    try {
        const { page, limit, search, sort, type} = req.query;
        const filter = search ? {   $or: [
                { first_name: { $regex: search, $options: 'i' } },
                { last_name: { $regex: search, $options: 'i' } },
                { disease: { $regex: search, $options: 'i' } }
            ]}: {};

        const skip = ((page || 1) - 1) * (limit || 10) ;

        let sortObj = {};

        switch(type) {
            case 'first_name':
            case 'age':
            case 'createdAt':
                if(sort){
                    sortObj[type] = parseInt(sort);
                }
            break;

            default:
                sortObj.createdAt = sort || -1;
        } 

        const patients = await patient.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit))

        const totalPatients = await patient.countDocuments();
        
        res.json({
            code:200,
            data:patients,
            total:totalPatients,
            msg: 'Patients fetched successfuly'
        });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

exports.getPatientById = async (req, res) => {
    try {
        const pat = patient.findById({req.params._id});
        if(!pat) return res.status(404).json({error:'Patient not found.'})
        res.json({
            code:200,
            data:pat,
            msg:'Patient details fetched successfuly.'
        });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}
