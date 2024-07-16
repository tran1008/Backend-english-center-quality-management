import mongoose from "mongoose"

const schema = new mongoose.Schema({
    ClassID: { // mã lớp 
        type: String,
        unique: true,
    },
    Name: {  // tên lớp
        type: String,
    },
    TermFrom: Date,  // thời hạn học từ bao nhiêu đến bao nhiêu
    TermTo: Date,
    Type: String,
    ScoreRequired: {   // điểm số yêu cầu
        type: Number,
        require: true
    },
    ScoreTarget: { // mức điểm số
        type: Number,
        require: true 
    },
    TeacherName: String,
    NumberOfStudent: {
        type: Number,
        default:0,
        min: 0
    },
    TeacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"TeacherID",
    }
})

schema.virtual('_Teacher', {
    ref: 'Teacher',
    localField: 'TeacherID',
    foreignField: '_id',
    justOne: true
})


const ClassSchema = mongoose.model("Class", schema);
export default ClassSchema
