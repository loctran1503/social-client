import React from 'react'
import Login from './Login/login.index'
import SignUp from './SignUp/signup.index'
import styles from './styles.module.scss'
import { toast, ToastContainer } from "react-toastify";
const Authenticate = () => {
  const [isLogin,setIsLogin] = React.useState(true)
  const [isModalOpen,setIsModalOpen] = React.useState(false)

  const openModal = () =>{
    setIsModalOpen(true)
  }

  const closeModal = () =>{
    setIsModalOpen(false)
  }

  const onSuccess = (message : string) =>{
    toast.info(message)
  }

  //Changing between login and signup
  const handleChanging = (isLogin : boolean) =>{
    setIsLogin(isLogin)
  }
  return (
    <>
    <button className={styles.btnOpenAuthenticate} onClick={openModal}>login / signup</button>
    {isModalOpen && <div className={styles.overlay} >
      <div className={styles.container}>

          <div className={styles.top}>
          {isLogin ? <Login closeModal={closeModal} onSuccess={onSuccess}/> : <SignUp closeModal={closeModal} onSuccess={onSuccess}/>}
          </div>
          <div className={styles.bottom}>
            {isLogin ? <div>
              You don't have account? <span onClick={() =>{handleChanging(false)}}>
              Sign Up
              </span>
            </div> : <div>Already have account? <span onClick={() =>{handleChanging(true)}}>
            Log In</span></div>}
          </div>
      </div>
    </div>}
    <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default Authenticate