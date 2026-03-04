require("dotenv").config();
const express = require("express");
const multer = require("multer");
const passport = require("passport");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const { uploadOnCloudinary } = require('./config/cloudinary.js');
const connectDB = require('./config/db');
const contactUs = require("./models/contactUs.js");
const UserIntern = require('./models/userIntern');
const internForm = require('./models/internForm');
const UserRecruiter = require('./models/userRecruiter.js');
const Job = require("./models/postJob.js");
const applyInternship = require("./models/applyInternship.js");
const EditProfile = require("./models/editProfile.js");
const contactEditProfile = require("./models/contactEditProfile.js");
const Profile = require('./models/profile.js');
const about = require('./models/about.js');
const education = require('./models/education.js');
const skills = require('./models/skills.js');
const experience = require('./models/experience.js');
const myWork = require('./models/myWork.js');

connectDB();
const app = express();
const dirname = path.resolve(__dirname, '..');

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
    "https://portpholiohub-frontend.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'portfolio-hub-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || process.env.MONGODB_URI }),
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());
app.get('/config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    window.process = {
      env: {
        BACKEND_URL: "${process.env.BACKEND_URL}"
      }
    };
  `);
});

app.use(express.static(path.join(dirname)));

// Centralized Serialization
passport.serializeUser((user, done) => {
  const type = user.constructor.modelName === 'userIntern' ? 'intern' : 'recruiter';
  done(null, { id: user._id, type });
});

passport.deserializeUser(async (data, done) => {
  try {
    const Model = data.type === 'intern' ? UserIntern : UserRecruiter;
    const user = await Model.findById(data.id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Load Strategies
require('./auth/google');
require('./auth/github');


const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) { fs.mkdirSync(uploadsDir); }
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage, limits: { fieldSize: 10 * 1024 * 1024 } });

const storageEditProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, "uploads/resumes");
    else cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadEditProfile = multer({ storage: storageEditProfile });

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'a-very-strong-secret-key'
};

const updateSection = async (Model, query, data, res) => {
  try {
    const updatedDoc = await Model.findOneAndUpdate(query, data, {
      new: true,
      upsert: true,
    });
    res.status(200).json({ message: 'Section saved successfully!', data: updatedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error saving section', error });
  }
};

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await UserIntern.findById(jwt_payload.id);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

const authenticateRecruiter = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, jwtOptions.secretOrKey);
    const recruiter = await UserRecruiter.findById(decoded.id);

    if (!recruiter) {
      return res.status(401).json({ message: "Unauthorized: Not a recruiter" });
    }

    req.user = recruiter;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const authenticateIntern = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, jwtOptions.secretOrKey);
    const user = await UserIntern.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Not an intern" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

app.get('/intern-signup', (req, res) => {
  res.send("Intern signup sucessfull");
})

app.get('/login', (req, res) => {
  res.send("Login sucessfull ");
})

app.get('/contactUs', (req, res) => {
  res.send(" Contact Us sucessfull ");
})

app.get('/forms', (req, res) => {
  res.send(" FOrms ")
})

app.get('/recruiter-signup', (req, res) => {
  res.send("Recruiter signup sucessfull");
})

// OAuth Routes
const handleOAuthCallback = (req, res, type) => {
  const payload = { id: req.user._id, username: req.user.username, type };
  const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1d' });
  const redirectBase = type === 'intern' ? '/intern dashboard/studash.html' : '/recruiter-Index/recruiter-Index.html';
  const frontendUrl = process.env.FRONTEND_URL;
  res.redirect(`${frontendUrl}${redirectBase}?token=${token}&status=${req.authInfo?.new ? 'signup' : 'login'}_success`);
};

// Google
app.get('/auth/google/intern', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'], state: 'intern' })(req, res, next);
});
app.get('/auth/google/recruiter', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'], state: 'recruiter' })(req, res, next);
});

app.get('/auth/google/intern/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login/login.html?error=google_auth_failed` }),
  (req, res) => {
    const type = req.authInfo?.type || (req.query.state === 'recruiter' ? 'recruiter' : 'intern');
    handleOAuthCallback(req, res, type);
  }
);

// GitHub
app.get('/auth/github/intern', (req, res, next) => {
  passport.authenticate('github', { scope: ['user:email'], state: 'intern' })(req, res, next);
});
app.get('/auth/github/recruiter', (req, res, next) => {
  passport.authenticate('github', { scope: ['user:email'], state: 'recruiter' })(req, res, next);
});

