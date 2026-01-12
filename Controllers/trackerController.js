const {Tracker} = require('../Models')
const {asyncErHandler} = require("./GlobalErrorHandler")

exports.createTracker =  asyncErHandler( async(req,res)=>{
    // Request Body: userId, date,   ❌screenTime => When created it will be zero
    // Date will be passed from the frontend, the userId will be passed from the protect MW, req.body.userId = req.user.id
    //Today's date
    
    const today = new Date().toISOString().split('T')[0];
    console.log('today:',today)
    // Check if tracker for today doesn't exists= for the user, then create one
    console.log("req.user.id",req.user.id)
    // if( !( await Tracker.findOne({where:{userId:req.user.uuid,date: today}})) ){
        const tracker = await Tracker.create({userId:req.user.id,date:today})                

    return res.status(201).json({
        status:'success',
        data:tracker
    })

})

exports.getTracker =  asyncErHandler( async(req,res) =>{
    // const {date,userId} = req.body
    const today = new Date().toISOString().split('T')[0];
    let tracker = await Tracker.findOne({where:{userId:req.user.id,date:today}})
    
    if(!tracker){
        tracker = await Tracker.create({date:today,userId:req.user.id
            ,logging:console.log
        })

        return res.status(201).json({
            status:'status',
            message:"Created this tracker now👌",
            tracker
        })
    }

    res.status(200).json({
        status:'success',
        tracker //: tracker
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

    let affectedTrackers = await Tracker.update(
        { screenTime:screenTime, pagesRead:pagesRead }
        ,{
            where:{date: today, userId: req.user.id},
            returning:true,
            // logging:console.log
        }
    )
    console.log(affectedTrackers)
    // If no records updated or found in the 'where' clause
    if(affectedTrackers[0] == 0){
        const tracker  = await Tracker.create({date:today,userId:req.user.id})
        return res.status(201).json({
            status:'status',
            message:"Created This tracker now👌",
            tracker
        })
    }

    //Gurenteed to be found, if not, create it now
    const updatedTracker = await Tracker.findOne({where:
        {date: today, userId: req.user.id}})

    // console.log(rows.id)
    res.status(200).json({
        status:'success',
        data:updatedTracker
    })
    
})

exports.deleteTracker = asyncErHandler( async(req,res) =>{
    const {userId,date} = req.body
    const tracker = await Tracker.findOne({where: {userId:userId,date:date}})
    if(!tracker){
        return res.status(404).json({
            status:'fail',
            message:"Couldn't find this tracker..."
        })
    }
    
    const deletedTracker = await tracker.destroy()

    res.status(200).json({
        status:'sucess',
        deletedTracker
    })
})