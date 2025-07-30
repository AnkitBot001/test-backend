const mongoose = require('mongoose');
const validator = require('validator');

const patientSchema = new mongoose.Schema({
    first_name:{
        type: String,
        require: true
    },
    last_name:{
        type: String,
        reuqire: true
    },
    age:{
        type: Number,
    },
    email:{
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID'
      },
    },
    gender:{
        type: String,
    },
    marrital_status:{
        type: Boolean,
        default: false
    },
    disease:{
        type: String,
        require: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Patient', patientSchema )