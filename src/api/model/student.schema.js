import mongoose from "mongoose"
import moment from 'moment';

const schema = new mongoose.Schema({
    Name: {
        type: String,
    },
    FirstName: String,
    LastName: String,
    StudentID: {
        type: String,
        unique: true,
    },
    Address: {
        type: String,
    },
    Email: {
        type: String,
    },
    Age: {
        type: Number,
        default: 20,
    },
    PhoneNumber: {
        type: String,
    },
    DateOfBirthday: {
        type: Date,
    },
    ImageURL: String,
    ScoreIncome: Number,
    ScoreDesire: Number,
    TypeClass: String,
    NameClass: String,
    ClassID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ClassID",
    }
})

schema.virtual('_Class', {
    ref: 'Class',
    localField: 'ClassID',
    foreignField: '_id',
    justOne: true
})

schema.pre('save', function(next) {
    this.Name = `${this.FirstName} ${this.LastName}`;
  
     // Kiểm tra tính hợp lệ của dữ liệu ngày tháng
    const dob = moment(this.DateOfBirthday, 'DD-MM-YYYY');
    if (!dob.isValid()) {
        return next(new Error('Invalid date format'));
    }
    
    // Chuyển đổi sang kiểu Date và gán lại giá trị
    this.DateOfBirthday = dob.toDate();
    next();
});

const StudentSchema = mongoose.model("Student", schema);
export default StudentSchema
