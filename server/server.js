import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { BlogRouter } from './routes/Blogs.js'
import { UserRouter } from './routes/Users.js'

const {MONGO_URL} = process.env

const app = express()

app.use(cors())
app.use(express.json())
app.use('/public',express.static('public'))

app.use("/blogs", BlogRouter)
app.use("/users", UserRouter)

//Connect to MongoDB
mongoose.connect(MONGO_URL)


//START THE SERVER
app.listen(3001, () => {
    console.log("Server is running on PORT 3001")
})
