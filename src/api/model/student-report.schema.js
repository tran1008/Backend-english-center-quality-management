import mongoose from "mongoose"
import StudentSchema from "./student.schema.js"

const schema = new mongoose.Schema({
    Date: Date,
    Attendance: Boolean,
    HomeworkScore: Number,
    HomeworkScoreRequired: Number,
    TestScore: Number,
    TestScoreRequired: Number,
    TotalScore: Number,
    Month: {
        type: Number,
        index: true
    },
    Year: {
        type: Number,
        index: true
    },
    StudentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    ClassID: mongoose.Schema.Types.ObjectId
})


// schema.virtual('_Student', {
//     ref: 'Student',
//     localField: 'StudentID',
//     foreignField: '_id',
//     justOne: true
// })

// schema.pre('save',async function (next) {
//     const student = await StudentSchema.findById(this.StudentID)
//     this.ClassID = student.ClassID
//     next()
// })

schema.pre(/^find/, function (next) {
    this.populate("StudentID")
    next()
})

const StudentReportSchema = mongoose.model("StudentReport", schema);
export default StudentReportSchema