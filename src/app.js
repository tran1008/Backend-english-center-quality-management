import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import routeV1 from './api/index.js'
const app = express()


// const db = require('./api/helpers/connectDB')

// SET UP
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

// REQUIRE ROUTES
app.use('/api/v1', routeV1)
app.use('*', (req, res) => {
  res.status(404).json({error: "not found"})
})


export default app