const {Ayah} = require('./../Models')
const {asyncErHandler} = require("./GlobalErrorHandler")
const { Op, Sequelize } = require('sequelize')
const qURL = 'http://api.alquran.cloud/v1'
// const CustomError = require('./../Utils/CustomError')

// Use CDN Endpoints instead of direct API calls, [FROM Quran API]
// ⭐CDNs are faster and more stable => Each user calls from the server nearest to him by contienint (North Africa) 
// ⭐Instead of calling their central server in US.
// ⭐Here you need the ayahConversion algorithm


exports.createAyah =  asyncErHandler(async(req,res) =>{
    
    const ayah = await Ayah.create(req.body)
    res.status(201).json({
        status:"success",
        ayah
    })
})

//🔖API
exports.getAllAyat = asyncErHandler(async(req,res)=>{

    const ayat = await Ayah.findAll({
        order:[['surahId','ASC'],['ayahNumber','ASC']]
    })

    res.status(200).json({
        status:'success',
        ayat
    })
})

//🔖API
// Request ayah, return all ayat in the that page
exports.getAyahPage = asyncErHandler(async(req,res) =>{
    // 2 things should be passed, surahID and ayahNumber
    // ayah/getAyahPage?sa=1_6 ==> surah 1, ayah 6 : اهدنا الصراط...
    if(!req.query.sa){
        return res.status(400).json({
            status:'fail',
            message:"Provide surahID and ayahNumber in query string like ?sa=1_6"
        })

    }
    const sID = req.query.sa.split('_')[0] //1
    const aID = req.query.sa.split("_")[1] //6

    console.log('sID',sID);
    console.log('aID',aID);
    // const ayah = await Ayah.findOne({where: {surahId:sID, ayahNumber:aID}})

    const response = await fetch(`${qURL}/ayah/${sID}:${aID}`)
    const result = await response.json()
    // if(!result){

    // }
    // if(!ayah){
    //     const surah = await Ayah.sequelize.models.Surah.findByPk(sID)
    //     if(surah.ayatCount < aID){
    //         return res.status(404).json({
    //             status:'fail',
    //             message:"This ayah isn't found"
    //         })
    //     }
            
    // }
    // console.log('ayah',ayah.dataValues);

    // const ayasInPage = await Ayah.findAll({
    //     where:{pageNumber:ayah.pageNumber},
    //     order:[ ['surahId','ASC'], ['ayahNumber','ASC']]
    // })
    
    res.status(200).json({
        status:'success',
        // ayasInPage,
        // pageNumber: ayah.pageNumber,
        APIresult:result
    })
    //👇Result from the API
    /*"APIresult": {
        "code": 200,
        "status": "OK",
        "data": {
            "number": 6, // const text = APIresult.data.text
            "text": "Guide us the straight way.",
            "edition": {
                "identifier": "en.asad",
                "language": "en",
                "name": "Asad",
                "englishName": "Muhammad Asad",
                "format": "text",
                "type": "translation",
                "direction": "ltr"
            },
            "surah": {
                "number": 1,
                "name": "سُورَةُ ٱلْفَاتِحَةِ",
                "englishName": "Al-Faatiha",
                "englishNameTranslation": "The Opening",
                "numberOfAyahs": 7,
                "revelationType": "Meccan"
            },
            "numberInSurah": 6,
            "juz": 1,
            "manzil": 1,
            "page": 1,
            "ruku": 1,
            "hizbQuarter": 1,
            "sajda": false
        }
    } */
})

//🔖API
// Request Page, return the first ayah in that page
exports.getPageAyah = asyncErHandler( async(req,res) => {
    // Request URL: /GQ/page/5
    // Request URL: /GQ/page/:page

    const page =  +req.params.page
    const firAyah = await Ayah.findOne({
        where: {pageNumber:page},
        attributes: ['id','text','pageNumber']
    })

    if(!firAyah || page > 604 || page < 1 ){
        return res.status(404).json({
            status:'fail',
            message: 'No Page was found, Quran pages are between 1 & 604 only...'
        })
    }

    res.status(200).json({
        status:'success',
        firAyah,
        pageNumber: firAyah.pageNumber
    })

})

