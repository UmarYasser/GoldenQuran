const {Pool} =  require('pg')

const pool = new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    post:5432,
    database: process.env.SQL_DB,
    max:500,
    idleTimeoutMillis:50000,
    connectionTimeoutMillis:2000,
    // options: '-c search_path=umarschema,public'
})


pool.on('error', (err) =>{
    console.log(`Error Connecting with PostgreSQL: ${err}`)
    process.exit(-1)
})

module.exports = {
    query: (text,params) =>{return pool.query(text,params)},
    pool
}