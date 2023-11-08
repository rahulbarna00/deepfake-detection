import React,{useEffect, useState} from 'react'
import SegmentIcon from '@mui/icons-material/Segment';
import Logo from '../images/Logo.png';
import '../scss/nav.scss'
import Scroll from '../utils/scroll';
import CloseIcon from '@mui/icons-material/Close';
const Navbar = () => {
  const [mobile,setmobile]=useState(false);
  const [flag,setflag] = useState(false);
  useEffect(()=>{
    if(window.innerWidth<=700){
        setmobile(true);
        const ele = document.querySelector('.leftyyy')
        ele.style.display='none';
    }
    setflag(false);
                // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  useEffect(()=>{
    if(window.innerWidth<=700){
      setmobile(true);
    }else{
      setmobile(false);
    }
    setflag(false);
                // eslint-disable-next-line react-hooks/exhaustive-deps
  },[window.innerWidth])

  const close =()=>{
    // const ele = document.querySelector('.leftyyy')
    // ele.style.display='none';
    // setflag(false)
}
  return (
    <div className="navbar">
      <img src={Logo} alt="" />
      <div className="leftyyy">
          <button onClick={(e)=> {
            e.preventDefault()
            close()
            Scroll("inst")
          }}>Guide</button>
          <button onClick={(e)=>{
          e.preventDefault()
          close()
          Scroll("deepfake")
        }}>Detect Videos</button>
          <button onClick={(e)=>{
          e.preventDefault()
          close()
          Scroll("games")
        }}>Games</button>
          <button>Creators</button>
      </div>
      {mobile===true && (
        <>
        {flag===false ? (
        <SegmentIcon className='icon' onClick={(e)=>{
          e.preventDefault()
          const elem = document.querySelector('.leftyyy')
          elem.style.display='flex';
          setflag(true);
        }}/>)
      : (
        <CloseIcon className='icon' onClick={(e)=>{
          e.preventDefault()
          const elem = document.querySelector('.leftyyy')
          elem.style.display='none';
          setflag(false);
        }} />
      )}
        </>
      )}
    </div>
  )
}

export default Navbar