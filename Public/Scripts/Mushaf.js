const url = 'http://localhost:3000'
const getTr = document.getElementById("getTr")
const pgNo = document.getElementById("pageNumber")
const pageLf = document.getElementById("pageLf")
const pageRt = document.getElementById("pageRt")
var surahResult 


const today = new Date().toISOString().split('T')[0];
let overallScTime =0
let pageScTime=0;
let prevPageScTime 
let overallPagesRead =0
let LSAyah
let pageAyah
let ayahQuizResult
let stopWatch = setInterval(()=>{
    pageScTime++;
},1000)

// 👇From 2nd surah 1st ayah to 8th ayah overall, '2_1' => 8
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

// 👇Convert CDN's ayah number from 8 => 2_1, "8th ayah to 1st ayah 2nd surah"
function ayahConvertCDN(ayah){            
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
    
    allAyatCDN.map((su, index) =>{
        if(ayah < su && !sID){
            sID = index+1
            return;
        }
    })
    ayahNumber = ayah - allAyatCDN[sID-2]
    return `${sID}_${ayahNumber}`;
}

// 👇To track time and pages read [made in a fn bec it's used multiple times]
const track = async()=>{
    if(stopWatch){
        clearInterval(stopWatch)
        stopWatch = null
    }
    prevPageScTime = pageScTime
    pageScTime=0;
    stopWatch = setInterval(()=>{
        pageScTime++;
    },1000)
    
    // localStorage.setItem("prevScreenTime",prevPageScTime)
    try{
        if(prevPageScTime >=15){
            overallPagesRead +=1
        }
        overallScTime += prevPageScTime
        const reqBody = {
            date:today,
            screenTime: overallScTime,
            pagesRead: overallPagesRead
        }

        const response  = await fetch(`${url}/api/v1/trackers/editTracker`,{
            method:'PATCH',
            body:JSON.stringify(reqBody),
            headers:{ 'Content-Type': 'application/json'},
            keepalive:true // Before closing the page, finish the fetch
        })

        const result = await response.json()
        if(!response.ok){
           return console.log(`Error Fetching: ${response.statusText}`)
        }

    }catch(err){
        console.log(`Error Fetching: ${err.message}`)
    }
}



// Nav bar Section

// 👇Page loads: retrive perviously chosen data (surah, page ...) 
document.addEventListener("DOMContentLoaded",async(e)=>{
    if(pgNo.value == '')
        pgNo.value = +localStorage.pageNumber

    // I want the function the tmakes the fields pgNo enter the value so the eventlister 'input' fires
    pgNo.dispatchEvent(new Event('input'))      
    if(!localStorage["surahs"]){
        try{
            const response = await fetch(`${url}/api/v1/surah/getAllSurahs`)
             surahResult =  await response.json().surahs
            if(!response.ok){
                alert(`Surahs Fetching Failed: ${response.statusText} `)
            }
            localStorage.setItem('surahs',JSON.stringify(surahResult))
        }catch(err){
            alert(`Error Fetching Surahs: ${err.message}`)
        }
    }

    if(!localStorage.selSurahId){
        localStorage.setItem("selSurahId", 0)
    }
    surahResult = JSON.parse(localStorage["surahs"]).surahs
    document.getElementById("surahMenu").dispatchEvent(new Event("click"))
    
    
    document.getElementById("surahMenu").innerHTML = surahResult.map(sur =>{
        const htmlDiv = `<div id="s${sur.id}" class="menuBtn">
                        <p class="surahOrder">${sur.id}</p>
                        <p>${sur.name}</p>
                    </div>`
                    return htmlDiv
    }).join('')

    if(localStorage.selSurahId){
        let selSId = localStorage.selSurahId
        document.getElementById("surah").textContent = surahResult[selSId -1].name  
    }

    try{
        const response=  await fetch(`${url}/api/v1/ayah/ayahQuiz`)
        ayahQuizResult = await response.json()
        // console.log("AyaQuiz Result:",ayahQuizResult)
        document.getElementById("ayahQuizRes").innerText = ayahQuizResult.randomAyah.text.split('(')[0]
        document.getElementsByClassName('ayahQBtn')[1].innerText = ayahQuizResult.surahs.correctSurah.name
        document.getElementsByClassName('ayahQBtn')[2].innerText = ayahQuizResult.surahs.randomSurahs[0].name
        document.getElementsByClassName('ayahQBtn')[3].innerText = ayahQuizResult.surahs.randomSurahs[1].name
        document.getElementsByClassName('ayahQBtn')[4].innerText = ayahQuizResult.surahs.randomSurahs[2].name

        // The Choice Order of the answers
        let chOr = [1,2,3,4]
        for (let i = chOr.length - 1; i > 0; i--) { // ايوة من شات
            const j = Math.floor(Math.random() * (i + 1));
            [chOr[i], chOr[j]] = [chOr[j], chOr[i]];
        }


        document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(1)').style.order = `${chOr[0]}`
        document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(2)').style.order = `${chOr[1]}`
        document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(3)').style.order = `${chOr[2]}`
        document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(4)').style.order = `${chOr[3]}`
    }catch(err){
        console.log(`Error In AyaQuiz: ${err}`)
    }
})

