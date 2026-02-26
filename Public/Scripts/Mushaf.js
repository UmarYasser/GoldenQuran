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
let surahMenuSel
let ayahMenuSel
let ayahQuizResult
let stopWatch = setInterval(()=>{
    pageScTime++;
},1000)

// 👇 To get the 1st table in the days table
function getLastSunday(date = new Date()){
    const result = new Date(date)
    const day = result.getDay()

    const diff = (day) % 7 // 0 = Sat, 1 = Sun, ..., 6 = Fri
    result.setDate(result.getDate() - diff)
    return result;
}

// 👇 To get the dates of the current week days
function getWeekDates(date = new Date()){
    const sunday = getLastSunday()
    const week = []

    let day = new Date(sunday)
    for(let i =0;i <7;i++){
        day.setDate(sunday.getDate() + i)
        week.push(day.toISOString().split('T')[0])
    }

    return week
}

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
    let surId = ayahStr.split('_')[0] // 3
    const ayahId = ayahStr.split('_')[1] // 1
    
    if(surId >=109  )
        surId -=1
    // Surah will be passed 1-based (-1) , we want the surah before it (-1)
    const surah = allAyatCDN[surId-2] || 0 // 293, the 2ns surah cumulative ayah
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
    let addPage = false
    
    // localStorage.setItem("prevScreenTime",prevPageScTime)
    try{
        if(prevPageScTime >=15){
            addPage = true
        }
        overallScTime += prevPageScTime
        // console.log(` prevPageScTime: ${prevPageScTime}, addPage: ${addPage}, overallPagesRead: ${overallPagesRead}`)
        const reqBody = {
            date:today,
            screenTime: prevPageScTime,
            pagesRead: addPage  
        }

        const response  = await fetch(`${url}/api/v1/trackers/editTracker`,{
            method:'PATCH',
            body:JSON.stringify(reqBody),
            headers:{ 'Content-Type': 'application/json'},
            keepalive:true // Before closing the page, finish the fetch
        })

        const result = await response.json()
        // console.log("Tracker Result",result)
        if(!response.ok){
           return console.log(`Error Fetching: ${response.statusText}`)
        }

    }catch(err){
        console.log(`Error Fetching: ${err.message}`)
    }
}

// 👇Convert Number into English
const englishDigits = ['0','1','2','3','4','5','6','7','8','9'];
function toEnglish(text){ // ايوة من شات
    if(typeof text !== 'string') text = text.toString()
    return text.replace(/[\u0660-\u0669]/g, d => englishDigits[d.charCodeAt(0) - 0x0660])
}

// 👇Convert Number into Arabic
const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toArabic(text){ // ايوة من شات
    if(typeof text !== 'string') text = text.toString()
    return text.replace(/\d/g, d => arabicDigits[d])
}

function convertTextNodes(node) {
    // If it's a text node → convert
    if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = toArabic(node.nodeValue);
        return;
    }

    // If it's an element we want to skip entirely
    if (
        node.nodeType === Node.ELEMENT_NODE &&
        ['A', 'TEXTAREA', 'SCRIPT', 'STYLE'].includes(node.tagName)
    ) {
        return;
    }

    // Recurse to each child
    node.childNodes.forEach(convertTextNodes);
}
// 👆Convert Number into Arabic for the entire page


function timeFormatting(secs){

    if(secs < 60){
        return `${toArabic(secs)} ث`
    }else if(secs >60  && secs < 60*60){    // Between a min & an hour
        return `${toArabic((secs /60).toFixed(0))} د`
    }else if(secs >60*60){ // More than an hour
        return `${toArabic((secs/60/60).toFixed(0))} س`
    }
        
}

// Nav bar Section --------------------------------

