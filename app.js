const express = require('express')
const app = express()
const fs = require("fs")
const pagesRouter = require('./Routes/pagesRouter')
const Mushaf = fs.readFileSync('./Public/Pages/Mushaf.html')
const userRouter = require('./Routes/userRouter')
const trackerRouter = require('./Routes/trackerRouter')
const authRouter = require('./Routes/authRouter')
const ayahRouter = require('./Routes/ayahRouter')
const surahRouter = require('./Routes/surahRouter')
const tafseerRouter = require('./Routes/tafseerRouter')
const { sequelize } = require('./Models')
const cookieParser = require('cookie-parser')


app.use(express.static('./Public'))
app.use(express.json())
app.use(cookieParser())


app.use('/api/v1/users',userRouter)
app.use('/api/v1/trackers',trackerRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/ayah',ayahRouter)
app.use('/api/v1/surah',surahRouter)
app.use('/api/v1/tafseer',tafseerRouter)

app.use('/',(req,res) =>{
    res.setHeader("Content-Type",'text/html')
    res.end(Mushaf)
})


async function main(){
    await sequelize.authenticate()
    console.log('⭐ Database connected.') 
}

main()                                                          

module.exports = app

// 8/11 What's done: -Get whole Surah with content✅
//                   -Get whole page from ayah✅

// 8/11 What's left: -Tafseer model with the same apis
//                   -Rest of the cruds of Surah & Ayah
//                   - Protect Middleware
//                   -BULK INSERT☠️ 💫✅ 16/11