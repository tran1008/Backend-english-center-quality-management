import mongoose from "mongoose"
import StudentSchema from "./student.schema.js"

const schema = new mongoose.Schema({
    Title: String,
    Date: Date,
    Description: String,
    Score: Number,
    Level: String,
    HomeworkID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Homework",
    }, 
    StudentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Student",
    },
    ClassID: mongoose.Schema.Types.ObjectId,
    RequiredScore: Number
})

// schema.pre('save', async function (next) {
//     const student = await StudentSchema.findById(this.StudentID)
//     this.ClassID = student.ClassID
//     next()
// })

// Populate homework and student before and find method
schema.pre(/^find/, function (next) {
    this.populate("HomeworkID");
    this.populate("StudentID");
    next()
})

// schema.virtual('_Homework', {
//     ref: 'Homework',
//     localField: 'HomeworkID',
//     foreignField: '_id',
//     justOne: true
// })
// schema.virtual('_Student', {
//     ref: 'Student',
//     localField: 'StudentID',
//     foreignField: '_id',
//     justOne: true
// })

const StudentHomeworkSchema = mongoose.model("StudentHomework", schema);
 export default StudentHomeworkSchema