import {  faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styles from './styles.module.scss'
const Livestream = () => {
  return (
    <div>
        <div className={styles.icon}>
        <FontAwesomeIcon icon={faVideo} className={styles.iconLivestream}/>
        <p>Livestream</p>
        </div>
    </div>
  )
}

export default Livestream