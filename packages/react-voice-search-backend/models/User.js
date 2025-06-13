import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // store hashed passwords
  email:{type: String, required: true },
  country:{type: String, required: true },
  phone:{type: Number, required: true }
});

export default mongoose.model('User', userSchema);
