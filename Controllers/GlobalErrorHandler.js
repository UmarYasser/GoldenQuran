exports.asyncErHandler = (fn) =>{
    return (req,res,next) =>{
        fn(req,res,next).catch(e => {
            console.log(`\n⭐Error from asyncErHandler:,${JSON.stringify(e)}\n`)
            next(e)
        })
    }
}