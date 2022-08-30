import React, { useState } from 'react'
import axios from 'axios'

const LoginPage =(props)=>{
    //const base_Url = "http://192.168.10.197:3001"
    const base_Url = "https://vpbackend-utu.herokuapp.com"
    const [email,setEmail] = useState ("")
    const [userList,setUserList]=useState(null)

    const changeEmail = (event)=>{
        setEmail(event.target.value)
    }
  
    const checkEmail = () =>{
        let token = null
         axios.get(base_Url +"/getToken/"+email)
            .then(res=>{
               console.log(res)
               if (res.status === 200) {
                    token = res.data
                    console.log(token)
                    props.getToken(token)
                    props.isLogedIn(true)

               } else {
                alert("User does not exist!")
                }  
            })   
    }
    return (
        <div className='login_page'>
            <h2>Please enter your email address</h2>
            <br/>
            <input id="lpemail" onChange = {changeEmail} type='text' value = {email} ></input>
            <br/>
            <button className="btn" onClick = {checkEmail} >SUBMIT</button>
        </div>
    )
}

export default LoginPage
