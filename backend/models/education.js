
const mongoose = require('mongoose');
const educationSchema = new mongoose.Schema({
      userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserIntern', // Assumes your user model is named 'UserIntern'
        required: true, 
        unique: true // Each user can only have one profile document
    },
    items: [String]
});
module.exports = mongoose.model('Education', educationSchema);