app.get('/auth/callback/github',
  passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login/login.html?error=github_auth_failed` }),
  (req, res) => {
    const type = req.authInfo?.type || (req.query.state === 'recruiter' ? 'recruiter' : 'intern');
    handleOAuthCallback(req, res, type);
  }
);


app.get(
  '/profile', authenticateIntern, async (req, res) => {
    try {
      const portfolio = await internForm.findOne({ userId: req.user._id });

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found. Please fill the form to create one.",
        });
      }

      return res.status(200).json(portfolio);

    } catch (err) {
      return res.status(500).json({ message: "Server error while fetching portfolio." });
    }
  }
);


app.get('/send-contact', (req, res) => {
  res.send("Contact me sucessfull");
});

app.get('/recruiter/profiles', async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const skip = (page - 1) * limit;

    const total = await internForm.countDocuments();
    const profiles = await internForm
      .find({}, "fullName role city aboutMe skills photo")
      .skip(skip)
      .limit(Number(limit));

    res.json({
      profiles,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching profiles." });
  }
});

app.get('/profile/:id', async (req, res) => {
  try {
    const pId = req.params.id;
    let portfolio = await internForm.findById(pId).lean();

    if (!portfolio) {
      portfolio = await Profile.findById(pId).lean();
      if (portfolio) {
        portfolio = {
          _id: portfolio._id,
          fullName: portfolio.name || "Applicant",
          role: "Candidate",
          city: "Unknown",
          photo: portfolio.profileImageUrl || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
          skills: []
        };
      }
    }

    if (!portfolio) {
      const user = await UserIntern.findById(pId).lean();
      if (user) {
        portfolio = {
          _id: user._id,
          fullName: user.username || "Applicant",
          role: "Candidate",
          city: "Unknown",
          photo: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
          skills: []
        };
      }
    }

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching portfolio" });
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();

    const jobsWithApplicants = await Promise.all(
      jobs.map(async job => {
        const applicantCount = await applyInternship.countDocuments({
          internshipId: job._id
        });
        return {
          ...job.toObject(),
          applicantCount
        };
      })
    );

    res.json(jobsWithApplicants);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
});



app.get("/recruiter/jobs", authenticateRecruiter, async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching recruiter jobs" });
  }
});

app.get('/applyInternship', authenticateIntern, async (req, res) => {
  try {
    const userId = req.user.id;

    const allInternships = await Job.find({});
    const userApplications = await applyInternship.find({ userId });

    const appliedInternshipIds = new Set(
      userApplications.map(app => app.internshipId.toString())
    );

    const internshipsWithStatus = allInternships.map(internship => {
      return {
        ...internship.toObject(),
        hasApplied: appliedInternshipIds.has(internship._id.toString())
      };
    });

    res.json(internshipsWithStatus);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/myApplications', authenticateIntern, async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await applyInternship.find({ userId }).populate("internshipId");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/recruiter/applicants", authenticateRecruiter, async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({ recruiterId: recruiterId }, '_id').lean();
    if (!jobs.length) {
      return res.json([]);
    }
    const jobIds = jobs.map(job => job._id);

    const applications = await applyInternship.find({
      internshipId: { $in: jobIds }
    }).lean();

    const applicantUserIds = [...new Set(applications.map(app => app.userId))];

    const internForms = await internForm.find({
      userId: { $in: applicantUserIds }
    }).lean();
    const internFormMap = new Map(internForms.map(p => [p.userId.toString(), p]));

    const profiles = await Profile.find({
      userId: { $in: applicantUserIds }
    }).lean();
    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));

    const users = await UserIntern.find({
      _id: { $in: applicantUserIds }
    }).lean();
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    const fullApplicantDetails = applications.map(app => {
      const uId = app.userId.toString();
      const user = userMap.get(uId) || {};
      const form = internFormMap.get(uId);
      const prof = profileMap.get(uId);

      let portfolio = null;
      if (form) {
        portfolio = form;
      } else if (prof) {
        portfolio = {
          _id: prof._id,
          fullName: prof.name || user.username || "Applicant",
          role: "Candidate",
          city: "Unknown",
          photo: prof.profileImageUrl || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
          skills: []
        };
      } else {
        portfolio = {
          _id: user._id || app.userId,
          fullName: user.username || "Applicant",
          role: "Candidate",
          city: "Unknown",
          photo: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
          skills: []
        };
      }

      return {
        applicationId: app._id,
        status: app.status,
        jobTitle: app.title,
        appliedOn: app.appliedOn,
        portfolio: portfolio,
        userEmail: user.email,
        userPhone: user.phone || ''
      };
    });

    res.json(fullApplicantDetails);

  } catch (err) {
    res.status(500).json({ message: "Server error while fetching applicants" });
  }
});

app.get('/me', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      return res.status(401).json({ authenticated: false, message: 'No token provided.' });
    }

    jwt.verify(token, jwtOptions.secretOrKey, (err, user) => {
      if (err) {
        return res.status(403).json({ authenticated: false, message: 'Invalid token.' });
      }

      req.user = user;
      res.status(200).json({ authenticated: true, user: req.user });
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during token verification.' });
  }
});

app.get('/recruiter/me', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return res.status(401).json({ authenticated: false, message: 'No token provided.' });
    }

    jwt.verify(token, jwtOptions.secretOrKey, (err, user) => {
      if (err) {
        return res.status(403).json({ authenticated: false, message: 'Token is invalid or expired.' });
      }

      res.status(200).json({ authenticated: true, user: user });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during token verification.' });
  }
});


app.get('/editProfile/:id', async (req, res) => {
  try {
    const profile = await EditProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});



app.post('/intern-signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = await new UserIntern({ username, email, password: hashedPassword }).save();
    const payload = { id: savedUser._id, username: savedUser.username };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1d' });
    return res.status(201).json({ success: true, message: "Registration successful!", token: token });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Email already registered.' });
    res.status(500).json({ message: 'Server error.' });
  }
});



app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await UserIntern.findOne({ email });
    let userType = 'intern';

    if (!user) {
      user = await UserRecruiter.findOne({ email });
      userType = 'recruiter';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1d' });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token,
      userType: userType
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/recruiter-signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPasswordR = await bcrypt.hash(password, 10);
    const savedUserR = await new UserRecruiter({ username, email, password: hashedPasswordR }).save();
    const payloadR = { id: savedUserR._id, username: savedUserR.username };
    const tokenR = jwt.sign(payloadR, jwtOptions.secretOrKey, { expiresIn: '1d' });
    return res.status(201).json({ success: true, message: "Registration successful!", token: tokenR });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Email already registered.' });
    res.status(500).json({ message: 'Server error.' });
  }
});




app.post('/contactUs', (req, res) => {
  const { name, email, subject, phoneNumber, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `Contact Form Submission: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send email.' });
    }
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});



