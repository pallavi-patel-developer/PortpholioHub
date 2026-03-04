
const mongoose = require('mongoose');
const myWorkSchema = new mongoose.Schema({
        userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserIntern', // Assumes your user model is named 'UserIntern'
        required: true, 
        unique: true // Each user can only have one profile document
    },
    projects: [{
        imageUrl: String,
        description: String,
    }]
});
module.exports = mongoose.model('MyWork', myWorkSchema);