// 👇Page loads: retrive perviously chosen data (surah, page ...) 
document.addEventListener("DOMContentLoaded",async(e)=>{
    if(pgNo.value == ''){ // If the user just opened the website (No localStorage Data)
        pgNo.value = +localStorage.pageNumber || 1
    }

    // The Default is open
    document.getElementById("tafseerMenu").classList.toggle('active')
    
    pgNo.dispatchEvent(new Event('input'))
    // 👇Load Surahs into localStorage, so it won't be called every refresh      
    if(!localStorage["surahs"] || localStorage["surahs"] == 'undefined'){
        try{
            const response = await fetch(`${url}/api/v1/surah/getAllSurahs`,{
                headers:{'Content-Type':'application/json'}
            })
            console.log(response)
            surahResult =  await response.json()
            surahResult = surahResult.surahs
            if(!response.ok){
                alert(`Surahs Fetching Failed: ${response.statusText} `)
            }
            localStorage.setItem('surahs',JSON.stringify(surahResult))
        }catch(err){
            alert(`Error Fetching Surahs: ${err.message}`)
        }
    }

    if(!localStorage.selSurahId){
        localStorage.setItem("selSurahId", 1)
    }
    
    surahResult = JSON.parse(localStorage["surahs"])
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

    
    try{ // 👇 Ayah Quiz
        const response=  await fetch(`${url}/api/v1/ayah/ayahQuiz`,{
            headers:{'Content-Type':'application/json'}
        })
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


        document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(2)').style.order = `${chOr[0]}`
        document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(3)').style.order = `${chOr[1]}`
        document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(4)').style.order = `${chOr[2]}`
        document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(5)').style.order = `${chOr[3]}`

        if(!localStorage.correctAQ){
            localStorage.setItem("correctAQ", 0)
        }
        if(!localStorage.wrongAQ){
            localStorage.setItem("wrongAQ", 0)
        }

        document.getElementById("correctAQ").textContent = toArabic(localStorage.correctAQ )
        document.getElementById("wrongAQ").textContent = toArabic(localStorage.wrongAQ )
    }catch(err){
        console.log(`Error In AyaQuiz: ${err}`)
    }

    try{//👇 Tracking For Stats
        const response = await fetch(`${url}/api/v1/trackers/getTracker`,{
            headers:{'Content-Type':'application/json'}
        })
        const result = await response.json()
        if(result.status == 'fail'){ // User isn't logged in
            document.getElementById("stats").style.backgroundColor = '#e24d4d'
            document.getElementById("noToken").style.display = 'block'
            document.getElementById("statsCon").style.filter = 'brightness(0.6)'
            document.getElementById("weekStats").style.filter = 'brightness(0.6)'
            document.querySelectorAll("#statsCon div span").forEach(sp =>{
                sp.textContent = '?'
            })
            
            document.querySelectorAll("#weekStats tbody tr").forEach(tr =>{ // Loops through the tr's in the tbody
                tr.childNodes[3].innerText = '?'
                tr.childNodes[5].innerText = '?'
            })
            
        }else if(result.status == 'success'){ // User is logged in
            document.getElementById("stats").style.backgroundColor = '#e0e0d2'
            document.getElementById("statsCon").style.filter = 'none'
            document.getElementById("weekStats").style.filter = 'none'

            const today = new Date().toISOString().split('T')[0]
            document.getElementById("Date").textContent = new Date().toLocaleDateString('ar-EG', {weekday:'long', year:'numeric', month:'long', day:'numeric'}) + `  ~~~ عسى الله أن يتقبل منك يا ${result.user.name} 🤲`
            // result.tracker.screenTime = timeFormatting(result.tracker.screenTime)
                
            document.getElementById("userStreak").textContent = toArabic( result.user.streak)
            document.getElementById("userLongestStr").textContent =  toArabic(result.user.longestStreak)
            document.getElementById("userPages").textContent = toArabic(result.tracker.pagesRead)
            document.getElementById("userTime").textContent = timeFormatting(result.tracker.screenTime) // Needs Formatting

            const {WeekTracker} = result
            // Get the dates from each day in the tracked week days
            let weekDatesTr = WeekTracker.map(day => day.date) .filter(date => date >=getLastSunday().toISOString().split('T')[0]) // Get the dates of the tracked days from last sat to today
            const weekDates = getWeekDates() // Get the current week dates


            const todaysName = new Date().toLocaleDateString("en-US", {weekday:'short'})

            // The Start of the week ( Sunday) in the tracker, even if the user's tracker doesn't have saturday
            const lastSunday = getLastSunday().toISOString().split('T')[0]
            const todayIdx = new Date().getDay(todaysName)
            const weeksTracker = WeekTracker.filter(day => day.date >=lastSunday) // The Days in the tracker from last sat to today

            // Loop Through the table rows of the week
            let trIdx = 0 // An iterator the tracker days, if 1st day is monday, not sunday
            document.querySelectorAll("#weekStats tbody tr").forEach((tr,index) =>{
                if(index <= todayIdx){ // If the day is today or before it, fill the data
                    if(weekDates[index] == weekDatesTr[trIdx]){ // The given day is the same of day in the tracker,
                        tr.children[1].textContent = weeksTracker[trIdx].pagesRead
                        tr.children[2].innerText = timeFormatting(weeksTracker[trIdx].screenTime)
                        trIdx++
                    }else{ // A day have passed and the user didn't track anything in it
                        tr.children[0].style.backgroundColor = '#987c6f'
                        tr.children[1].style.backgroundColor = '#987c6f'
                        tr.children[2].style.backgroundColor = '#987c6f'

                        // tr.children[0].innerText = 'x'
                        tr.children[1].innerText = 'x'
                        tr.children[2].innerText = 'x'
                    }
                    // tr.children[1].innerText = weeksTracker[index].pagesRead
                }else{ // If the day is after the today, change its color and leave the static ? mark from the html file
                    tr.children[0].style.backgroundColor = '#e0e0d2'
                    tr.children[1].style.backgroundColor = '#e0e0d2'
                    tr.children[2].style.backgroundColor = '#e0e0d2'
                }
            })
        }

    }catch(err){
        console.log(`Error From Tracking: ${err}`)
    }
    
    convertTextNodes(document.body)
    
})

