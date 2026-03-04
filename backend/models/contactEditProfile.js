
const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
        userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserIntern', // Assumes your user model is named 'UserIntern'
        required: true, 
        unique: true // Each user can only have one profile document
    },
    email: String,
    phone: String,
    instagram: String,
    linkedin: String,
    github: String
});

module.exports = mongoose.model('Contact', contactSchema);