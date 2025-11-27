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


// `
// ( 38 )   قال الله لهم: اهبطوا من الجنة جميعًا، وسيأتيكم أنتم وذرياتكم المتعاقبة ما فيه هدايتكم إلى الحق. فمن عمل بها فلا خوف عليهم فيما يستقبلونه من أمر الآخرة ولا هم يحزنون على ما فاتهم من أمور الدنيا.
// ( 39 )   والذين جحدوا وكذبوا بآياتنا المتلوة ودلائل توحيدنا، أولئك الذين يلازمون النار، هم فيها خالدون، لا يخرجون منها.
// ( 40 )   يا ذرية يعقوب اذكروا نعمي الكثيرة عليكم، واشكروا لي، وأتموا وصيتي لكم: بأن تؤمنوا بكتبي ورسلي جميعًا، وتعملوا بشرائعي. فإن فعلتم ذلك أُتمم لكم ما وعدتكم به من الرحمة في الدنيا، والنجاة في الآخرة. وإيَّايَ -وحدي- فخافوني، واحذروا نقمتي إن نقضتم العهد، وكفرتم بي.
// ( 41 )   وآمنوا- يا بني إسرائيل- بالقرآن الذي أنزَلْتُه على محمد نبي الله ورسوله، موافقًا لما تعلمونه من صحيح التوراة، ولا تكونوا أول فريق من أهل الكتاب يكفر به، ولا تستبدلوا بآياتي ثمنًا قليلا من حطام الدنيا الزائل، وإياي وحدي فاعملوا بطاعتي واتركوا معصيتي.
// ( 42 )   ولا تخلِطوا الحق الذي بيَّنته لكم بالباطل الذي افتريتموه، واحذروا كتمان الحق الصريح من صفة نبي الله ورسوله محمد صلى الله عليه وسلم التي في كتبكم، وأنتم تجدونها مكتوبة عندكم، فيما تعلمون من الكتب التي بأيديكم.
// ( 43 )   وادخلوا في دين الإسلام: بأن تقيموا الصلاة على الوجه الصحيح، كما جاء بها نبي الله ورسوله محمد صلى الله عليه وسلم، وتؤدوا الزكاة المفروضة على الوجه المشروع، وتكونوا مع الراكعين من أمته صلى الله عليه وسلم.
// ( 44 )   ما أقبح حالَكم وحالَ علمائكم حين تأمرون الناس بعمل الخيرات، وتتركون أنفسكم، فلا تأمرونها بالخير العظيم، وهو الإسلام، وأنتم تقرءون التوراة، التي فيها صفات محمد صلى الله عليه وسلم، ووجوب الإيمان به!! أفلا تستعملون عقولكم استعمالا صحيحًا؟
// ( 45 )   واستعينوا في كل أموركم بالصبر بجميع أنواعه، وكذلك الصلاة. وإنها لشاقة إلا على الخاشعين.
// ( 46 )   الذين يخشون الله ويرجون ما عنده، ويوقنون أنهم ملاقو ربِّهم جلَّ وعلا بعد الموت، وأنهم إليه راجعون يوم القيامة للحساب والجزاء.
// ( 47 )   يا ذرية يعقوب تذكَّروا نعمي الكثيرة عليكم، واشكروا لي عليها، وتذكروا أني فَضَّلْتكم على عالَمي زمانكم بكثرة الأنبياء، والكتب المنزَّلة كالتوراة والإنجيل.
// ( 48 )   وخافوا يوم القيامة، يوم لا يغني أحد عن أحد شيئًا، ولا يقبل الله شفاعة في الكافرين، ولا يقبل منهم فدية، ولو كانت أموال الأرض جميعًا، ولا يملك أحد في هذا اليوم أن يتقدم لنصرتهم وإنقاذهم من العذاب.

// `


// `
// "tafseerString":"المعانيعربي - التفسير الميسر( 1 )   هذه الحروف وغيرها من الحروف المقطَّعة في أوائل السور فيها إشارة إلى إعجاز القرآن؛ فقد وقع به تحدي المشركين، فعجزوا عن معارضته، وهو مركَّب من هذه الحروف التي تتكون منها لغة العرب. فدَلَّ عجز العرب عن الإتيان بمثله -مع أنهم أفصح الناس- على أن القرآن وحي من الله.( 2 )   ذلك القرآن هو الكتاب العظيم الذي لا شَكَّ أنه من عند الله، فلا يصح أن يرتاب فيه أحد لوضوحه، ينتفع به المتقون بالعلم النافع والعمل الصالح وهم الذين يخافون الله، ويتبعون أحكامه.( 3 )   وهم الذين يُصَدِّقون بالغيب الذي لا تدركه حواسُّهم ولا عقولهم وحدها؛ لأنه لا يُعْرف إلا بوحي الله إلى رسله، مثل الإيمان بالملائكة، والجنة، والنار، وغير ذلك مما أخبر الله به أو أخبر به رسوله، (والإيمان: كلمة جامعة للإقرار بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره، وتصديق الإقرار بالقول والعمل بالقلب واللسان والجوارح) وهم مع تصديقهم بالغيب يحافظون على أداء الصلاة في مواقيتها أداءً صحيحًا وَفْق ما شرع الله لنبيه محمد صلى الله عليه وسلم، ومما أعطيناهم من المال يخرجون صدقة أموالهم الواجبة والمستحبة.( 4 )   والذين يُصَدِّقون بما أُنزل إليك أيها الرسول من القرآن، وبما أنزل إليك من الحكمة، وهي السنة، وبكل ما أُنزل مِن قبلك على الرسل من كتب، كالتوراة والإنجيل وغيرهما، ويُصَدِّقون بدار الحياة بعد الموت وما فيها من الحساب والجزاء، تصديقا بقلوبهم يظهر على ألسنتهم وجوارحهم وخص يوم الآخرة؛ لأن الإيمان به من أعظم البواعث على فعل الطاعات، واجتناب المحرمات، ومحاسبة النفس.( 5 )   أصحاب هذه الصفات يسيرون على نور من ربهم وبتوفيق مِن خالقهم وهاديهم، وهم الفائزون الذين أدركوا ما طلبوا، ونَجَوا من شرِّ ما منه هربوا.    "
// `