// Uncaught Exeption Er Handler

const dotenv = require('dotenv');
dotenv.config({path:'config.env',quiet:true});
const app = require('./app')
const PORT = process.env.PORT || 3000;

// Unresolved Rejection Er handler

const server = app.listen(PORT, ()=>{
    console.log('------------------\nServer listeing on PORT 3000')
})