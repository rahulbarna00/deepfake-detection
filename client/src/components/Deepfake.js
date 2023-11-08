import React,{useEffect, useRef , useState} from 'react'
import Polygon from '../images/Polygon 1.png';
import Rope from '../images/rope.png';
import "../scss/deepfake.scss"
import { motion } from 'framer-motion'
import Load from "../images/load.png";
import Green from '../images/green.png'
import Error from '../images/error.png'
import Red from '../images/red.png'
const Deepfake = () => {
const inputRef = useRef(null);
  const [video , setvideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [flag , setflag] = useState(false);
  const [reaction , setreaction] = useState(-1)
  const color_code = ["#0ED23A","#FF2A2A","#FFB818"]
  const arr_emoji = [Green,Red,Error]
  //const [points,setpoints] = useState({}) 
  const [ temp , settemp] = useState(videoUrl)
  const [api,setapi] = useState(false);
  const abortcontroller = useRef(null)
  const [result,setresult]=useState(null)
  useEffect(()=>{
     console.log(video)
    if(video){
      console.log("video yes")
       const element = document.querySelector(".down");
        element.style.display="flex";
        element.style.borderTop="2px dashed black"
    }else{
      console.log("video no")
      const element = document.querySelector(".down");
      element.style.display="none";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[video])


  const handleClick = () => {
    // 👇️ open file input box on click of another element
    inputRef.current.click();
  };

  const handleFileChange = event => {
    const fileObj =  event.target.files[0];
    if (!fileObj) {
      // setreaction(-1);
      return;
    }
    if (fileObj) {
      if ( fileObj.size <= 30 * 1024 * 1024) {
        setVideoUrl(URL.createObjectURL(event.target.files[0]));
         const data = new FormData()
         data.append("file",fileObj)
         setvideo(data)
         const file = fileObj
         console.timeLog(file)
         for (var key of data.entries()) {
          console.log(key[0] + ', ' + key[1]);
      }
          // API(data)
          //console.log("data proper")
      } else {
        // setreaction(-1);
          alert('Please select an MP4 video file (max 30MB).');
      }
    }
   // console.log('fileObj is', fileObj);

    // 👇️ reset file input
    event.target.value = null;
  };


  useEffect(()=>{
    if(flag===true && temp!==videoUrl){
      settemp(videoUrl)
      const element2 = document.querySelector('.img')
      element2.style.display="flex";
      element2.style.animation="increaseWidth 30s forwards";
      const element3 = document.querySelector('.image')
      element3.style.animation ="blink 2s infinite"
    }else{
     const element2 = document.querySelector('.img')
     element2.style.display="none";
    //  setreaction(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
 },[flag])




  const API = async(data)=>{
    setapi(true)
    console.log(data)
    console.log("wennjdkfuihywbhdn")
    try{
      abortcontroller.current = new AbortController()
    const res = await fetch("http://localhost:5000/detect",{
      signal:abortcontroller.current.signal,
      method: "POST",
      headers:{
        'X-Abort-Request': 'true'
      },
      body: data
      });
      const msg = await res.json();
      if(msg){
        const element2 = document.querySelector('.img')
        const element3 = document.querySelector('.videowala')
        element2.style.animation = "restWidth 3s linear"
        element2.addEventListener("animationend",function(){
           element2.style.display="none";
           element3.style.animation="none";
           element3.style.animation="autoScale 0.6s ease"
           element3.style.borderRadius="35px";
           element3.style.border=`5px solid ${color_code[msg.code]}`
           setreaction(msg.code);

           element3.addEventListener("animationend",function(){
            
          const ele = document.querySelector(".up")
          const own = document.querySelector(".down")
          ele.style.display="flex";
          own.style.display="none";
          setapi(false)
          setresult(msg.result)
          },{once:true})
          },{once:true})
      }
      console.log(msg)
    }catch(err){
      console.log(err);
    }
  }


  useEffect(()=>{
    if(reaction!==-1){
      const element = document.querySelector(".videowala");
      // const rect = element.getBoundingClientRect();
      //  const relativeBottom = rect.top;
      //    const relativeRight = rect.left;
      const parentElement = document.querySelector("#left");
    const elementRect = element.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();

    const relativeTop = elementRect.top - parentRect.top;
    const relativeLeft = elementRect.left - parentRect.left;
         console.log(relativeTop)
         console.log(relativeLeft)

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[reaction])


  const cancelrequest=()=>{
    abortcontroller.current && abortcontroller.current.abort()
  }

  return (
    <div className="deepfake">
      <div className="left" id='left'>
      {videoUrl && (
        <motion.video initial={{ scale:0}}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}  className='videowala'>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>
      )}
      {reaction!==-1 && (
        <div className="mt">
        <img src={arr_emoji[reaction]}  alt="fv" className='react'/>
        </div>
      )}
      <div className="image">
      <img src={Load} alt="" className='img' id='immg'/>
      </div>
      {result && (
      <motion.div className="result"  initial={{ scale:0}}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}  >
        <h2 style={result.Faces===0 ? {"color":"#ff3333" , opacity:1} : {fontSize:"1.3rem"} }>{result.message}</h2>
<table  className="bottom">
  <tr>
    <td>Total Frames in Video</td>
    <td>{result.Frames}</td>
  </tr>
  <tr>
    <td>Total Faces in those frames</td>
    <td>{result.Faces}</td>
  </tr>
  <tr>
    <td>Total Deepfake Faces</td>
    <td>{result.Deepfake.toFixed(5)}</td>
  </tr>
  <tr>
    <td>Total Real Faces</td>
    <td>{result.Real.toFixed(5)}</td>
  </tr>
</table>


        {/* </div> */}
      </motion.div>
      )}
      </div>

      <div className="right">
        <div className="box">
        <motion.div className="up"  initial={{ scale:0}}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, scale: 1 }}>
          <button id='uploaduu' onClick={(e)=>{
            e.preventDefault()
            setvideo(null)
            setVideoUrl(null)
            setflag(false)
            setreaction(-1)
            handleClick()
            setresult(null)
          }}>   
            Upload your Videos
          </button>
          <input type="file" id='Videoupload' ref={inputRef} onChange={handleFileChange} />
          <p>Upto 30 mb of video & mp4 format only !</p>
          </motion.div>
          <motion.div className="down" initial={{ scale:0}}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, scale: 1 }}>
           {api === false &&  (
            <button onClick={(e)=>{
              e.preventDefault()
              API(video)
              const ele = document.querySelector(".up")
              const own = document.querySelector(".down")
              own.style.borderTop="none";
              ele.style.display="none";
              setflag(true)
            }}>Detect Video</button>
            )}
            {api===true && (
              <>
              <p>This may take a few Seconds....</p>
              <p>Estimated Time: 30-40 sec</p>
              <button className='cancel' onClick={(e)=>{
                e.preventDefault()
                cancelrequest()
                setvideo(null)
                setVideoUrl(null)
                setflag(false)
                setreaction(-1)
                setapi(false)
                const ele = document.querySelector(".up")
                ele.style.display="flex";
              }}>Cancel</button>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <img src={Polygon} alt="v" className='ploy' />
      <img src={Rope} alt="rve" className='rope' />
    </div>
  )
}
export default Deepfake