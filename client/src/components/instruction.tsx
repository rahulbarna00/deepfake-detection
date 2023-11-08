import React from 'react'
import '../scss/instrution.scss'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
const Instruction = () => {
  return (
    <div className="inst">
      <div className="boxes">
       <div className="box">
        <div className="ele">
        <FileUploadIcon className='icon'/>
        </div>
        <p>Choose a video file that you want to analyze and upload it in the "Detection" section. The videos should be within 20-30 MB in size and should be in MP3 format</p>
       </div>
       <div className="box">
       <div className="ele">
        <SearchIcon className='icon'/>
        </div>
        <p>Click on "Detect Videos" and wait for some time, as the identification process can take 1 or 2 minutes, until the output result comes. You can play some games related to deepfake.</p>
       </div>
       <div className="box">
       <div className="ele">
        <CheckIcon className='icon'/>
        </div>
        <p>After the prediction, you will find out whether your video is fake or real. In the output, we provide some metrics, including the percentage for different techniques used, separate results for eye blinking, face masking, and lip syncing, and finally, the overall result.</p>
       </div>
       </div>
    </div>
  )
}

export default Instruction