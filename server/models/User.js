// import dependencies
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
// set up our userSchema
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: isValidPassword,
      message: 'Password must have at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
    }
  },
  campaigns: {
    type: Array
  }
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

export default mongoose.model('User', userSchema);
