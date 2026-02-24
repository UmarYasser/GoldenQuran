const {Ayah} = require('./../Models')
const {asyncErHandler} = require("./GlobalErrorHandler")
const { Op, Sequelize } = require('sequelize')
const qURL = 'http://api.alquran.cloud/v1'
// const CustomError = require('./../Utils/CustomError')

// Use CDN Endpoints instead of direct API calls, [FROM Quran API]
// ⭐CDNs are faster and more stable => Each user calls from the server nearest to him by contienint (North Africa) 
// ⭐Instead of calling their central server in US.
// ⭐Here you need the ayahConversion algorithm

// 👇From 8th ayah to 2nd surah 1st ayah, 8 => '2_1'
function ayahConvert(ayahStr){ 
     const allAyatCDN = [ // contains all the cumulative ayah counts for each surah
        7,   293,   493,   669,   789,   954,  1160,  1235,  1364,  1473,  // 1-10
        1596,  1707,  1750,  1802,  1901,  2029,  2140,  2250,  2348,  2483,  // 11-20
        2595,  2673,  2791,  2855,  2932,  3159,  3252,  3340,  3409,  3469,  // 21-30
        3503,  3533,  3606,  3660,  3705,  3788,  3970,  4058,  4133,  4218,  // 31-40
        4272,  4325,  4414,  4473,  4510,  4545,  4583,  4612,  4630,  4675,  // 41-50
        4735,  4784,  4846,  4901,  4979,  5075,  5104,  5126,  5150,  5163,  // 51-60
        5177,  5188,  5199,  5217,  5229,  5241,  5271,  5323,  5375,  5419,  // 61-70
        5447,  5475,  5495,  5551,  5591,  5622,  5672,  5712,  5758,  5800,  // 71-80
        5829,  5848,  5884,  5909,  5931,  5948,  5967,  5993,  6023,  6043,  // 81-90
        6058,  6079,  6090,  6098,  6106,  6125,  6130,  6138,  6146,  6157,  // 91-100
        6169,  6176,  6179,  6188,  6193,  6197,  6206,  6213,  6216,  6221,  // 101-110
        6225,  6230,  6236                                                        // 111-114
    ]  

    if(!ayahStr.includes('_')){
        return console.log("Enter a valid surah_ayah format...")
    }
    const surId = ayahStr.split('_')[0] // 3
    const ayahId = ayahStr.split('_')[1] // 1
    
    // Surah will be passed 1-based (-1) , we want the surah before it (-1)
    const surah = allAyatCDN[surId-2] // 293, the 2ns surah cumulative ayah
    const ayahRes = +surah + +ayahId // 294 ✅
    
    return ayahRes;

}

// 🌟🌟🌟 Completly Assigns all ayahs in the mushaf to their corresponding pages [using data from Quran API]
// async function completePageAssign(){
//     const response = await fetch('http://api.alquran.cloud/v1/quran/quran-uthmani')
//     const result = await response.json()
//     console.log(result.data.surahs[66])
//     console.log(result.data.surahs[0].ayahs.page)
//     result.data.surahs.map(async( su) =>{
//         su.ayahs.map(async(ay) =>{
//             const ayah = await Ayah.update({pageNumber: ay.page},
//                 {where: {surahId: su.number, ayahNumber: ay.numberInSurah}}
//             )
//         })
//     })
// }

// completePageAssign()


