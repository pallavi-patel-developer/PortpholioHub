 
const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
        userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserIntern', // Assumes your user model is named 'UserIntern'
        required: true, 
        unique: true // Each user can only have one profile document
    },
    name: String,
    yearsOfExperience: String,
    profileImageUrl: String,
});
module.exports = mongoose.model('Profile', profileSchema);