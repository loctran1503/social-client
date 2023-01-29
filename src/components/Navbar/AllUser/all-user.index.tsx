import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../storing/hook'
import { authSelector } from '../../../storing/reducers/authSlice'
import { UserFindAround } from '../../../types/user'
import { getAllUserApi } from '../../../utils/api/user'
import styles from './styles.module.scss'
const AllUser = () => {
    const {user} = useAppSelector(authSelector)
    const [userList,setUserList] = useState<UserFindAround[]>([])
    const navigate = useNavigate()
    useEffect(() =>{
        const getAllUser =async () =>{
            let result
            if(user?.userId){
                result =await  getAllUserApi(user.userId)
                
            }else{
                result = await getAllUserApi()
            }

            if(result?.userList){
                setUserList(result.userList)
            }
            
            
        }
        getAllUser()
    },[user])

  return (
    <div>
        <div className="grid wide">
            <div className="row">
                <div className="col l-8 l-o-2 m-8 m-o-2 c-12">
                    <div className={styles.container}>
                        <div className="row">
                        {
                            userList.length>0 && userList.map(item => (
                                <div className='col l-3 m-3 c-4'  key={item.userId} onClick={() => navigate(`/chat-room/${item.userId}`)}>
                                        <div className={styles.userItem}>
                                            <div className={styles.userStatus}>
                                            <img src={item.avatar}/>
                                            <span className={clsx(item.isOnline ? styles.online : styles.offline)}></span>
                                            </div>
                                            <p>{item.name}</p>
                                        </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default AllUser