// 👇Toggling the Surah Menu
let surahMenu = false
document.getElementById("selSurah").addEventListener('click',(e)=>{
    document.querySelectorAll('.menus').forEach(el =>{
        el.style.display = 'none'
    })// 👆If there's any other menu is open, close it
    
    surahMenu = !surahMenu // Reverse the state, if true, becomes false
    if(surahMenu){
        document.getElementById("surahMenu").style.display = 'flex'
    }
    else if(!surahMenu){
        document.getElementById("surahMenu").style.display = 'none'
    }
})

// 👇Choosing the Surah 
document.querySelector("#surahMenu").addEventListener('click',async(e)=>{   
        let selectedId
    if(e.target.closest('.menuBtn'))   //If clicked on from the surah menu
        selectedId = +e.target.closest('.menuBtn').id.split('s')[1]
    else // IF from DOMCOntentLoaded evnet listener
        selectedId = localStorage.selSurahId

    let selectedSurah = surahResult[selectedId-1]

    localStorage.setItem("selSurahId",selectedId)
    document.querySelector('#surahName #surah').textContent = selectedSurah.name
    if(e.target.closest('.menuBtn')){
        // console.log("Set Page from surah event listener")
        document.getElementById("pageNumber").value = selectedSurah.pageNumber
    }
    document.getElementById("surahMenu").style.display = 'none'
    
    pgNo.dispatchEvent(new Event('input')) //⭐ To trigger the input event to load the pages

    let htmlDiv =``
    for(let i =0;i < surahResult[selectedId-1].ayatCount;i++){
        htmlDiv += `<div id="a${i+1}" class="menuBtn">
        <div class="ayahOrder"> ${i+1} </div>
        </div>`
    }

    document.getElementById("ayahMenu").innerHTML = htmlDiv
    document.getElementById("ayahNumber").textContent = 1
    document.getElementById("juzNumber").value = +selectedSurah.juzNumber   
    let surahDataResp = await fetch(`${url}/api/v1/surah/getSurah/${selectedId}`,{ // It takes 1-based ID
        method:"GET",
        headers:{ "Content-Type":'application/json' }
    })
    
    let surahData = await surahDataResp.json()
    localStorage.setItem("selSurahData",JSON.stringify(surahData))
    // surahResult[selectedId -1].ayatCount
})

// 👇Toggling Ayah Menu
let ayahMenu = false
document.getElementById("selAyah").addEventListener("click", (e)=>{
    document.querySelectorAll('.menus').forEach(el =>{
        el.style.display = 'none'
    })// 👆If there's any other menu is open, close it
    

    ayahMenu = !ayahMenu
    if(ayahMenu){
        document.getElementById("ayahMenu").style.display = 'flex'
    } else if(!ayahMenu){
        document.getElementById("ayahMenu").style.display = 'none'
    }
})

// 👇Clicking on an ayah
document.getElementById("ayahMenu").addEventListener('click',(e)=>{
    let ayah
    if(e.target.closest('.menuBtn')){
        const ayahDiv = e.target.closest('.menuBtn')
        ayah = ayahDiv.id.split('a')[1] // id="a2" => 2
    }else{
        ayah = LSAyah || pageAyah
    }

    document.getElementById("ayahNumber").textContent = ayah
    // console.log(JSON.parse(localStorage.getItem("selSurahData")).ayat[ayah-1])
    // console.log(JSON.parse(localStorage.getItem("selSurahData")).ayat[ayah-1].pageNumber)
    pgNo.value = JSON.parse(localStorage.getItem("selSurahData")).ayat[ayah-1].pageNumber
    if(!pageAyah) // If the page event listener is calling this event, don't call the page event listener
        pgNo.dispatchEvent(new Event('input'))

    document.getElementById("ayahMenu").style.display = 'none'
})