async function dupAyat(){
    
}
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
        length:ayat.length,
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
    const ayah = await Ayah.findOne({where: {surahId:sID, ayahNumber:aID}})

    // const response = await fetch(`${qURL}/ayah/${sID}:${aID}`)
    // const result = await response.json()
    // if(!result){

    // }
    if(!ayah){
        const surah = await Ayah.sequelize.models.Surah.findByPk(sID)
        if(surah.ayatCount < aID){
            return res.status(404).json({
                status:'fail',
                message:"This ayah isn't found"
            })
        }
            
    }
    console.log('ayah',ayah.dataValues);

    const ayasInPage = await Ayah.findAll({
        where:{pageNumber:ayah.pageNumber},
        order:[ ['surahId','ASC'], ['ayahNumber','ASC']]
    })
    
    res.status(200).json({
        status:'success',
        ayasInPage,
        pageNumber: ayah.pageNumber,
        // APIresult:result
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
    //Format text to قemove tashkeel:
    let formattedText = Ayah.sequelize.fn('regexp_replace', Ayah.sequelize.col('text'), 'ٱ', 'ا', 'g')
    formattedText = Ayah.sequelize.fn('regexp_replace', formattedText, 'ٰ', 'ا', 'g')
    formattedText = Ayah.sequelize.fn('regexp_replace', formattedText, '[أآإ]', 'ا', 'g' )
    formattedText = Ayah.sequelize.fn('regexp_replace', formattedText, '[ة]', 'ه', 'g')
    formattedText = Ayah.sequelize.fn('regexp_replace', formattedText, '[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]', '', 'g') //tashkeel
    function normalizeArabic(text) {
        
        return text
            .normalize("NFC") // important!
            .replace(/ٱ/g, 'ا')
            .replace(/ٰ/g, '')
            .replace(/[أآإ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/ـ/g, '') // remove tatweel
            .replace(/[\u064B-\u0652\u0671\u06F0-\u06F9]/g, '');
    }


    
    const ayat = await Ayah.findAll({
        where: Ayah.sequelize.where(formattedText, 'ILIKE', `%${normalizeArabic(query)}%`),
        attributes:['id','text','ayahNumber','surahId'],
        // limit:15, / Maybe...
        include:{
            model: Ayah.sequelize.models.Surah,
            as: 'surah',
            attributes:['name'],
        },
        order:[['surahId','ASC'],['ayahNumber','ASC']],
        // raw:true
    })


    if(!ayat){
        return res.status(404).json({
            status:'fail',
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
    const ayah = await Ayah.findOne({where:{surahId:req.params.surahId,ayahNumber:req.params.ayahNumber}})
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

// 🚨Make more human-like
exports.bulkPageAssign = asyncErHandler(async(req,res)=>{
    // Bulk page assignment for multiple surah/ayah range combinations
    // Req.body format: {updates: [{surahId: 1, ayat: "1_5", pageNo: 10}, ...]}
    // Or single format: {surahId: 1, ayat: "1_5", pageNo: 10}

    const updates = req.body.updates || [req.body] // Support both array and single object
    
    if(!Array.isArray(updates) || updates.length === 0){
        return res.status(400).json({
            status:'fail',
            message:"Request body must contain updates array or a single update object"
        })
    }

    const results = []
    const errors = []

    for(let i = 0; i < updates.length; i++){
        try{
            const {surahId, ayat, pageNo} = updates[i]
            
            const sID = +surahId
            const pageNumber = +pageNo
            const firAyah = +ayat.split('_')[0]
            const lstAyah = +ayat.split('_')[1]

            console.log(`Processing update ${i+1}: pageNo=${pageNumber}, surahId=${sID}, ayat=${firAyah}-${lstAyah}`);

            // Validation checks
            if( !pageNumber || !firAyah || !lstAyah || !sID ){
                errors.push({
                    index: i,
                    error:"Input must contain page number, surah ID, ayah range"
                })
                continue
            }

            if(lstAyah < firAyah){
                errors.push({
                    index: i,
                    error:"Last ayah number must be greater than first ayah number"
                })
                continue
            }

            const surah = await Ayah.sequelize.models.Surah.findByPk(sID)
            if(!surah){
                errors.push({
                    index: i,
                    error:`Surah with ID ${sID} not found`
                })
                continue
            }

            if( lstAyah > surah.ayatCount ){
                errors.push({
                    index: i,
                    error:"Last ayah number exceeds the total ayah count of the surah"
                })
                continue
            }

            // Perform the update
            const updatedAyat = await Ayah.update(
                {pageNumber: pageNumber},
                {
                    where:{
                        surahId: sID,
                        ayahNumber:{
                            [Op.between]: [firAyah,lstAyah]
                        }
                    }
                }
            )

            results.push({
                index: i,
                status:'success',
                surahId: sID,
                ayahRange: `${firAyah}-${lstAyah}`,
                pageNumber: pageNumber,
                updatedCount: updatedAyat[0]
            })
        }catch(e){
            errors.push({
                index: i,
                error: e.message
            })
        }
    }

    res.status(200).json({
        status: errors.length === 0 ? 'success' : 'partial',
        totalProcessed: updates.length,
        successCount: results.length,
        errorCount: errors.length,
        results,
        errors: errors.length > 0 ? errors : undefined
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
