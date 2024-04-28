import React, { useState } from 'react'
import './Gallery.css'

interface GalleryProps {
    links: string[]
}
const Gallery = ({links}:GalleryProps) => {
    const [selected, setSelected] = useState(0)
 
    const handleClick = () => {
        const len = links.length
        setSelected((selected + 1) % len)
    }
  return (
    <div className='showcase-media .gallery' >
        <div className="gallery-cursor"> Next </div>
        <img src={links[selected]} onClick={handleClick}  style={{aspectRatio: 1}}/>
    </div>
  )
}

export default Gallery