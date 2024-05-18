import React, { useState } from 'react'
import './Gallery.css'

interface GalleryProps {
    links: string[]
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}
const Gallery = ({links,onMouseEnter,onMouseLeave}:GalleryProps) => {
    const [selected, setSelected] = useState(0)
 
    const handleClick = () => {
        const len = links.length
        setSelected((selected + 1) % len)
    }
  return (
    <div className='showcase-media .gallery' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <img src={links[selected]} onClick={handleClick}  style={{aspectRatio: 1}}/>
    </div>
  )
}

export default Gallery