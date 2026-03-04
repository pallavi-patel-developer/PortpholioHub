
const mongoose = require('mongoose');
const aboutSchema = new mongoose.Schema({
        userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserIntern', // Assumes your user model is named 'UserIntern'
        required: true, 
        unique: true // Each user can only have one profile document
    },
    role: String,
    bio: String,
});
module.exports = mongoose.model('About', aboutSchema);