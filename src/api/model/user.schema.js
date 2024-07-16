import mongoose from "mongoose"

const schema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
    default: 0,
  },
});

const UserSchema = mongoose.model("User", schema);
 export default UserSchema
