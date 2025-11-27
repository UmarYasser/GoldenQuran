const {Surah} = require('../Models');
const {asyncErHandler} = require("./../Controllers/GlobalErrorHandler")


async function ayahConvert(ayah){
    // const surahs = await Surah.findAll({
    //     attributes:['id','name','ayatCount'],
    //     raw:true // To return plain JS objects without table overhead (perviousDataValues)
    // })
    // console.log(surahs)
    // 👇Stores the cumulative ayah count for each surah
    // const ayahArray = surahs.map(su =>{ 
    //     allAyat += su.ayatCount
    //     console.log(`"Till Surah ${su.name} (id: ${su.id})  => allAyat: ${allAyat}`)
    //     if(allAyat > ayah && !sID){
    //         sID = su.id
    //         console.log('sID inside',sID)
    //     }
    //     // ayahNumber = ayah - 
    //     return allAyat
    // })
        
            
    let allAyat =0
    let sID = null
    let ayahNumber
          
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

    // console.log(ayahArray[sID-2])   
    allAyatCDN.map((su, index) =>{
        if(ayah < su && !sID){
            console.log(`ayah Cum.: ${su}`)
            sID = index+1
            return;
        }
        // console.log(`index: ${index} su: ${su}`)
        // break;
    })

    console.log(allAyatCDN[sID-2])
    ayahNumber = ayah - allAyatCDN[sID-2]
    
    console.log(`⭐The Ayah ${ayah} corresponds to surahId ${sID}_${ayahNumber}⭐`)
}

// 364, 200 
ayahConvert(10) //SurahID = 4, ayahNumber = 87


exports.createSurah = asyncErHandler(async( req,res) =>{
    const {name,ayatCount,juzNumber,revelationPlace} = req.body;
    const surah = await Surah.create(req.body);
    res.status(201).json({
        status:"success",
        surah
    })
})

exports.getSurah = asyncErHandler(async(req,res) =>{
    try{

        const surah = await Surah.findByPk(req.params.id);
        //⭐⭐, surah.sequelize is the instance passed when creating the model
        // surah.sequelize.models access all the models, we can access ayah model and make operation on it
        const ayat = await Surah.sequelize.models.Ayah.findAll({
            where:{
                surahId: +req.params.id
            }, 
            order:[['ayahNumber','ASC']],
            include:{
                model: Surah.sequelize.models.Tafseer,
                attributes: ['text'],
                // where:{
                //    // Where the tafseer has ayahId mathcing the one returend from here
                //      ayahId: Surah.sequelize.models.Ayah.sequelize.col('Ayah.id')

                // }
            }
        })
        if(!surah){
            return res.status(404).json({
                status:"fail",
            message:"Surah not found"
        })
        }
    res.status(200).json({
        status:"success",
        surah,
        ayat,
        length: ayat.length
    })
    }catch(err){
        res.status(500).json({
            status:"error",
            message:err.message
        })
    }
})

exports.getAllSurahs = asyncErHandler(async(req,res) =>{
    const surahs = await Surah.findAll();
    res.status(200).json({
        status:"success",
        surahs
    })
})

exports.editSurah = asyncErHandler(async(req,res)=>{
    const surah = await Surah.findByPk(req.params.id);
    if(!surah){
        return res.status(404).json({
            status:"fail",
            message:"Surah not found"
        })
    }
    const updatedSurah = await surah.update(req.body);
    res.status(200).json({
        status:"success",
        surah:updatedSurah
    })
})

exports.deleteSurah = asyncErHandler(async(req,res)=>{
    // The Issue of dependency❌
    const surah = await Surah.findByPk(req.params.id);
    if(!surah){
        return res.status(404).json({
            status:"fail",
            message:"Surah not found"
        })
    }
    const deletedSurah = surah.dataValues;
    await surah.destroy();
    res.status(204).json({
        status:"success",
        message:"Surah deleted successfully",
        deletedSurah
    })
})


// How will requests from the front-end come?
// When opening an app: request a whole page => function get ayatByPage✅
// From searching on an ayah => function get ayatByPage✅
// For searchs what's the returned json object? [[Ayah Model]]
// {text, ayahNumber:, *surahName*, pageNumber(in a href)}