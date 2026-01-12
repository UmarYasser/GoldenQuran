const router = require('express').Router()

const fs = require('fs')
const Mushaf = fs.readFileSync('./Public/Pages/Mushaf.html')
const Login = fs.readFileSync('./Public/Pages/Login.html')


const sendPage = (page) =>{
    return (req,res) =>{
        res.setHeader("Content-Type",'text/html')
        res.end(page)
    }
}

router.get("/Mushaf.html", sendPage(Mushaf))
router.get("/",sendPage(Login))
module.exports = router