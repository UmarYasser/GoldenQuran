// import dotenv from 'dotenv'
// dotenv.config({path:'./config.env'})
const url = 'http://localhost:3000/api/v1'
const resMessage = document.getElementById("resMessage")
let forgotPassword = false
const checkMark = '<i class="fa-solid fa-check-double"></i>'
const xMark ='<i class="fa-solid fa-square-xmark fa-xl"></i>'
const questionMark ='<i class="fa-solid fa-question"></i>'
const gears = '<i class="fa-solid fa-gears fa-xl" ></i>'
const star = '<i class="fa-solid fa-star fa-xl"></i>'
const eye = '<i class="fa-solid fa-eye fa-2xl"></i>'
const eyeSlash = '<i class="fa-solid fa-eye-slash fa-2xl"></i>'

document.addEventListener("DOMContentLoaded", async(event)=>{
    // document.getElementById("email").
    document.getElementById("email").focus()
})

//Login API 
document.getElementById("logIn").addEventListener("submit",async function(event){
    event.preventDefault()
    const formEntires = new FormData(this)
    const formData = Object.fromEntries(formEntires.entries())
    
    console.log(document.getElementById("email").style['box-shadow'])
    const emailField = document.getElementById('email')
    const boxShadowEmail = window.getComputedStyle(emailField).boxShadow
    const passwordField = document.getElementById('password')
    const boxShadowPassword = window.getComputedStyle(passwordField).boxShadow

    
    if(boxShadowEmail == 'rgb(218, 86, 86) 0px 0px 5px 4px'){
        document.getElementById("email").style['box-shadow'] = '0px 0px 5px 4px rgb(144, 209, 202)'
        document.getElementsByClassName('fa-envelope')[0].style.color = '#096B68'
        console.log("Return Color")
    }
    if( boxShadowPassword == 'rgb(218, 86, 86) 0px 0px 5px 4px'){
        document.getElementById("password").style['box-shadow'] =  '0px 0px 5px 4px rgb(144, 209, 202)'
        document.getElementsByClassName('fa-lock-open')[0].style.color = '#096B68'
        console.log("Return Color")
        // document.getElementsByClassName('fa-eye')[0].style.color = 'rgb(218, 86, 86)'
    }

    try{
        if(!forgotPassword){

        const logFetch = await fetch(`${url}/auth/logIn`,{
            method:'POST',
            body:JSON.stringify(formData),
            headers:{'Content-Type':'application/json'}
        })

        const logResult = await logFetch.json()

        if(logFetch.ok){
            if(logResult.haveDiet){ resMessage.innerHTML= `<p style="margin:15px"> Directing to Tracker Page ${checkMark} </p>`}
            else {resMessage.innerHTML= `<p> Directing to SetUp Page <i class="fa-solid fa-check-double"></i> <p`}

            sessionStorage.setItem("storedDate","undefined")
            setTimeout(()=>{
                window.location.href = './Mushaf.html'
            },2000)
        }
        else{
            resMessage.innerHTML = `${gears} ${logResult.message} ${xMark}`
            if(logResult.message == 'No User with that email was found'){
                document.getElementById("email").style['box-shadow'] = '0px 0px 5px 4px rgb(218, 86, 86)'
                document.getElementsByClassName('fa-envelope')[0].style.color = 'rgb(218, 86, 86)'
                console.log("red")
            }
            else if(logResult.message == 'Incorrect Password'){
                document.getElementById("password").style['box-shadow'] = '0px 0px 5px 4px rgb(218, 86, 86)'
                console.log("red")
                document.getElementsByClassName('fa-lock-open')[0].style.color = 'rgb(218, 86, 86)'
                // document.getElementsByClassName('fa-eye')[0].style.color = 'rgb(218, 86, 86)'
            }
        }
    }else if(forgotPassword){
            const logFetch = await fetch(`${url}/auth/forgotPassword`,{
                method:'PATCH',
                body:JSON.stringify(formData),
                headers:{'Content-Type':'application/json'}    
            })
            if(logFetch.ok){
                resMessage.innerHTML = '<p>Password Reset Link is sent <i class="fa-solid fa-check-double"></i> </p>'
            }else{
                resMessage.innerHTML = `${logResult.message} ${xMark}`
            }
        }
    }catch(e){
        resMessage.textContent = `Error:${e.message} ${xMark}`
    }
})

//Forgot Password
document.getElementById("forgotPassword").addEventListener("click",async function(event){
    event.preventDefault()
    forgotPassword = !forgotPassword 

    if(forgotPassword){
        // document.getElementById("forgotQues").style.display = "inline" 
        document.getElementsByClassName("fa-lock-open")[0].style.display = "none" 
        document.getElementsByClassName("fa-lock")[0].style.display = "inline" 
        
        document.getElementById("LogInBtn").textContent = 'Send Password Rest Link'
        document.getElementById("LogInBtn").style.height = 'max-content'
        resMessage.innerHTML=`${star} Enter Your email to send a password reset link to it. ${gears}`
        document.getElementById('password').style["background-color"] = 'rgba(41, 39, 39, 0.263)'
        document.getElementById('password').disabled = true
        document.getElementById('password').required = false
    }else{
        resMessage.innerHTML=''
        // document.getElementById("forgotQues").style.display = 'none' 
        document.getElementsByClassName("fa-lock-open")[0].style.display = "inline" 
        document.getElementsByClassName("fa-lock")[0].style.display = "none" 
        
        resMessage.innerHTML=`.${star}.`
        document.getElementById("LogInBtn").textContent = 'Log In'
        document.getElementById('password').style["background-color"] = 'transparent'
        document.getElementById('password').disabled = false
        document.getElementById('password').required = true
    }
}) 

//Show Password
document.getElementById("showPassword").addEventListener('click',async(event)=>{
    event.preventDefault()
    document.getElementById('password').type = document.getElementById('password').type == 'password' ? 'text' : 'password' 
    if(document.getElementById('password').type == 'password')
        document.getElementById("showPassword").innerHTML = `${eye}`
    else
        document.getElementById("showPassword").innerHTML = `${eyeSlash}`
})

//Log in with Google
document.getElementById("google").addEventListener("click",async function(e){
    location.href = `${url}/google`

    // try{
    //     const response = await fetch(`${url}/google`,{
    //         headers:{
    //             'Content-Type':'application/json'
    //         }
    //     })

    //     const result  = await response.json()
    //     if(response.ok){
    //         location.href = result.redirect
    //     }
    // }catch(e){
    //     console.log(e.message)
    // }
})