//🔖API
exports.searchAyah = asyncErHandler( async(req,res)=>{
    const query = req.query.q
    console.log('query',query);
    //Format text to temove tashkeel:
    let formattedText = Ayah.sequelize.fn('regexp_replace', Ayah.sequelize.col('text'), 'ٱ', 'ا', 'g')
    formattedText = Ayah.sequelize.fn('regexp_replace', formattedText, 'ٰ', 'ا', 'g')
    formattedText = Ayah.sequelize.fn('regexp_replace', formattedText, '[أآإ]', 'ا', 'g' )
    formattedText = Ayah.sequelize.fn('regexp_replace', formattedText, '[ة]', 'ه', 'g')
    formattedText = Ayah.sequelize.fn('regexp_replace', formattedText, '[\u064B-\u0652\u0671\u06F0-\u06F9]', '', 'g') //tashkeel
    const ayat = await Ayah.findAll({
        where: Ayah.sequelize.where(formattedText, 'LIKE', `%${query}%`),
        attributes:['id','text','ayahNumber','surahId'],
        // limit:15, / Maybe...
        include:{
            model: Ayah.sequelize.models.Surah,
            as: 'surah',
            attributes:['name'],
            // where:{
            //     id: Ayah.sequelize.col('Ayah.surahId')
            // }
            // It should know what column to link with => no where clause
        },
        order:[['surahId','ASC'],['ayahNumber','ASC']]
    })

    if(!ayat){
        return res.status(404).json({
            message:'fail',
            message:'No Result found'
        })
    }

    res.status(200).json({
        status:'success',
        length: ayat.length,
        ayat
    })
})


exports.deleteAyah = asyncErHandler(async(req,res) =>{
    // /api/v1/ayah/:surahId/:ayahNumber
    const ayah = await Ayah.findOne({
        where:{surahId:req.params.surahId,
                ayahNumber:req.params.ayahNumber} })
    
    // if(ayah)
    //     console.log('ayah',ayah.dataValues)
    
    if(!ayah){
        return res.status(404).json({
            status:'fail',
            message:"Ayah not found"
        })
    }
    
    const deletedAyah = ayah.dataValues
    await ayah.destroy()
    res.status(202).json({
        status:'success',
        message:"Ayah deleted successfully",
        deletedAyah
    })
})

exports.editAyah =  asyncErHandler(async(req,res)=>{
    const ayah = await Ayah.findOne({surahId:req.params.surah,ayahNumber:req.params.ayahNumber})
    if(!ayah){
        return res.status(404).json({
            status:'fail',
            message:"Ayah not found"
        })
    }

    const updatedAyah = await ayah.update(req.body)
    res.status(200).json({
        status:'success',
        ayah:updatedAyah
    })
})

