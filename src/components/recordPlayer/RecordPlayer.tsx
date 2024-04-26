import React, { useEffect, useRef, useState } from 'react';
import Record from "../../assets/record.png";
import RecordText from "../../assets/record-text.png";
import './RecordPlayer.css';



const RecordPlayer = () => {


  const [isRecordPlaying, setIsRecordPlaying] = useState(false);
  const audioRef = useRef(null);
  const handleRecordClick = () => {
    setIsRecordPlaying(!isRecordPlaying);
    // play music from a link
    
  }
  useEffect(() => {
    if(isRecordPlaying){
      audioRef.current.play();
    }else{
      audioRef.current.pause();
    }
  },[isRecordPlaying])

  
  return (
    <div role='button' className='RecordPlayer' onClick={handleRecordClick}>
        <img className={`wrapper-text ${isRecordPlaying ? 'record-playing':'record-paused' } `} src={RecordText} alt="Vinyl record text" ></img>
        <img className='RecordImage' src={Record} alt="Music Record" />
        <audio ref={audioRef} src="https://github.com/kiransbaliga/kiransbaliga/raw/main/video-killed-the-radio-start.mp3" />
    </div>
  )
}

export default RecordPlayer