// 👇Changing the Juz Number (Directs to the 1st surah with that juz)
document.getElementById("juzNumber").addEventListener('input', (e)=>{
    const juzNo = document.getElementById("juzNumber").value
    const firSurah = surahResult.find(su => juzNo == su.juzNumber)
    const firAyah = JSON.parse(localStorage.getItem("selSurahData")).ayat.find(ay => ay.pageNumber == firSurah.pageNumber)
    console.log(firSurah)
    pgNo.value = firAyah.pageNumber

    pgNo.dispatchEvent(new Event('input'))
})


// 👇Event that tracks the input field live when getting changed
pgNo.addEventListener('input', async(e) =>{
    const pageNo = +pgNo.value // '+' means to be converted to a number
    if(!pageNo) return 
    localStorage.setItem("pageNumber",pageNo)
    // IF the field is empty, return from the function ( Don't do anything)
    if(surahResult){ // 👇Make Surah align with the page
        let sID = localStorage.selSurahId
        //Change Surah name & Juz according the page here
        try{
        if(pageNo >= surahResult[sID-1].pageNumber && pageNo < surahResult[sID].pageNumber){
            // console.log(`Page ${pageNo} is aligned with surah ${surahResult[sID-1].name}`)
            const firAyah = JSON.parse(localStorage.selSurahData).ayat.find(ay => ay.pageNumber == pageNo)
            console.log(JSON.parse(localStorage.selSurahData))
            console.log(JSON.parse(localStorage.selSurahData).ayat)
            console.log(firAyah )
            // console.log(firAyah.ayahNumber )
            pageAyah = firAyah.ayahNumber
            LSAyah = 0
            document.getElementById("ayahMenu").dispatchEvent(new Event('click'))
        }else{
            surahResult = JSON.parse(localStorage.surahs).surahs
                let newSurah = surahResult.find(su => pageNo <  su.pageNumber) // Gets the next surah after that page
                newSurah = surahResult[newSurah.id-2] // goes the previous surah (the one that page lies in)
                console.log(`The Surah we're at is ${newSurah.name}`)
                localStorage.setItem("selSurahId", newSurah.id  )
                // console.log("Dispatching Surah Menu Click Event...")
                document.getElementById("surahMenu").dispatchEvent(new Event("click"))

    

                setTimeout(()=>{
                    let firAyah = JSON.parse(localStorage.selSurahData).ayat.find(ay => ay.pageNumber == pageNo)
                    console.log(`First Ayah in that page:`,firAyah)
                    // console.log(`First Ayah in that page:`,firAyah.ayahNumber)
                    // LSAyah = firAyah.ayahNumber
                    document.getElementById("ayahMenu").dispatchEvent(new Event('click'))
                },300)
                // document.getElementById("juzNumber").value = newSurah.juzNumber
            }
        }catch(err){
            console.log(`Error At Page/Sruah Alingment: ${err}`)
        }
    }

    // 👇The File needs some time to read the modified localStorage vars and not the old    
    setTimeout(()=>{ 
        try{ // 👇Recitation: Play the 1st ayah in that page
            const surId = localStorage.selSurahId 
            const ayId = JSON.parse(localStorage.selSurahData).ayat//.find(ay => ay.pageNumber == pageNo)
            // console.log(ayId)
            const pageAyahId = ayId.filter(ay => ay.pageNumber == pageNo) // REturns an array of ayat in that page
            ayahInPage = pageAyahId[0].ayahNumber

            const ayCon = `${surId}_${pageAyahId[0].ayahNumber}`            
            const ayahCDN = ayahConvert(ayCon)
            document.getElementById('ayahPage').value = pageAyahId[0].ayahNumber
            document.getElementById('ayahPage').min = pageAyahId[0].ayahNumber
            document.getElementById('ayahPage').max = pageAyahId[pageAyahId.length-1].ayahNumber +1

            document.getElementById("recitePlayer").src =  `https://cdn.islamic.network/quran/audio/128/ar.husary/${ayahCDN}.mp3`
            document.getElementById("recitePlayer").load()
        }catch(err){
            console.log(`Error At Recitation: ${err}`)
        }


        try{ //👇 Tafseer: Load the tafseer for that page
            const ayatInPage = JSON.parse(localStorage.selSurahData).ayat.filter(ay => ay.pageNumber == pageNo)
            // console.log(ayatInPage)
            document.getElementById("tafseerMenu").innerHTML = ayatInPage.map(ay =>{
                const html = `<div class="tafseerBtn">
                (${ay.ayahNumber}): 
                <div class="tafseerInfo" id="tf${ay.ayahNumber}">${ay.tafseer?.text}</div>
                </div>`
                return html
            }).join(' ')
        }catch(err){
            console.log(`Error At Tafsser: ${err}`)
        }
    },350)
    //👇Changing the page images
    if(pageNo % 2 ==0){ // If the requested page number is even, Ex: 26
        pageRt.src = `https://quran.ksu.edu.sa/ayat/safahat1/${+(pageNo-1)}.png` // Right page is 25
        pageLf.src = `https://quran.ksu.edu.sa/ayat/safahat1/${+(pageNo)}.png`   // Left page is 26
           tafseerMenu.style.inset = '110px auto auto 50%'
    }else if(pageNo % 2 !=0){ // If the requested page number is odd, Ex: 25
        pageRt.src = `https://quran.ksu.edu.sa/ayat/safahat1/${+(pageNo)}.png` // Right page is 25 
        pageLf.src = `https://quran.ksu.edu.sa/ayat/safahat1/${+(pageNo+1)}.png` // Left page is 26
        tafseerMenu.style.inset = '110px 50% auto auto'
    }
})