app.post('/forms', passport.authenticate('jwt', { session: false }),
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'projectPhoto1', maxCount: 1 },
    { name: 'projectPhoto2', maxCount: 1 },
    { name: 'projectPhoto3', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      let photoUrl = '';
      let resumeUrl = '';
      if (req.files['photo']) {
        const cloudinaryRes = await uploadOnCloudinary(req.files['photo'][0].path);
        photoUrl = cloudinaryRes.secure_url;
      }
      if (req.files['resume']) {
        const cloudinaryRes = await uploadOnCloudinary(req.files['resume'][0].path);
        resumeUrl = cloudinaryRes.secure_url;
      }

      const educationData = JSON.parse(req.body.education || '[]');
      const skillsData = JSON.parse(req.body.skills || '[]');
      const experienceData = JSON.parse(req.body.experience || '[]');
      const projects = JSON.parse(req.body.projects || '[]');

      let projectPhotoUrls = [];
      for (let i = 1; i <= 3; i++) {
        let url = '';
        if (req.files[`projectPhoto${i}`]) {
          const cloudinaryRes = await uploadOnCloudinary(req.files[`projectPhoto${i}`][0].path);
          url = cloudinaryRes.secure_url;
        }
        projectPhotoUrls.push(url);
        if (projects[i - 1]) {
          projects[i - 1].photo = url;
        }
      }

      const portfolioData = {
        userId: req.user._id,
        fullName: req.body.fullName,
        role: req.body.role,
        city: req.body.city,
        dateOfBirth: req.body.dob,
        gender: req.body.gender,
        aboutMe: req.body.aboutMe,
        photo: photoUrl,
        resume: resumeUrl,
        projectPhoto1: projectPhotoUrls[0],
        projectPhoto2: projectPhotoUrls[1],
        projectPhoto3: projectPhotoUrls[2],
        education: educationData,
        skills: skillsData,
        experience: experienceData,
        projects,
        contactDetails: {
          phone: req.body.phone,
          contactEmail: req.body.email,
          github: req.body.github,
          linkedin: req.body.linkedin,
          instagram: req.body.instagram,
          facebook: req.body.facebook
        }
      };

      const finalPortfolio = await internForm.findOneAndUpdate(
        { userId: req.user._id },
        { $set: portfolioData },
        { new: true, upsert: true, runValidators: true }
      );

      return res.status(201).json({
        message: 'Portfolio saved successfully!',
        data: finalPortfolio
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error while saving portfolio.' });
    }
  }
);