// 👇Clicking on an ayah from ayah quiz
document.getElementById("ayahQuizAns").addEventListener('click', async (e)=>{
    if(e.target.closest('.ayahQBtn')){
        
        console.log(e.target.closest('.ayahQBtn'))
        const answerNode = e.target.closest('.ayahQBtn')
        if(answerNode.id == 'correctSurah'){
            answerNode.style.backgroundColor = 'green'
            localStorage.setItem("correctAQ", +localStorage.getItem("correctAQ") + 1)
            document.getElementById("correctAQ").textContent = toArabic(localStorage.getItem("correctAQ"))
        }else{
            document.getElementById('correctSurah').style.backgroundColor = 'green'
            answerNode.style.backgroundColor = 'red'
            localStorage.setItem("wrongAQ", +localStorage.getItem("wrongAQ") + 1)
            document.getElementById("wrongAQ").textContent = toArabic(localStorage.getItem("wrongAQ"))
        }

        setTimeout(async () =>{
            try{
                document.getElementById('AQBlanket').style.display = 'block'
                
                document.querySelectorAll('.ayahQBtn').forEach(btn =>{
                    btn.style.transition = 'none'
                    btn.style.backgroundColor = '#AA9585'
                    btn.style.transition = 'all 0.3s ease-in-out'
                })
                const response = await fetch(`${url}/api/v1/ayah/ayahQuiz`,{
                    headers:{'Content-Type':'application/json'}
                })

                ayahQuizResult = await response.json()
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
                
                document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(2)').style.order = `${chOr[1]}`
                document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(3)').style.order = `${chOr[2]}`
                document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(4)').style.order = `${chOr[3]}`
                document.querySelector('#ayahQuizAns .ayahQBtn:nth-child(5)').style.order = `${chOr[0]}`

                setTimeout(()=>{
                    document.getElementById('AQBlanket').style.display = 'none' 
                },800)


            }catch(err){
                console.log(`Error from New Ayah Quiz: ${err}`)
            }
        },2500)
    }
})



let haveAccount = true
// 👇Clicking on having an account
document.getElementById("haveAccount").addEventListener("click",(e)=>{
    haveAccount = !haveAccount
    if(!haveAccount){
        document.getElementById("nameCon").style.display = 'block'
        document.getElementById("nameCon").required = true

        document.getElementById("conPassCon").style.display = 'block'
        document.getElementById("conPassword").required = true
        
        document.getElementById("LogInBtn").textContent = "إنشاء حساب"
        document.getElementById("haveAccount").textContent = "لديك حساب مسبقًا؟"
    }else if(haveAccount){
        document.getElementById("nameCon").style.display = 'none'
        document.getElementById("nameCon").required = false

        document.getElementById("conPassCon").style.display = 'none'
        document.getElementById("conPassword").required = false

        document.getElementById("haveAccount").textContent = "ليس لديك حساب؟"
        document.getElementById("LogInBtn").textContent = "سجّل الدخول"
    } 
})

