import { useState } from 'react'
import Icon from './Icon.jsx'

export default function Img({ src, alt = '', icon = 'image', iconClass = '' }) {
  const [error, setError] = useState(false)
  if (!src || error) {
    return <Icon name={icon} className={iconClass} />
  }
  return <img src={src} alt={alt} onError={() => setError(true)} />
}