app.post('/send-contact', async (req, res) => {
  try {
    const { userId, name, email, message } = req.body;
    const portfolio = await internForm.findOne({ userId });
    if (!portfolio || !portfolio.contactDetails?.contactEmail) {
      return res.status(404).json({ message: "Portfolio owner not found" });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"PortfolioHub" <${process.env.SMTP_USER}>`,
      to: portfolio.contactDetails.contactEmail,
      subject: `${name}" WANTS TO CONTACT YOU " `,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email." });
  }
});



app.post("/postJob", authenticateRecruiter, async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      recruiterId: req.user.id
    });
    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    res.status(500).json({ message: "Server error while posting job" });
  }
});



app.post('/applyInternship', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { internshipId } = req.body;
    const userId = req.user.id;

    if (!internshipId || !userId) {
      return res.status(400).json({ error: "internshipId and userId required" });
    }

    const existing = await applyInternship.findOne({ internshipId, userId });
    if (existing) {
      return res.status(400).json({ error: "Already applied" });
    }

    const internship = await Job.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }

    const application = new applyInternship({
      userId,
      internshipId: internship._id,
      title: internship.title,
      description: internship.description,
      employmentType: internship.employmentType,
      stipend: internship.stipend,
      duration: internship.duration,
      workType: internship.workType,
      experienceLevel: internship.experienceLevel,
      location: internship.location,
      skills: internship.skills,
      appliedOn: new Date()
    });

    await application.save();
    res.json({ success: true, message: "Application saved" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/jobs/:id/incrementApplicants", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { applicantCount: 1 } },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ success: true, applicantCount: job.applicantCount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/jobs/:id", authenticateRecruiter, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user.id },
      req.body,
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating job" });
  }
});


app.delete("/jobs/:id", authenticateRecruiter, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      recruiterId: req.user.id
    });

    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting job" });
  }
});


app.patch("/recruiter/applicants/:applicationId/status", authenticateRecruiter, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const application = await applyInternship.findByIdAndUpdate(
      applicationId,
      { status: status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.json({ message: `Status updated to ${status}`, application });

  } catch (err) {
    res.status(500).json({ message: "Server error while updating status" });
  }
});


app.post('/logout', (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

app.post('/recruiter/logout', (req, res) => {
  res.status(200).json({ success: true, message: 'Recruiter logged out successfully.' });
});


app.post('/editProfile', authenticateIntern, (req, res) => {
  const query = { userId: req.user._id };
  const data = req.body;
  updateSection(Profile, query, data, res);
});

app.post('/about', authenticateIntern, (req, res) => {
  const query = { userId: req.user._id };
  updateSection(about, query, req.body, res);
});

app.post('/education', authenticateIntern, (req, res) => {
  const query = { userId: req.user._id };
  updateSection(education, query, req.body, res);
});

app.post('/contact', authenticateIntern, (req, res) => {
  const query = { userId: req.user._id };
  updateSection(contactEditProfile, query, req.body, res);
});

app.post('/skills', authenticateIntern, (req, res) => {
  const query = { userId: req.user._id };
  updateSection(skills, query, req.body, res);
});

app.post('/experience', authenticateIntern, (req, res) => {
  const query = { userId: req.user._id };
  updateSection(experience, query, req.body, res);
});


app.post('/myWork', authenticateIntern, (req, res) => {
  const query = { userId: req.user._id };
  updateSection(myWork, query, req.body, res);
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} \n http://localhost:${PORT}`);
});
