
import mongoose from "mongoose"

const schema = new mongoose.Schema({
    Date: Date,
    GoodLevel: Number,
    MediumLevel: Number,
    BadLevel: Number,
    TotalStudent: Number,
    CenterScore: Number,
    Month: {
        type: Number,
        index: true
    }
})


const TotalReportSchema = mongoose.model("TotalReport", schema);
 export default TotalReportSchema