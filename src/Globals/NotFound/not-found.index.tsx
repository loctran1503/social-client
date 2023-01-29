import React, { useEffect } from 'react'
import { useAppDispatch } from '../../storing/hook'
import { setIsLoading } from '../../storing/reducers/authSlice'

const NotFound = () => {
  const dispatch = useAppDispatch()
  useEffect(() =>{
    dispatch(setIsLoading(false))
  },[])
  return (
    <div>NotFound</div>
  )
}

export default React.memo(NotFound)