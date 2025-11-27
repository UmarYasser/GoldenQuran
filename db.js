const {Pool} =  require('pg')

const pool = new Pool({
    host:'localhost',
    user:'postgres',
    password:'sql_professional',
    post:5432,
    database:'UmarDB',
    max:500,
    idleTimeoutMillis:50000,
    connectionTimeoutMillis:2000,
    options: '-c search_path=umarschema,public'
})

pool.on('error', (err) =>{
    console.log(`Error Connecting with PostgreSQL: ${err}`)
    process.exit(-1)
})

module.exports = {
    query: (text,params) =>{return pool.query(text,params)},
    pool
}