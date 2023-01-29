import clsx from 'clsx'
import React from 'react'
import { useAppSelector } from '../../storing/hook'
import { authSelector } from '../../storing/reducers/authSlice'
import { ToolbarEnum } from '../../types/local'
import Community from './Community/community.index'
import LiveStreamList from './LiveStreamList/livestream-list.index'
import PostCreater from './PostCreater/post-creater.index'
import PostList from './PostList/post-list.index'
import styles from './styles.module.scss'
const HomePage = () => {
  const {isAuthenticated} = useAppSelector(authSelector)
  const [toolbar,setToolbar] = React.useState(ToolbarEnum.COMMUNITY)
  return (
    <>
    
    <div>
      <div className="grid wide">
        <div className="row">
          <div className="col l-6 l-o-3 m-8 m-o-2 c-12">
          <div className={styles.header}>
          <h3 className={clsx(toolbar===ToolbarEnum.POST && styles.active)} onClick={() => setToolbar(ToolbarEnum.POST)}>{ToolbarEnum.POST}</h3>
        <h3 className={clsx(toolbar===ToolbarEnum.COMMUNITY && styles.active)} onClick={() => setToolbar(ToolbarEnum.COMMUNITY)}>{ToolbarEnum.COMMUNITY}</h3>
        <h3 className={clsx(toolbar===ToolbarEnum.LIVE && styles.active)} onClick={() => setToolbar(ToolbarEnum.LIVE)}>{ToolbarEnum.LIVE}</h3>
      </div>
          </div>
        </div>
      </div>
      {/* {isAuthenticated && <PostCreater/>} */}
    </div>
    <div>

      {toolbar===ToolbarEnum.POST && <PostList/>}
      {toolbar===ToolbarEnum.COMMUNITY && <Community/>}
      {toolbar===ToolbarEnum.LIVE && <LiveStreamList/>}
    </div>
    </>
  )
}

export default React.memo(HomePage)