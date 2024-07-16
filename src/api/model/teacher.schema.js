import mongoose from "mongoose";

const schema = new mongoose.Schema({
  Name: {
    type: String,
  },
  FirstName: String,
  LastName: String,
  TeacherID: {
    type: String,
    unique: true,
  },
  DateOfBirth: {
    type: Date,
  },
  StartedDate: {
    type: Date,
  },
  Email: {
    type: String,
  },
  PhoneNumber: {
    type: String,
  },
  Password: {
    type: String,
  },
  ImageURL: String,
  Certificate: String,
  Score: String,
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // Tham chiếu tới model của lớp
  },
});

schema.pre("save", function (next) {
  this.Name = `${this.FirstName} ${this.LastName}`;
  next();
});

const TeacherSchema = mongoose.model("Teacher", schema);
export default TeacherSchema;
