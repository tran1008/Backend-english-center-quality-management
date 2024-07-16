
import mongoose from "mongoose"

const schema = new mongoose.Schema({
  Date: Date,
  GoodLevel: Number,
  MediumLevel: Number,
  BadLevel: Number,
  TotalStudent: Number,
  ClassScore: Number,
  ClassLevel: String,
  Month: {
    type: Number,
    index: true,
  },
  Year: {
    type: Number,
    index: true,
  },
  ClassID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassID",
  },
});


schema.virtual('_Class', {
    ref: 'Class',
    localField: 'ClassID',
    foreignField: '_id',
    justOne: true
})
const ClassReportSchema = mongoose.model("ClassReport", schema);
 export default ClassReportSchema