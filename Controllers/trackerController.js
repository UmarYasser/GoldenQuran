const {Tracker} = require('../Models')
const {asyncErHandler} = require("./GlobalErrorHandler")
const {Op} = require("sequelize")
exports.createTracker =  asyncErHandler( async(req,res)=>{
    // Request Body: userId, date,   ❌screenTime => When created it will be zero
    // Date will be passed from the frontend, the userId will be passed from the protect MW, req.body.userId = req.user.id
    //Today's date
    
    const today = new Date().toISOString().split('T')[0];
    // Check if tracker for today doesn't exists= for the user, then create one
    // if( !( await Tracker.findOne({where:{userId:req.user.uuid,date: today}})) ){
        const tracker = await Tracker.create({userId:req.user.id,
            date:req.body?.date || today, screenTime: req.body?.screenTime, pagesRead: req.body?.pagesRead})                

    return res.status(201).json({
        status:'success',
        data:tracker
    })

})

exports.getTracker =  asyncErHandler( async(req,res) =>{
    // const {date,userId} = req.body
    const today = new Date().toISOString().split('T')[0];
    let [tracker,created] = await Tracker.findOrCreate({
        where:{userId:req.user.id,date:today}
    })

    let user = await Tracker.sequelize.models.User.findOne({
        where:{id:req.user.id},
        attributes: ['id','name','streak','longestStreak']
    })

    // if(!user){ } Handled from the protect MW
    tracker.user ={ name: user.name, streak: user.streak, longestStreak: user.longestStreak}

    // Didn't use include clause bec in 'tracker.user' in the user didn't appear in the resp as expected
    if(created){ // If the tracker is new
        console.log("Couldn't find the tracker, creating now...")
        let yesterday = new Date()
        yesterday.setDate(yesterday.getDate() -1) // Yesterday but in timestamp format
        yesterday = yesterday.toISOString().split('T')[0]
        
        const yesterdayTr = await Tracker.findOne({
            where: {date:yesterday,userId: req.user.id}
        })


        if(yesterdayTr){// If we found a tracker for that user yesterday
            user = await Tracker.sequelize.models.User.findByPk(req.user.id)
            user.streak +=1
            if( user.streak >= user.longestStreak )
                user.longestStreak = user.streak

        }else{ // Otherwise reset his streak to 1
            user.streak = 1
        }
        await user.save()
    }

    let past7 = new Date()
    past7.setDate(past7.getDate() -7)
    past7 = past7.toISOString().split('T')[0]

    let past7Tr =await Tracker.findAll({
        where: {
            date:{ [Op.between]:[past7,today] },
            userId: req.user.id
        },
        order:[ ['date','ASC'] ],
        raw:true
    })
    
    res.status(200).json({
        status:'success',
        message: created ? "Created This tracker now 👌" : undefined,
        tracker, //: tracker
        user:tracker.user,
        WeekTracker:past7Tr
    })
})

exports.getUserTrackers = asyncErHandler( async(req,res) =>{
    const {userId} = req.body
    const trackers = await Tracker.findAll({where:{userId:req.user.id}})
    if(!trackers){
        res.status(404).json({
            status:'fail',
            message:`Couldn't find trackers for ${req.user.name}...`
        })
    }

    res.status(200).json({
        status:'success',
        length:trackers.length,
        data:trackers
    })
})

exports.editTracker = asyncErHandler( async(req,res) =>{
    // Request Body/Cookie: date, userId, screenTime
    const {screenTime,pagesRead} = req.body
    const today = new Date().toISOString().split('T')[0];
   let tracker
   tracker = await Tracker.findOne({where:{userId:req.user.id,date:today}})
   let updatedUser
   if(tracker){
        tracker.screenTime += +screenTime
        tracker.pagesRead += pagesRead ? 1: 0
        await tracker.save()
        updatedUser = await Tracker.sequelize.models.User.findByPk(req.user.id)
   }else if(!tracker){ // If this tracker is new, check the streak & longestStreak
        let yesterday = new Date()
        yesterday.setDate(yesterday.getDate() -1) // Yesterday but in timestamp format
        yesterday = yesterday.toISOString().split('T')[0]
        
        tracker  = await Tracker.create({date:today,userId:req.user.id})
        const yesterdayTr = await Tracker.findOne({
            where: {date:yesterday,userId: req.user.id}
        })


        if(yesterdayTr){// If we found a tracker for that user yesterday
            updatedUser = await Tracker.sequelize.models.User.findByPk(req.user.id)
            updatedUser.streak +=1
            if( updatedUser.streak >= updatedUser.longestStreak )
                updatedUser.longestStreak = updatedUser.streak

        }else{ // Otherwise reset his streak to 1
            updatedUser.streak = 1
        }
        await updatedUser.save()

        return res.status(201).json({
            status:'status',
            message:"Created This tracker now👌",
            tracker,
            updatedUser
        })
    }
   


    //Gurenteed to be found, if not, create it now

    //👇 Check for yesterday's tracker, if found, increase user's streak by one & handle longest streak

    res.status(200).json({
        status:'success',
        data:{
            tracker,
            updatedUser
        }
    })
    
})

exports.deleteTracker = asyncErHandler( async(req,res) =>{
    const today = new Date().toISOString().split('T')[0];
    const date = req.body?.date  || today
    console.log(req.user.id)
    const tracker = await Tracker.findOne({where: {userId:req.user.id,date:date}})
    if(!tracker){
        return res.status(404).json({
            status:'fail',
            message:"Couldn't find this tracker..."
        })
    }
    
    await tracker.destroy()

    res.status(200).json({
        status:'sucess',
        deletedTracker:tracker
    })
})