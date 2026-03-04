
const mongoose = require('mongoose');
const experienceSchema = new mongoose.Schema({
        userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserIntern', // Assumes your user model is named 'UserIntern'
        required: true, 
        unique: true // Each user can only have one profile document
    },
    items: [{
        role: String,
        company: String,
        period: String,
        description: String,
    }]
});
module.exports = mongoose.model('Experience', experienceSchema);