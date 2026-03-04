const mongoose = require('mongoose');
const { Schema } = mongoose;

const educationSchema = new Schema({
    detail: { type: String },
    startDate: { type: Date },
    endDate: { type: Date }
});

const workItemSchema = new Schema({
    image: { type: String }, // Stores the URL or path to the uploaded image
    description: { type: String }
});

const experienceSchema = new Schema({
    role: { type: String },
    company: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String }
});

const editProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assumes you have a User model
        required: true,
        unique: true
    },
    
    profileImage: { type: String },
    fullName: { type: String },
    yearsOfExperience: { type: String },

    role: { type: String },
    bio: { type: String },

    education: [educationSchema],

    contact: {
        phone: { type: String },
        email: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        github: { type: String }
    },

    skills: [String],

    myWork: [workItemSchema],

    experience: [experienceSchema],

    resume: { type: String } 
}, {
    timestamps: true
});

const EditProfile = mongoose.model('EditProfile', editProfileSchema);

module.exports = EditProfile;