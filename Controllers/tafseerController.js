const { RAW } = require('sequelize/lib/query-types')
const {Tafseer} = require('./../Models')
const {asyncErHandler} = require('./GlobalErrorHandler')
const {Op} = require('sequelize')

exports.createTafseer = asyncErHandler(async(req,res)=>{
    //Pass the tafseerNumber&surahId, let the model find the ayah them pass the ayah's id from it
    // Request: (Id:DEFAULT), text:req.body, surahID&ayahNumber: RouteParam <= Similar to the real website⭐
    //Example: createTafseer/3_20 => For Surah with Id 3 and ayahNumber 20
    const {text} = req.body
    const sID = parseInt( req.params.sa.split('_')[0]) // 3, From the Ex.
    const aID = parseInt( req.params.sa.split('_')[1]) // 20 From the Ex.
    console.log('sID: ', sID, "aID: ", aID)
    const ayah =  await Tafseer.sequelize.models.Ayah.findOne({ where:{surahId: sID, ayahNumber:aID}})

    if(!ayah){
        return res.status(404).json({
            status:'fail',
            message:`No Ayah was found with Surah ID ${sID} & Ayah ID ${aID}`
        })
    }

    const tafseer = await Tafseer.create({text,ayahId:ayah.id})
    res.status(201).json({
        status:'success',
        tafseer
    })


})

//🔖API
exports.getTafseer = asyncErHandler(async(req,res)=>{
    // Request: /1_3
    const sID = parseInt( req.params.sa.split('_')[0]) // 1, From the Ex.
    const aID = parseInt( req.params.sa.split('_')[1]) // 3 From the Ex.
    const ayah =  await Tafseer.sequelize.models.Ayah.findOne({ where:{surahId: sID, ayahNumber:aID}})
    if(!ayah){
        return res.status(404).json({
            status:'fail',
            message:`No Ayah was found with Surah ID ${sID} & Ayah ID ${aID}`
        })
    }
    const tafseer = await Tafseer.findOne({where:{ayahId:ayah.id}})
    if(!tafseer){
        return res.status(404).json({
            status:'fail',
            message:`No Tafseer was found for Ayah Number ${aID} in Surah ID ${sID}`
        })
    }
    res.status(200).json({
        status:'success',
        tafseer
    })
})

exports.updateTafseer = asyncErHandler(async(req,res)=>{
    // To be implemented later
    const sID = parseInt( req.params.sa.split('_')[0]) // 1, From the Ex.
    const aID = parseInt( req.params.sa.split('_')[1]) // 3 From the Ex.
    const ayah =  await Tafseer.sequelize.models.Ayah.findOne({ where:{surahId: sID, ayahNumber:aID}})
    if(!ayah){
        return res.status(404).json({
            status:'fail',
            message:`No Ayah was found with Surah ID ${sID} & Ayah ID ${aID}`
        })
    }
    const updatedTafseer=  await Tafseer.update(req.body,{where:{ayahId:ayah.id},returning:true})
    res.status(200).json({
        status:'success',
        updatedTafseer
    })
})

exports.deleteTafseer = asyncErHandler(async(req,res)=>{
    // To be implemented later
    const sID = parseInt( req.params.sa.split('_')[0]) // 1, From the Ex.
    const aID = parseInt( req.params.sa.split('_')[1]) // 3 From the Ex.
    const ayah =  await Tafseer.sequelize.models.Ayah.findOne({ where:{surahId: sID, ayahNumber:aID}})
    if(!ayah){
        return res.status(404).json({
            status:'fail',
            message:`No Ayah was found with Surah ID ${sID} & Ayah ID ${aID}`
        })
    }
    const deletedTafseer = await Tafseer.destroy({where:{ayahId:ayah.id}})
    res.status(200).json({
        status:'success',
        deletedTafseer
    })
})

//Bulk Insert Tafseer....☠️
exports.bulkCreateTafseer = asyncErHandler( async(req,res)=>{
    try{
        // Request Params: /bulkCreate/:surahId/:ayahRange
        // Request Params: /bulkCreate/2/6_10 =? From ayah 6 to 10 from surahId 2 bind these tafseers to each one
       const firayah = +req.params.ayahRange.split('_')[0]; // Example surahId
       const lstayah = +req.params.ayahRange.split('_')[1]; // Example surahId
       const surahId = +req.params.surahId; // Example surahId

        const ayat = await Tafseer.sequelize.models.Ayah.findAll({
            where:{
                surahId: surahId,
                ayahNumber: { [Op.between]: [firayah,lstayah] }
            },// Only the ayat in the range of the wanted AND the surahId
            attributes: ['id','text','ayahNumber'], // For Query Performance
            order: [['id','ASC']],
            raw:true // ⭐ To return the instance without all the overhead like 'previousDateValues'
        })

        const ayahArray = ayat.map(a => a.id)
        console.log('ayat',ayat)
        console.log('ayat',ayahArray)
        let {tafseerString} = req.body
        const tafseerArray = tafseerString.trim() // Remove any whitespace before or after the string
        .split(/\( \d+ \)/) // Split on any seq. of numbers with the () ==> aasda(10)asdasdasd Is removed
        .filter(tf => tf != '') // Remove the empty array element found after the split
        
        console.log('firAyah',firayah)
        console.log('lastAyah',lstayah)
        console.log('tafseerAyah',tafseerArray)
        
        tafseerString = tafseerString.trim()
        const opBr = tafseerString.indexOf('(') // 5
        const clBr = tafseerString.indexOf(')') // 8    Get the position of the first tafseer end number
        const tafseerNum = tafseerString.substring(opBr+1,clBr) // [6,8[
        //                                    6       8 (Excluded)
        console.log('opBr',opBr);
        console.log('tafseerString[opBr]',tafseerString[opBr]);
        let tafseerCounter = parseInt(tafseerNum) // Ex: 10
        
        
        // var surah = await Tafseer.sequelize.models.Surah.findByPk(surahId)
        let arrayObj = tafseerArray.map((tf,index)=>{
            tf += `(${tafseerCounter++})`
            return {
                ayahId: ayahArray[index], // Match the ayah in the range to the tafseer by index
                text: tf,  
            }
        })
        console.log('tafseerArray#2',tafseerArray)
        console.log('tafseerObj',arrayObj)
        
        const tafseerDB = await Tafseer.bulkCreate(arrayObj)
        console.log('tafseerDB', tafseerDB)
        
        res.status(201).json({
            status:'success',
            tafseerDB
        })
    }catch(e){
        console.log("Error:",e)
    }
})

