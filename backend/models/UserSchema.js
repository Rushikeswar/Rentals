import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  dateofbirth: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookings: {
    type: [String],
  },
  rentals:{
    type: [String],
  }
});

const User = mongoose.model("Users", UserSchema);
export { User }