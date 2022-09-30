// import dependencies
const mongoose = require('mongoose'); 

const { Schema, SchemaTypes } = mongoose;
const bcrypt = require('bcrypt');
// set up our userSchema
const userSchema = new Schema({
  // the alias a User goes by on the site
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  // the email address a user signed up with
  email: {
    type: String,
    required: true,
    unique: true
  },
  // the password used to login to the User account, should be stored hashed via a .pre below
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  campaigns: [{
    type: SchemaTypes.ObjectId,
    ref: 'Campaign'
  }]
});
// salt/hash our password before saving it to db
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});
// compare stored password hash using bcrypt to ensure the correct password was entered
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
