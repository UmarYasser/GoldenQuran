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
let stopWatch = setInterval(()=>{
    pageScTime++;
},1000)

document.addEventListener("DOMContentLoaded",async(e)=>{
    if(pgNo.value == ''){
        pgNo.value = localStorage.pageNumber
    }
    // I want the function the tmakes the fields pgNo enter the value so the eventlister 'input' fires
    pgNo.dispatchEvent(new Event('input'))      
    if(!localStorage["surahs"]){
        try{
            const response = await fetch(`${url}/api/v1/surah/getAllSurahs`)
             surahResult =  await response.json()
            console.log(result)
            if(!response.ok){
                alert(`Surahs Fetching Failed: ${response.statusText} `)
            }
            localStorage.setItem('surahs',JSON.stringify(surahResult.surahs))
        }catch(err){
            alert(`Error Fetching Surahs: ${err.message}`)
        }
    }
    surahResult = JSON.parse(localStorage["surahs"])
    console.log("Fetching Surahs")
    document.getElementById("surahMenu").innerHTML = surahResult.surahs.map(sur =>{
        const htmlDiv = `<div id="s${sur.id}" class="menuBtn">
                        <p class="surahOrder">${sur.id}</p>
                        <p>${sur.name}</p>
                    </div>`
                    return htmlDiv
    }).join('')
})

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
    
    localStorage.setItem("prevScreenTime",prevPageScTime)
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
        console.log(JSON.stringify(reqBody))
        const result = await response.json()
        if(!response.ok){
           return console.log(`Error Fetching: ${response.statusText}`)
        }
        console.log(`Result From Back-end:`,result)

    }catch(err){
        console.log(`Error Fetching: ${err.message}`)
    }
}

// 👇Toggling the Surah Menu
let surahMenu = false
document.getElementById("selSurah").addEventListener('click',(e)=>{
    surahMenu = !surahMenu // Reverse the state, if true, becomes false
    if(surahMenu){
        document.getElementById("surahMenu").style.display = 'flex'
    }
    else if(!surahMenu){
        document.getElementById("surahMenu").style.display = 'none'
    }
})

// 👇Choosing the Surah 
document.querySelector("#surahMenu").addEventListener('click',(e)=>{
    console.log(e.target.closest('.menuBtn'))
    let selectedId = e.target.closest('.menuBtn').id.split('s')[1]
    
    let selectedSurah = surahResult.surahs[selectedId-1]
    
    document.querySelector('#surahName #surah').textContent = selectedSurah.name
    document.getElementById("pageNumber").value = selectedSurah.pageNumber
    pgNo.dispatchEvent(new Event('input'))
    document.getElementById("surahMenu").style.display = 'none'
    document.getElementById("ayahMenu").innerHTML = ``
    // surahResult.surahs[selectedId -1].ayatCount
})

// getTr.addEventListener("click",async(e) =>{
//     try{
//        const response = await fetch(`${url}/api/v1/trackers/getTracker`,{
//             headers:{ 'Content-Type':'application/json'}
//        })
//        const result = await response.json()
       
//        if(!response.ok){
//             console.log(`Error Fetching: ${response.statusText}`)
//         }
//         console.log("Result:",result)
//         overallPagesRead = result.tracker.pagesRead
//     }catch(err){
//         console.log(`Error Fetching: ${err.message}`)
        
//     }
// })

// Event that tracks the input field live when getting changed


pgNo.addEventListener('input', async(e) =>{
    const pageNo = +pgNo.value // '+' means to be converted to a number
    if(!pageNo) return // IF the field is empty, return from the function ( Don't do anything)
    localStorage.setItem("pageNumber",pageNo)



    if(pageNo % 2 ==0){ // If the requested page number is even, Ex: 26
        pageRt.src = `https://quran.ksu.edu.sa/ayat/safahat1/${+(pageNo-1)}.png` // Right page is 25
        pageLf.src = `https://quran.ksu.edu.sa/ayat/safahat1/${+(pageNo)}.png`   // Left page is 26
    }else if(pageNo % 2 !=0){ // If the requested page number is odd, Ex: 25
        pageRt.src = `https://quran.ksu.edu.sa/ayat/safahat1/${+(pageNo)}.png` // Right page is 25 
        pageLf.src = `https://quran.ksu.edu.sa/ayat/safahat1/${+(pageNo+1)}.png` // Left page is 26
    }
})

document.getElementById("nextPageBtn").addEventListener("click", async(e) =>{
    if(pgNo.value % 2 ==0){ // Even: 16 => 17
        pgNo.value = +pgNo.value +1
    } else if(pgNo% 2 != 0){ // Odd: 15 => 17
        pgNo.value = +pgNo.value +2
    }
    
    if(pgNo.value > 604) pgNo.value = 604
    if(pgNo.value < 1) pgNo.value = 1
    
    track()
    pgNo.dispatchEvent(new Event('input')) // activate the input field
})

document.getElementById("prevPageBtn").addEventListener("click",async (e) =>{
    
    if(pgNo.value % 2 ==0){ // Even: 16 => 13
        pgNo.value = +pgNo.value -3
    } else if(pgNo% 2 != 0){ // Odd: 15 => 13
        pgNo.value = +pgNo.value -2
    }

    if(pgNo.value > 604) pgNo.value = 604
    if(pgNo.value < 1) pgNo.value = 1

    track()

    pgNo.dispatchEvent(new Event('input'))
})

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