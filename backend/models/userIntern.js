
const mongoose = require('mongoose');

const userSchemaIntern = new mongoose.Schema(
  {
    username: {
      type: String,
      required: function () {
        return this.provider === 'local';
      },
      unique: true,
      sparse: true, // Add sparse for optional unique fields
    },
    email: {
      type: String,
      required: function () {
        return this.provider === 'local';
      },
      unique: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: function () {
        return this.provider === 'local';
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Unique when present
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ['local', 'github', 'google', 'phone'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);

userSchemaIntern.pre('save', function (next) {
  if (this.provider === 'local' && !this.password) {
    const error = new Error('Password is required for local users');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

const UserIntern = mongoose.model('userIntern', userSchemaIntern);

module.exports = UserIntern;