let ayahInPage =0 // Set in the page event listener to the 1st ayahNumber in the page
document.getElementById("recitePlayer").addEventListener("ended", (e)=>{
    ayahInPage++

    const finishedAyah = e.target.src.split(/\/([^/]+)\.mp3/)[1] // 2231, overall in mushaf
    const ayatPage = JSON.parse(localStorage.selSurahData).ayat.filter(ay => ay.pageNumber == pgNo.value)

    if(ayahInPage == ayatPage[ayatPage.length-1]?.ayahNumber +1){
        ayahInPage = ayatPage[0].ayahNumber
    }

    // console.log("Ayah in Page #2:",ayatPage)

    document.getElementById('ayahPage').value = ayatPage.find(ay => ay.ayahNumber == ayahInPage).ayahNumber
    
    // The Ayat in that page only
    const finishedAyahCDN = ayahConvertCDN(finishedAyah) // 2_1
    // console.log(ayatPage[ayatPage.length -1].ayahNumber + "||" + finishedAyahCDN.split('_')[1] )

    

    const nextAyah = localStorage.selSurahId + '_'  + ayatPage.find(ay => ay.ayahNumber ==ayahInPage).ayahNumber
    const nextAyahCDN = ayahConvert(nextAyah)
    // console.log(`Next Ayah to be played: ${nextAyah} , CDN format: ${nextAyahCDN}`)
    document.getElementById("recitePlayer").src  = `https://cdn.islamic.network/quran/audio/128/ar.husary/${nextAyahCDN}.mp3`
    document.getElementById("recitePlayer").load()
    document.getElementById("recitePlayer").play()
})

// 👇Changing the recitation ayah 
document.getElementById("ayahPage").addEventListener("input",(e)=>{
    const ayahNum = document.getElementById("ayahPage").value
    ayahInPage = ayahNum-1
    document.getElementById('recitePlayer').dispatchEvent(new Event('ended'))
})

// 👇Typing in the livesearch bar [🚨Needs Adjasting]
document.getElementById("liveSearch").addEventListener("input", async(e)=>{
    const searchTerm = document.getElementById("liveSearch").value
    try{

        const response = await fetch(`${url}/api/v1/ayah/liveSearch?q=${searchTerm}`,{
            method:"GET",
            headers: {"Content-Type":"application/json; charset=utf-8"}
        }
        )
        let result = await response.json()
        console.log(result)
        if(document.getElementById("liveSearch").value != 0){ // The Field isn't empty
                if(result.length ==0){ 
                    document.getElementById("LSMenu").innerHTML =  `
                    <div class="LSBtn">
                            <p class="ayahInfo" style="align-items:center"> لا يوجد نتائج</p> 
                            </div>
                            `
                document.getElementById("LSMenu").style.alignItems = 'center'
            }else{
                document.getElementById("LSMenu").innerHTML = result.ayat.map(ay=>{
                    let html = `
                    <div class="LSBtn">
                    <p class="ayahInfo" id="lsr${ay.surahId}"}> ${ay.surah.name} - الآية ${ay.ayahNumber}</p> 
                    <p style="font-size:2.2rem;align-self:center"> : </p>
                    <p class="LSresult"> ${ay.text} </p>
                    </div>
                    `
                    return html
                }).join(' ')
                document.getElementById("LSMenu").style.alignItems = ''
            }
        }else{
            document.getElementById("LSMenu").style.display = 'none'
        }

        document.getElementById("LSMenu").style.display = 'flex'
    }catch(err){
        console.log(`Error with live search: ${err}`)
    }
})

