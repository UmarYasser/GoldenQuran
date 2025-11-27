const express = require('express')
const app = express()
const userRouter = require('./Routes/userRouter')
const authRouter = require('./Routes/authRouter')
const ayahRouter = require('./Routes/ayahRouter')
const surahRouter = require('./Routes/surahRouter')
const tafseerRouter = require('./Routes/tafseerRouter')
const postRouter = require('./Routes/postRouter')
const { sequelize } = require('./Models')

app.use(express.static('./Public'))
app.use(express.json())
app.use('/api/v1/users',userRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/ayah',ayahRouter)
app.use('/api/v1/surah',surahRouter)
app.use('/api/v1/tafseer',tafseerRouter)
app.use('/api/v1/posts',postRouter)

async function main(){
    await sequelize.authenticate()
    console.log('⭐ Database connected.') 
}

main()                                                          
// const surah = await Surah.sequelize.models.Surah.findByPk(req.params.id)

app.get('/', (req,res)=> {
    res.send('Hello Golden Quran')
})

module.exports = app

// 8/11 What's done: -Get whole Surah with content✅
//                   -Get whole page from ayah✅

// 8/11 What's left: -Tafseer model with the same apis
//                   -Rest of the cruds of Surah & Ayah
//                   - Protect Middleware
//                   -BULK INSERT☠️ 💫✅ 16/11