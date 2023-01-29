import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styles from './styles.module.scss'
const CallAudio = () => {
  return (
    <div>
           <FontAwesomeIcon icon={faPhone} className={styles.callAudioIcon}/>
    </div>
  )
}

export default CallAudio