import React,{useState,useEffect} from 'react'
import axios from 'axios'
const OT = require ('@opentok/client')

let session, publisher_cam,publisher_scr, subscriber;
let newToken, person;
const handleError = (err)=>{
    if (err) 
        {alert(err.message)}
}

const Conference =(props)=>{
    newToken = props.newToken[1]
    person = props.newToken[0]
    console.log(newToken)
    console.log(person)
    //const base_Url = "http://192.168.10.197:3001"
    const base_Url = "https://vpbackend-utu.herokuapp.com"
    const [api_key,setApiKey] = useState(null)
    const [sessionId,setSessionId] =useState(null)
    const [sessionIsOn,setSessionIsOn] = useState(false)
    const [startOn,setStartOn] = useState(true)
    const [screenBtnOn,setScreenBtnOn] = useState(true)
    const [publishBtnOn,setpublishBtnOn] = useState(true)
    const [chatInputValue,setChatInputValue] = useState("")
    const [chatText,setChatText] = useState('')

    useEffect(()=>{
        axios.get(base_Url+"/vonageKey/")
            .then((res)=>{
                if (res.status === 200) {
                    setApiKey(res.data)
                    console.log("received the Api_key")
                } else if (res.status === 400) {
                    alert(res.data)
                    console.log("api_key error")
                } else {
                    alert("unexpected Api key result !")
                }
    })},[])

    useEffect (()=>{
        axios.get(base_Url+"/currentsId/")
           .then((res)=>{
               if (res.status === 200) {
                   setSessionId(res.data)
                   console.log("received the session_ID")
                   
               } else if (res.status === 400) {
                   alert(res.data)
                   console.log("session_ID error")
               } else {
                   alert("unexpected session ID result !")
               }
           })
   },[])

    


    const initializeSession = () =>{
        session = OT.initSession(api_key,sessionId);

        session.connect(newToken,function(error){
            if (error) {
                handleError(error)
            } else {
                console.log("session is connected")
                
                setStartOn (false)
                setSessionIsOn(true)
            }
        
        })

        session.on('streamCreated',function(event){
            subscriber = session.subscribe(event.stream,"sub_box",
            {
                insertMode:"append",
                width:"200px",
                height:"200px", 
            },
            handleError
            )
            console.log("new stream id is "+event.stream.streamId)
            subscriber.element.onclick = function(){
                console.log("result of click is "+event.stream.streamId)
                session.subscribe(event.stream,"zoom_stream",
            {
                insertMode:"replace",
                width:"80%",
                height:"80%", 
            },
            handleError
            )
            
            }
        }
            
            
        )

        session.on("signal:msg", function (event){
                updateChat(event.data)
        })
    }

    function updateChat(content) {
        const msgHistory = document.getElementById("messageArea");
        const msg = document.createElement("p");
        msg.textContent = content;
        msgHistory.appendChild(msg);
        msgHistory.scroll({
          top: msgHistory.scrollHeight,
          behavior: "smooth"
        });
      }

    const terminateSession = () =>{
        setStartOn (true)
    }

        const publishCamera =()=>{
            let pubOptions = {
                publishAudio:true,
                publishVideo:true
            }
            publisher_cam = OT.initPublisher (
                "publish_camera",pubOptions,
                {
                    insertMode:"replace",
                    width:"200px",
                    height:"200px"
                },
                handleError
            );
            setpublishBtnOn(false)
                    session.publish(publisher_cam,function(error){
                        if (error){
                            console.log(error)
                        } else {
                            console.log("Publishing Camera to stream.")
                        }
                    })      
        }
        
        const cameraOff = () =>{
            setpublishBtnOn(true)
            let pubOptions = {
                publishAudio:true,
                publishVideo:false
            }
            //create a publisher
            publisher_cam = OT.initPublisher (
                "publish_camera",pubOptions,
                {
                    insertMode:"replace",
                    width:"200px",
                    height:"200px"
                },
                handleError
            );
        }

        const screenOff = () =>{
            setScreenBtnOn(true)
            let pubOptions = {
                publishAudio:true,
                publishVideo:false
            }
            publisher_scr = OT.initPublisher (
                "publish_screen",pubOptions,
                {
                    insertMode:"replace",
                    width:"200px",
                    height:"200px"
                },
                handleError
            );
        }

        const publishScreen =()=>{
           
            setScreenBtnOn(false);
            let pubOptions = {
                publishAudio:true,
                publishVideo:true,
                videoSource:'screen'
            }
            publisher_scr = OT.initPublisher (
                "publish_screen",pubOptions,
                {
                    insertMode:"replace",
                    width:"200px",
                    height:"200px"
                },
                handleError
            );
                    session.publish(publisher_scr,function(error){
                        if (error){
                            console.log(error)
                        } else {
                            console.log("Publishing screen to stream.")
                        }
                    })   
        }

        const handleChatInput =(event)=>{
            setChatInputValue (event.target.value)
        }

        const sendText = ()=>{
            session.signal ({   data:person+" says == > "+chatInputValue,
                                type:"msg"
                },
                function (error) {
                    if (error) {
                        handleError(error)
                    } else 
                        {
                            console.log('signal sent.')
                        } 
                    } 
                ) 
        }

    return (
        <div id="conference">
             <h1>Conference page</h1>
            <br/>
            {(api_key!==null && sessionId!==null)
            ? <div>

                {(sessionIsOn!==true)
                ?<div id = "greeting">
                <h1>Hi! {person}</h1>
                <h2>Please click the button below to start the session</h2>
                </div>
                :null}
            <div id = "start_end">
                
                {(startOn)
                    ?<div >
                        <button id = "StartConf"  onClick = {initializeSession}>Initiate Conference</button>
                    </div>                  
                    
                    :<button id="end_session" onClick={terminateSession}>Terminate</button>
                }                
            
            </div>
            </div>
            :null}
            
            {(sessionIsOn===true)
            ?
            <div id= "conf_body" >
                    <div id="publish_field">
                        {(publishBtnOn)
                        ?<button id="btn_publish" className="btn_pub" onClick={publishCamera} > Camera On </button>
                        :<button id="btn_publish_off" className='btn_pub' onClick ={cameraOff}>Camera Off</button>}
                        

                        <div id = "publish_camera"  />
                        {(screenBtnOn)
                        ?<button id="btn_screen"  className="btn_pub" onClick={publishScreen} > Share Screen </button>
                        :<button id="btn_screen_off" className='btn_pub' onClick ={screenOff}>Screen Off</button>}
                        
                        
                        <div id = "publish_screen" />
                            
                    </div>

                    <div id = "zoom_out">
                        <div id= "zoom_stream"> 
                        Center area
                        </div>
                    </div>

                    <div id="chat_div" >
                        
                        <div id="chat_view" >
                            <div id="messageArea" className="messages"/>
                        </div>
                    </div>

            </div>
            :null}

            {(sessionIsOn===true)
            ?
            <div id="lower_field" >
                <div id = 'sub_box'  >
                    {/* <div id="subscriber" /> */}
                </div>

                <div id="chat_box">
                    <input type ='text' id = "chat_input" onChange={handleChatInput}/>
                    <button id = 'send' onClick={sendText}>send</button>
                </div>
            </div>
            :null}
        </div>
    )
}

export default Conference
