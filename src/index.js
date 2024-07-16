import app from './app.js'
import dotenv from 'dotenv'
import db from './api/helpers/connectDB.js'
async function main(){
    dotenv.config()
    const port = process.env.PORT || 8000
    try{
        // CONNECT DB
        db.on("error", console.error.bind(console, "connection error: "))
        db.once("open", function () {
        console.log("Connected successfully")
        })
        app.listen(port, () => {
            console.log('Server is running on port ' + port)
        })
    }catch(error){
        console.error(error)
        process.exit(1)
    }
}

main().catch(console.error)