// 👇Logging in form
document.getElementById("loginForm").addEventListener("submit",async function(e){
    e.preventDefault()
    const formEntires = new FormData(this) // Must change the arrow function 
    const formData = Object.fromEntries(formEntires.entries())
    console.log(`Form Data: ${JSON.stringify(formData)}`)

    try{
        if(haveAccount){ // User has an account to log in with
            const response = await fetch(`${url}/api/v1/auth/login`,{
                method:"POST",
                body: JSON.stringify(formData),
                headers:{'Content-Type':'application/json'}
            })
            const result = await response.json()
            console.log(result)
            if(result.status =='success'){
                document.dispatchEvent(new Event('DOMContentLoaded'))
                document.getElementById("noToken").style.display = 'none'
            }else{ // Can be incorrect email or password
                if(result.message == 'Incorrect email or password')
                document.getElementById("resMessage").textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            }

        }else if(!haveAccount){ // User doesn't have an account to log in with
            const response = await fetch(`${url}/api/v1/auth/signUp`,{
                method:"POST",
                body:JSON.stringify(formData),
                headers:{'Content-Type':'application/json'}
            })
            const result = await response.json()
            console.log(result)
            if(result.status == 'success'){
                document.dispatchEvent(new Event('DOMContentLoaded'))
                document.getElementById("noToken").style.display = 'none'
                document.getElementById('stats').style.backgroundColor = '#e0e0d2'
            }else{
                document.getElementById("resMessage").textContent = result.message
            }
            
        }

    }catch(err){
        console.log(`Error Logging in/Signning up: ${err}`)
    }

})

// 👇Opening the Show Password Eye
let showPassword = false
document.getElementById("showPassword").addEventListener("click",(e)=>{
    showPassword = !showPassword
    if(showPassword){
        document.getElementById("password").type = 'text'
    }else if(!showPassword){
        document.getElementById("password").type = 'password'
    }
})

// 👇Opening the Show ConfirmPassword Eye
let showConPassword = false
document.getElementById("showConPassword").addEventListener("click",(e)=>{
    showConPassword = !showConPassword
    if(showConPassword){
        document.getElementById("conPassword").type = 'text'
    }else if(!showConPassword){
        document.getElementById("conPassword").type = 'password'
    }
})

// 👇Toggling the Surah Menu
document.getElementById("selSurah").addEventListener('click',(e)=>{
    document.getElementById("surahMenu").classList.toggle("active")

    if(document.getElementById("surahMenu").classList.contains("active")){
        document.querySelectorAll('.menus').forEach(el =>{
        if(el.id != 'tafseerMenu' && el.id != 'surahMenu')
            el.classList.remove('active')
        })// 👆If there's any other menu is open, close it
    }
    console.log(document.getElementById("surahMenu").classList)
})