// 👇Choosing the an ayah result from livesearch
document.getElementById("LSMenu").addEventListener('click',(e)=>{
    // console.log(e.target)

    const selResult = e.target.closest('.LSBtn')
    const selId = selResult.children[0].id.split('lsr')[1]
    localStorage.setItem("selSurahId",selId)

    const ayahNum =  selResult.children[0].textContent.split('الآية')[1]
    LSAyah = ayahNum
    pageAyah =0
    document.getElementById("surahMenu").dispatchEvent(new Event('click'))

    document.getElementById("ayahMenu").dispatchEvent(new Event('click'))
    document.getElementById("LSMenu").style.display = 'none'
    // document.getElementById('surah').textContent = selSurah.name

 // محمد
})

let tafseerMenuOn = false;
const tafseerMenu = document.getElementById("tafseerMenu")
document.getElementById("tafseer").addEventListener("click",(e)=>{
    tafseerMenuOn =  !tafseerMenuOn
    if(tafseerMenuOn){
        tafseerMenu.style.display = 'flex'
        document.getElementById("tafseer").style.backgroundColor =' var(--pal1)'
        if(pgNo.value % 2 ==0 ){
            tafseerMenu.style.inset = '110px auto auto 50%'
        }else if(pgNo.value % 2 !=0 ){
            tafseerMenu.style.inset = '110px 50% auto auto'
        }
    }else{
        tafseerMenu.style.display = 'none'
        document.getElementById("tafseer").style.backgroundColor =' var(--pal3)'
    }
})


let ayahQMenu = false
document.getElementById("ayahQuiz").addEventListener("click",(e) =>{
    ayahQMenu = !ayahQMenu
    if(ayahQMenu){
        document.getElementById("ayahQuizMenu").style.display = 'flex'
    }else{
        document.getElementById("ayahQuizMenu").style.display = 'none'
    }
})


let statsMenu = false
document.getElementById("stats").addEventListener("click",(e) =>{
    statsMenu = !statsMenu
    if(statsMenu)
        document.getElementById("statsMenu").style.display = 'none'
    else if(!statsMenu)
        document.getElementById("statsMenu").style.display = 'flex'
})


// document.getElementById("ayahQMenu").addEventListener("")
// Nav Bar Section

// -----------------------

// Page Section
// 👇Flipping to the next page
document.getElementById("nextPageBtn").addEventListener("click", async(e) =>{
    // if(pgNo.value % 2 ==0){ // Even: 16 => 17
    //     pgNo.value = +pgNo.value +1
    // } else if(pgNo% 2 != 0){ // Odd: 15 => 17
    //     pgNo.value = +pgNo.value +2
    // }
    pgNo.value = +pgNo.value +1
    if(pgNo.value > 604) pgNo.value = 604
    if(pgNo.value < 1) pgNo.value = 1
    
    track()
    pgNo.dispatchEvent(new Event('input')) // activate the input field
})

// 👇Flipping to the previous page
document.getElementById("prevPageBtn").addEventListener("click",async (e) =>{
    
    // if(pgNo.value % 2 ==0){ // Even: 16 => 13
    //     pgNo.value = +pgNo.value -3
    // } else if(pgNo% 2 != 0){ // Odd: 15 => 13
    //     pgNo.value = +pgNo.value -2
    // }
    pgNo.value = +pgNo.value -1

    if(pgNo.value > 604) pgNo.value = 604
    if(pgNo.value < 1) pgNo.value = 1

    track()

    pgNo.dispatchEvent(new Event('input'))
})

// 👇Tracking before closing the session [🚨Needs Fixing]
document.addEventListener("beforeunload",async()=>{
    track() // Track time & pages read before end the session (closting the tab)
    //🌟 Any fetch request is canceled due to closing the page and data isn't sent to the back end

    // if(stopWatch){
    //     clearInterval(stopWatch)
    //     stopWatch = null
    // }
    // prevPageScTime = pageScTime
    // pageScTime=0;
    // stopWatch = setInterval(()=>{
    //     pageScTime++;
    // },1000)

    // try{
    //     if(prevPageScTime >=15){
    //         overallPagesRead +=1
    //     }
    //     overallScTime += prevPageScTime
    //     const reqBody = {
    //         date:today,
    //         screenTime: overallScTime,
    //         pagesRead: overallPagesRead
    //     }
    //     //⭐ This is why we use navigator.sendBeacon(), it's fetch but doesn't get cut off due to ending the session
    //     const response  =  navigator.sendBeacon(`${url}/api/v1/trackers/editTracker`,{
    //         method:'PATCH',
    //         body:JSON.stringify(reqBody),
    //         headers:{ 'Content-Type': 'application/json'}
    //     })
    //     localStorage.setItem("prevScreenTime",prevPageScTime)
    // }catch(err){
    //     // console.log(`Error Fetching: ${err.message}`)
    // }
})