//⭐⭐
exports.bulkCreateAyah = async(req,res)=>{
    // req.body should be an array of ayah objects
    // Ayat will be passed as a huge string and must be seprated by the (n), n being the ayah number 
    // Will be split into an array of course, and must make a counter to make ayahNumber match the number in the ayah
    
    try{

        const surahId = parseInt(req.params.surahId,10) || 2; // Example surahId
        let {ayahString} = req.body
        const ayahArray = ayahString.trim()
        //                                                                0123456789
        .split(/\(\d+\)/) // Split on any seq. of numbers with the () ==> aasda(10)asdasdasd Is removed
        .filter(ay => ay != '') // Remove the empty array element found after the split
        
        console.log('ayahArray',ayahArray)
        
        ayahString = ayahString.trim()
        const opBr = ayahString.indexOf('(') // 5
        const clBr = ayahString.indexOf(')') // 8    Get the position of the first ayah end number
        const ayahNum = ayahString.substring(opBr+1,clBr) // [6,8[
        //                                    6       8 (Excluded)
        console.log('opBr',opBr);
        console.log('ayahString[opBr]',ayahString[opBr]);
        let ayahCounter = parseInt(ayahNum) // Ex: 10
        
        
        var surah = await Ayah.sequelize.models.Surah.findByPk(surahId)
        let arrayObj = ayahArray.map((aya)=>{
            aya += `(${ayahCounter++})`
            return{
                surahId: surahId,
                text: aya,  
                pageNumber: surah.pageNumber, // Example logic for page number
                ayahNumber: ayahCounter -1 // Because it was incremented after being used
            }
        })
        console.log('ayahArray#2',ayahArray)
        console.log('ayahObj',arrayObj)
        
        const ayatDB = await Ayah.bulkCreate(arrayObj,{validate:true, ignoreDuplicates:true})
        console.log('ayatDB', ayatDB)
        
        res.status(201).json({
            status:'success',
            ayatDB
        })
    }catch(e){
        console.log("Error:",e)
    }
}

exports.bulkPageAssign = asyncErHandler(async(req,res)=>{
    // url: /bulkPageAss/:pageNo in req.params
    // url: /bulkPageAss/1
    // Req.body: {surahId: 1, ayat: 1_5} 
    const pageNo =  +req.params.pageNo // 1
    const firAyah =  +req.body.ayat.split('_')[0] // 1
    const lstAyah =  +req.body.ayat.split('_')[1] // 5
    const sID =  +req.body.surahId // 1

    console.log('pageNo',pageNo);
    console.log('firAyah',firAyah);
    console.log('lstAyah',lstAyah);

    if( !pageNo || !firAyah || !lstAyah || !sID ){
        return res.status(400).json({
            status:'fail',
            message:"Input must contain page number, surah ID, ayah range"
        })
    }

    if(lstAyah < firAyah){
        return res.status(400).json({
            status:'fail',
            message:"Last ayah number must be greater than first ayah number"
        })
    }

    if( lstAyah > (await Ayah.sequelize.models.Surah.findByPk(sID)).ayatCount ){
        return res.status(400).json({
            status:'fail',
            message:"Last ayah number exceeds the total ayah count of the surah"
        })
    }

    const ayat = await Ayah.update(
        {pageNumber: pageNo}, // Change this col.
        {
            where:{
                surahId: sID,
                ayahNumber:{
                    [Op.between]: [firAyah,lstAyah]
                }
            }
        }
    )
    res.status(200).json({
        status:'success',
        ayat
    })
})

//🔖API
exports.ayahQuiz = asyncErHandler(async(req,res)=>{
    // Get random ayah from DB
    const randomAyah = await Ayah.findOne({
        order: Sequelize.literal('RANDOM()'),
        attributes:['id','text','surahId','ayahNumber']
    })

    const correctSurah = await Ayah.sequelize.models.Surah.findByPk(randomAyah.surahId,{
        attributes: ['id','name']
    })

    const randomSurahs = await Ayah.sequelize.models.Surah.findAll({
        where:{ // There ID doesn't match the ayah's surahId
            id:{[Op.ne]: randomAyah.surahId}
        },
        attributes: ['id','name'],
        limit:3,
        order: Sequelize.literal('RANDOM()')
    })

    const surahs = {correctSurah, randomSurahs}
    res.status(200).json({
        status:'success',
        randomAyah,
        surahs
    })

})



//🔖 Pass-through Methods => Called firectly from the front-end
// => Get Audio for Ayah/Surah from CDN

// Problem Till Fajr: Make the ayahCounter get the inital number from the first ayah number it finds
// Ex : الٓمٓ (1) ذَٰلِكَ ٱلۡكِتَٰبُ... ==> The counter should start from 1✅✅
