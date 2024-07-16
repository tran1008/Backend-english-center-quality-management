import mongoose  from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ie213-cluster.kpoiox5.mongodb.net/?retryWrites=true&w=majority&appName=IE213-Cluster`
mongoose.connect(connectionString,
    {
        dbName: process.env.MONGO_DBNAME
    }
)
// for of là lặp qua từng phần tử của mảng
// CONNECT MONGODB
// for in là lặp qua từng key của một object
// for of là lặp qua từng phần tử của một mảng
//moogose là thư viện mô hình hóa đối tượng dữ liệu cho mongodb
const db = mongoose.connection;

export default db