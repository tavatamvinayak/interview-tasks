const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const weatherRoutes = require('./routes/weather.routes')

const app = express()

app.use(cors({
    origin:["*"]
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'));

app.use('/api',weatherRoutes);

app.use((req,res)=>{
    res.status(404).json({message:"Route not found"})
})

module.exports = app