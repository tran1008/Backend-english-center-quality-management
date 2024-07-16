import mongoose from "mongoose"
import StudentSchema from "./student.schema.js"

const schema = new mongoose.Schema({
    Title: String,
    Date: Date,
    Description: String,
    Score: Number,
    Level: String,
    TestID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
    },
    StudentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    ClassID: mongoose.Schema.Types.ObjectId,
    RequiredScore: Number
})

// schema.pre('save', async function (next) {
//     const student = await StudentSchema.findById(this.StudentID)
//     this.ClassID = student.ClassID
//     next()
// })

// Populate test and student before and find method
schema.pre(/^find/, function (next) {
    this.populate("TestID");
    this.populate("StudentID");
    next()
})

// schema.virtual('_Test', {
//     ref: 'Test',
//     localField: 'TestID',
//     foreignField: '_id',
//     justOne: true
// })
// schema.virtual('_Student', {
//     ref: 'Student',
//     localField: 'StudentID',
//     foreignField: '_id',
//     justOne: true
// })
const StudentTestSchema = mongoose.model("StudentTest", schema);
export default StudentTestSchema