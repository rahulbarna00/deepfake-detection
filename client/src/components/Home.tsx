import React from 'react'
import '../scss/Home.scss'
import Timepass from '../images/Untitled design (14).png'
import Scroll from '../utils/scroll';
const Home = () => {
  return (
    <div className="home">
        <div className="left">
           <img src={Timepass} alt="" />
        </div>
        <div className="right">
          <div className="content">
           <h1>Veriface a Deepfake detector </h1>
           <h1 className='below'>You Deserve the <span>Truth</span></h1>
           <h2>Unmasking Truth in a Deepfake World !</h2>
           <p>Utilizing eye blinking, facial expressions, and lip syncing as key indicators to identify deepfakes, enhancing precision in detecting synthetic media content.</p>
           <button onClick={(e)=>Scroll("deepfake")}>Start Video Detection</button>
           </div>
        </div>
    </div>
  )
}

export default Home