// 👇Choosing the Surah 
document.querySelector("#surahMenu").addEventListener('click',async(e)=>{   
        let selectedId
    if(e.target.closest('.menuBtn')) {
        selectedId = +e.target.closest('.menuBtn').id.split('s')[1]
        surahMenuSel = true
    }  //If clicked on from the surah menu
    else{
        selectedId = localStorage.selSurahId
        surahMenuSel = false
    } // IF from DOMCOntentLoaded evnet listener

    let selectedSurah = surahResult[selectedId-1]

    localStorage.setItem("selSurahId",selectedId)
    document.querySelector('#surahName #surah').textContent = selectedSurah.name
    if(e.target.closest('.menuBtn')){
        // console.log("Set Page from surah event listener")
        document.getElementById("pageNumber").value = selectedSurah.pageNumber
    }
    if(surahMenuSel)
        document.getElementById("surahMenu").classList.toggle('active')


    if(e.target.closest('.menuBtn')) {
        // If a surah was clicked
        pgNo.dispatchEvent(new Event('input')) //⭐ To trigger the input event to load the pages
        selectedId = localStorage.selSurahId
        console.log("I the surah menu event and fired the page event listener")
    }
    let htmlDiv =``
    for(let i =0;i < surahResult[selectedId-1].ayatCount;i++){
        htmlDiv += `<div id="a${i+1}" class="menuBtn">
        <div class="ayahOrder"> ${toArabic(i+1)} </div>
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
    document.querySelectorAll("#menu p").forEach(p =>{
        p.textContent = p.textContent.toLocaleString('ar-EG')
    })
})

// 👇Toggling Ayah Menu
document.getElementById("selAyah").addEventListener("click", (e)=>{
    document.getElementById("ayahMenu").classList.toggle("active")
    
    if(document.getElementById("ayahMenu").classList.contains("active")){
        document.querySelectorAll('.menus').forEach(el =>{
         if(el.id != 'tafseerMenu' && el.id != 'ayahMenu')
            el.classList.remove('active')
        })// 👆If there's any other menu is open, close it
    }

})

// 👇Clicking on an ayah
document.getElementById("ayahMenu").addEventListener('click',(e)=>{
    try{
        let ayah
        if(e.target.closest('.menuBtn')){
            const ayahDiv = e.target.closest('.menuBtn')
            ayah = ayahDiv.id.split('a')[1] // id="a2" => 2
            pageAyah = null
            ayahMenuSel = true
        }else{
            ayah = LSAyah || pageAyah
        }
        document.getElementById("ayahNumber").textContent = toArabic(ayah)
        pgNo.value = JSON.parse(localStorage.getItem("selSurahData")).ayat[ayah-1].pageNumber
        if(!pageAyah){
            pgNo.dispatchEvent(new Event('input'))
        } // If the page event listener is calling this event, don't call the page event listener
    
        if(ayahMenuSel)
            document.getElementById("ayahMenu").classList.toggle('active')

    }catch(err){
        console.log(`Error at Ayah Menu: ${err.stack}`)
    }

})



// 👇Changing the Juz Number (Directs to the 1st surah with that juz)
document.getElementById("juzNumber").addEventListener('input', (e)=>{
    const juzNo = document.getElementById("juzNumber").value
    const firSurah = surahResult.find(su => juzNo == su.juzNumber)
    const firAyah = JSON.parse(localStorage.getItem("selSurahData")).ayat.find(ay => ay.pageNumber == firSurah.pageNumber)
    pgNo.value = firAyah.pageNumber

    pgNo.dispatchEvent(new Event('input'))
})


// 👇Event that tracks the input field live when getting changed
pgNo.addEventListener('input', async(e) =>{
    const pageNo = +pgNo.value // '+' means to be converted to a number
    if(!pageNo) return 
    track() // To track the time spent on the previous page before moving to the new page, across any event
    try{
        const response= await fetch(`${url}/api/v1/trackers/getTracker`,{
            headers:{'Content-Type':'application/json'},
        })

        const result = await response.json()
        if(result.status == 'success'){
            document.getElementById('userTime').textContent = timeFormatting(result.tracker.screenTime)
            document.getElementById('userPages').textContent = toArabic(result.tracker.pagesRead)
        }
    }catch(err){
        console.log(`Error Fetching Tracker: ${err}`)
    }

    localStorage.setItem("pageNumber",pageNo)
    // IF the field is empty, return from the function ( Don't do anything)
    if(surahResult){ // 👇Make Surah align with the page
        let sID = localStorage.selSurahId
        //Change Surah name & Juz according the page here
        try{
            // If the page is in the same surah it was before (Flipping pages in the same surah)
        if(pageNo >= surahResult[sID-1].pageNumber && pageNo < surahResult[sID].pageNumber){
            setTimeout(() =>{
                const firAyah = JSON.parse(localStorage.selSurahData).ayat.find(ay => ay.pageNumber == pageNo)      
                pageAyah = firAyah.ayahNumber
                LSAyah = 0
                if(!ayahMenuSel)
                    document.getElementById("ayahMenu").dispatchEvent(new Event('click'))

            },250)
        }else{
            surahResult = JSON.parse(localStorage.surahs)
                //👇 Will be filter to handle a page with several surahs
                let newSurah
                if(pageNo == 604){ // THere's no surahs with the page number higher than 604
                    newSurah = surahResult.filter(su => su.pageNumber == 604)
                }else{
                    newSurah = surahResult.find(su => pageNo <  su.pageNumber   ) // Gets the next surah after that page
                    newSurah = surahResult[newSurah.id-2]
                }
                
                if(!surahMenuSel)
                    localStorage.setItem("selSurahId",newSurah.id)

                if(newSurah.length  == 1){ // That page contains only 1 surah
                    newSurah = newSurah[0] // No need for array indexing 
                }
                document.getElementById("surahMenu").dispatchEvent(new Event("click"))
                surahMenuSel = false

                setTimeout(()=>{
                    let firAyah = JSON.parse(localStorage.selSurahData).ayat.find(ay => ay.pageNumber == pageNo)
                    if(!ayahMenuSel){
                        document.getElementById("ayahMenu").dispatchEvent(new Event('click'))
                    }
                    ayahMenuSel = false
                },300)
                // document.getElementById("juzNumber").value = newSurah.juzNumber
            }
        }catch(err){
            console.log(`Error At Page/Sruah Alingment: ${err.stack}`)
        }
    }

    // 👇The File needs some time to read the modified localStorage vars and not the old    
    setTimeout(()=>{ 
        try{ // 👇Recitation: Play the 1st ayah in that page
            const surId = localStorage.selSurahId 
            const ayId = JSON.parse(localStorage.selSurahData).ayat//.find(ay => ay.pageNumber == pageNo)
            const pageAyahId = ayId.filter(ay => ay.pageNumber == pageNo) // REturns an array of ayat in that page
            ayahInPage = pageAyahId[0].ayahNumber
            const ayCon = `${surId}_${pageAyahId[0].ayahNumber}`            
            const ayahCDN = ayahConvert(ayCon)

            document.getElementById('ayahPage').value = pageAyahId[0].ayahNumber
            document.getElementById('ayahPage').min = pageAyahId[0].ayahNumber
            document.getElementById('ayahPage').max = pageAyahId[pageAyahId.length-1].ayahNumber +1
            document.getElementById("recitePlayer").src  =  `https://cdn.islamic.network/quran/audio/128/ar.husary/${ayahCDN}.mp3`
            document.getElementById("recitePlayer").load()
        }catch(err){
            console.log(`Error At Recitation: ${err}`)
        }


        try{ //👇 Tafseer: Load the tafseer for that page
            const ayatInPage = JSON.parse(localStorage.selSurahData).ayat.filter(ay => ay.pageNumber == pageNo)
            // console.log(ayatInPage)
            document.getElementById("tafseerMenu").innerHTML = ayatInPage.map(ay =>{
                const html = `<div class="tafseerBtn">
                (${toArabic(ay.ayahNumber.toString())}): 
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
    document.querySelectorAll("#menu p").forEach(p =>{
        p.textContent = p.textContent.toLocaleString('ar-EG')
    })
})

let ayahInPage =0 // Set in the page event listener to the 1st ayahNumber in the page
document.getElementById("recitePlayer").addEventListener("ended", (e)=>{
    ayahInPage++
    const finishedAyah = e.target.src.split(/\/([^/]+)\.mp3/)[1] // 2231, overall in mushaf
    const ayatPage = JSON.parse(localStorage.selSurahData).ayat.filter(ay => ay.pageNumber == pgNo.value)

    if(ayahInPage == ayatPage[ayatPage.length-1]?.ayahNumber +1){
        ayahInPage = ayatPage[0].ayahNumber
    }


    document.getElementById('ayahPage').value = ayatPage.find(ay => ay.ayahNumber == ayahInPage).ayahNumber
    
    // The Ayat in that page only
    const finishedAyahCDN = ayahConvertCDN(finishedAyah) // 2_1

    
    const nextAyah = localStorage.selSurahId + '_'  + ayatPage.find(ay => ay.ayahNumber ==ayahInPage).ayahNumber
    const nextAyahCDN = ayahConvert(nextAyah)
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

// 👇Typing in the livesearch bar [🚨Needs Adjasting] ----- 20/2 ✅
document.getElementById("liveSearch").addEventListener("input", async(e)=>{
    const searchTerm = document.getElementById("liveSearch").value
    try{

        if(searchTerm.length > 2){ // The Field isn't empty
            const response = await fetch(`${url}/api/v1/ayah/liveSearch?q=${searchTerm}`,{
                method:"GET",
                headers: {"Content-Type":"application/json; charset=utf-8"}
            })

            document.querySelectorAll('.menus').forEach(el =>{
                if(el.id != 'tafseerMenu')
                el.classList.remove("active")
            })// 👆If there's any other menu is open, close it

            document.getElementById("LSMenu").classList.toggle("active")
            document.dispatchEvent(new Event('click'))
            let result = await response.json()

                if(result.length ==0){ 
                    document.getElementById("LSMenu").innerHTML =  `
                    <div class="LSBtn">
                            <p class="ayahInfo" style="text-align:center">لا يوجد نتائج</p> 
                    </div>
                            `
                    document.getElementById("LSMenu").style.alignItems = 'center'
                }else{
                    document.getElementById("LSMenu").style.display = 'flex'
                    document.getElementById("LSMenu").innerHTML= `<p id="LSLength">عدد النتائج: ${toArabic(result.ayat.length)}</p>`
                     let html =''
                document.getElementById("LSMenu").innerHTML += result.ayat.map(ay=>{
                    html = `
                    <div class="LSBtn">
                    <p class="ayahInfo" id="lsr${ay.surahId}"}> ${ay.surah.name} - الآية ${toArabic(ay.ayahNumber)}</p> 
                    <p style="font-size:2.2rem;align-self:center"> : </p>
                    <p class="LSresult"> ${ay.text.split('(')[0]} </p>
                    </div>
                    `
                    return html
                }).join(' ')
                document.getElementById("LSMenu").style.alignItems = ''
            }
        }else{
            document.getElementById("LSMenu").classList.remove('active')
        }

    }catch(err){
        console.log(`Error with live search: ${err}`)
    }
})

// 👇Choosing the an ayah result from livesearch
document.getElementById("LSMenu").addEventListener('click',(e)=>{
    const selResult = e.target.closest('.LSBtn')
    const selId = selResult.children[0].id.split('lsr')[1]
    localStorage.setItem("selSurahId",selId)


    const ayahNum =  toEnglish(selResult.children[0].textContent.split('الآية')[1])

    LSAyah = ayahNum
    pageAyah =0
    document.getElementById("surahMenu").dispatchEvent(new Event('click'))

    document.getElementById("ayahMenu").dispatchEvent(new Event('click'))
    document.getElementById("LSMenu").classList.toggle('active')
    // document.getElementById('surah').textContent = selSurah.name

 // محمد
})

const tafseerMenu = document.getElementById("tafseerMenu")
document.getElementById("tafseer").addEventListener("click",(e)=>{
    tafseerMenu.classList.toggle('active')
    if(tafseerMenu.classList.contains('active')){

        // document.querySelectorAll('.menus').forEach(el =>{
        //     if(el.id != 'tafseerMenu')
        //     el.classList.remove("active")
        // })// 👆If there's any other menu is open, close it

        document.getElementById("tafseer").style.backgroundColor =' var(--pal1)'
        if(pgNo.value % 2 ==0 ){
            tafseerMenu.style.inset = '110px auto auto 50%'
        }else if(pgNo.value % 2 !=0 ){
            tafseerMenu.style.inset = '110px 50% auto auto'
        }
    }else{
        document.getElementById("tafseer").style.backgroundColor =' var(--pal3)'
    }
})


document.getElementById("ayahQuiz").addEventListener("click",(e) =>{
    document.getElementById("ayahQuizMenu").classList.toggle('active')

    if(document.getElementById("ayahQuizMenu").classList.contains('active')){
        
        document.getElementById("ayahQuiz").style.backgroundColor = 'var(--pal1)'
        document.querySelectorAll('.menus').forEach(el =>{
            if(el.id != "ayahQuizMenu" && el.id != 'tafseerMenu')
                el.classList.remove('active')
        })// 👆If there's any other menu is open, close it
    }else{
        document.getElementById("ayahQuiz").style.backgroundColor = 'var(--pal3)'
    }
})


document.getElementById("stats").addEventListener("click",async (e) =>{
    document.getElementById("statsMenu").classList.toggle("active")
    
    if(document.getElementById("statsMenu").classList.contains("active")){
        if(document.getElementById("stats").style.backgroundColor != '#e24d4d')
            document.getElementById("stats").style.backgroundColor = 'var(--pal1)'


        document.querySelectorAll('.menus').forEach(el =>{
            if( el.id != 'statsMenu' && el.id != 'tafseerMenu'){
                el.classList.remove("active")
            }
        })// 👆If there's any other menu is open, close it
    }else{
        document.getElementById("stats").style.backgroundColor = 'var(--pal3)'
    }
    try{
        const response= await fetch(`${url}/api/v1/trackers/getTracker`,{
            headers:{'Content-Type':'application/json'},
        })

        const result = await response.json()
        if(result.status == 'success'){
            document.getElementById('userTime').textContent = timeFormatting(result.tracker.screenTime)
            document.getElementById('userPages').textContent = toArabic(result.tracker.pagesRead)
        }

    }catch(err){
        console.log(`Error From Stats Button: ${err.message}`)
    }
})


// document.getElementById("ayahQMenu").addEventListener("")
// Nav Bar Section

// -----------------------

// Page Section
// 👇Flipping to the next page
document.getElementById("nextPageBtn").addEventListener("click", async(e) =>{
    pgNo.value = +pgNo.value +1
    if(pgNo.value > 604) pgNo.value = 604
    if(pgNo.value < 1) pgNo.value = 1
    
    pgNo.dispatchEvent(new Event('input')) // activate the input field
 
})

// 👇Flipping to the previous page
document.getElementById("prevPageBtn").addEventListener("click",async (e) =>{
    pgNo.value = +pgNo.value -1

    if(pgNo.value > 604) pgNo.value = 604
    if(pgNo.value < 1) pgNo.value = 1


    pgNo.dispatchEvent(new Event('input'))
       try{
        const response= await fetch(`${url}/api/v1/trackers/getTracker`,{
            headers:{'Content-Type':'application/json'},
        })

        const result = await response.json()
        if(result.status == 'success'){
            document.getElementById('userTime').textContent = timeFormatting(result.tracker.screenTime)
            document.getElementById('userPages').textContent = toArabic(result.tracker.pagesRead)
        }
    }catch(err){}
})

// 👇Tracking before closing the session [🚨Needs Fixing]
window.addEventListener("beforeunload",async()=>{
    //🌟 Any fetch request is canceled due to closing the page and data isn't sent to the back end
    
    let addPage = false
    try{
        if(pageScTime >=15){
            addPage = true
        }
        const reqBody = {
            date:today,
            screenTime: +pageScTime || 0,
            pagesRead: addPage ? 1 : 0
        }

        const blob = new Blob(
            [JSON.stringify(reqBody)], 
            { type: "application/json" }
        );
        //⭐ This is why we use navigator.sendBeacon(), it's fetch but doesn't get cut off due to ending the session
        navigator.sendBeacon(`${url}/api/v1/trackers/beaconEditTracker`,blob)
    }catch(err){
        console.log(`Error Fetching: ${err.message}`)
    }
})


document.getElementById("menuX").addEventListener("click",e =>{
    // console.log(e.target.closest('#menu'))
    const menuWrapper = e.target.closest("#menu")
    const menuDiv = menuWrapper.querySelectorAll('.menus')
    menuDiv.forEach( div =>{
        if(div.id != 'tafseerMenu' && div.classList.contains('active'))
            div.classList.toggle('active')
    })
})



// menus.forEach(el => {
//   const observer = new MutationObserver((mutations) => {
//     mutations.forEach(mutation => {
//       if (mutation.attributeName === "class") {
//         if(el.id != 'tafseerMenu'){
            
//         }
//       }
//     });
//   });

//   observer.observe(el, {
//     attributes: true,
//     attributeFilter: ["class"]
//   });
// });

document.addEventListener('click', e =>{
    const menus = document.querySelectorAll('.menus');
    let activeMenu = false
    menus.forEach(el =>{
        if(el.classList.contains('active') && el.id != 'tafseerMenu' && el.id != 'menuX'){
            console.log(`The Active Menu: ${el.id}`)
            activeMenu = true
        }
    })
    if(activeMenu)
        document.getElementById("menuX").classList.add('active')
    else
        document.getElementById("menuX").classList.remove('active')
})