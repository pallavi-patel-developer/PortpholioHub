
const mongoose = require('mongoose');


const educationSchema = new mongoose.Schema({
    degree: { type: String, trim: true },
    college: { type: String, trim: true },
    year: { type: String, trim: true }
});

const skillSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    description: { type: String, trim: true }
});

const experienceSchema = new mongoose.Schema({
    role: { type: String, trim: true },
    company: { type: String, trim: true },
    start: { type: String },
    end: { type: String }
});

const projectSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    link: { type: String, trim: true },
    photo: { type: String } // For the Cloudinary URL of the project image
});



const portfolioSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserIntern',
        required: true,
        unique: true 
    },
    
    fullName: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    city: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String },
    aboutMe: { type: String, trim: true },
    photo: { type: String }, 
    resume: { type: String },
    education: [educationSchema],
    
    skills: [skillSchema],
    experience: [experienceSchema],

    projects: [projectSchema],

    contactDetails: {
        phone: { type: String, trim: true },
        contactEmail: { type: String, trim: true }, // Named to avoid confusion with login email
        github: { type: String, trim: true },
        linkedin: { type: String, trim: true },
        instagram: { type: String, trim: true },
        facebook: { type: String, trim: true }
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

portfolioSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

const internForm = mongoose.model('internForm', portfolioSchema);

module.exports = internForm;