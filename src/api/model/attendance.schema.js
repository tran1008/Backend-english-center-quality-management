import mongoose from "mongoose"

const schema = new mongoose.Schema({
    Attended: Boolean,
    Date: {
        type: Date,
    },
    ClassID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ClassID",
    },
    StudentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"StudentID",
    },
    Description: String
})
schema.virtual('_Class', {
    ref: 'Class',
    localField: 'ClassID',
    foreignField: '_id',
    justOne: true
})
schema.virtual('_Student', {
    ref: 'Student',
    localField: 'StudentID',
    foreignField: '_id',
    justOne: true
})
schema.index({Date: 1, ClassID: -1})

const AttendanceSchema = mongoose.model("Attendance", schema);
 export default AttendanceSchema

