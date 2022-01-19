import React,{useState} from 'react';
import Header from './components/Header'
import CheckBox from './components/CheckBox';
import LoginPage from './components/LoginPage'
import Conference from './components/Conference'
  

function App() {
  const [logedIn,setLogedIn] = useState(false)
  const [token,setToken] = useState(null)
  const [audio,setAudio]=useState(true)
  const [video,setVideo]=useState(false)
  const [videoSource,setVideoSource]=useState("camera")
  const changeAudio =(audio) =>{
    setAudio(audio)
  }
  const changeVideo =(video) =>{
    setVideo(video)
  }

  const changeVS =(boo) =>{
    setVideoSource((!boo)?"camera":"screen")
  }

  return (
    <div className="App">
      <Header/>
     
      {(!logedIn)?
        <LoginPage
          isLogedIn = {(e)=>{setLogedIn(e)}}
          getToken = {(token)=>{setToken(token)}}
          />
      :
      <Conference 
        newToken = {token}/>
        }
      {/* {(!logedIn)?
        <p>not loged in</p>
      :null} */}

      
   
    </div>
  );
}

export default App;
