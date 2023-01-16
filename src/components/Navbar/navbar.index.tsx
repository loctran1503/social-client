import styles from "./styles.module.scss";
import MediaQuery from "react-responsive";
import { useMediaQuery } from "react-responsive";
import Authenticate from "./Authenticate/auth.index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faComment,
  faHouse,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import avatar from '../../assets/avatar.png'
import { useAppDispatch, useAppSelector } from "../../storing/hook";
import { authSelector, checkAuthenticate } from "../../storing/reducers/authSlice";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const {isAuthenticated,user} = useAppSelector(authSelector)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  React.useEffect(() =>{
    const checkAuth = async () => {
      dispatch(checkAuthenticate());
    };
    checkAuth();
  },[])

  React.useEffect(() =>{
    console.log(`isAuthenticated:${isAuthenticated}`);
    
  },[isAuthenticated])
  return (
    <div className={styles.wrapper}>
      {/* Desktop */}
      <MediaQuery minWidth={769}>
        <div className="grid wide">
          <div className="row">
            <div className="col l-12 m-12 c-12">
              <div className={styles.container}>
                <h1>Social</h1>
                <div className={styles.center}>
                  <FontAwesomeIcon
                    icon={faHouse}
                    className={styles.mobileBottomIcon}
                  />
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className={styles.mobileBottomIcon}
                  />
                  <FontAwesomeIcon
                    icon={faBell}
                    className={styles.mobileBottomIcon}
                  />
                  <FontAwesomeIcon
                    icon={faComment}
                    className={styles.mobileBottomIcon}
                  />
                </div>
                {isAuthenticated ?   <button  className={styles.username} onClick={() =>{navigate('/profile')}}>
                 {user?.name}
                </button> :   <Authenticate />}
               
              
              </div>
            </div>
          </div>
        </div>
      </MediaQuery>
      {/* ************************************************************************************************************** */}
      {/* Mobile  */}
      {/* ************************************************************************************************************** */}
      <MediaQuery maxWidth={768}>
        <div className={styles.mobileContainer}>
          <h1>Social</h1>
          {isAuthenticated ?   <button  className={styles.username} onClick={() =>{navigate('/profile')}}>
          {user?.name}
                </button> :   <Authenticate />}
        </div>
        <div className={styles.mobileContainerBottom}>
          <FontAwesomeIcon icon={faHouse} className={styles.mobileBottomIcon} />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={styles.mobileBottomIcon}
          />
          <FontAwesomeIcon icon={faBell} className={styles.mobileBottomIcon} />
          <FontAwesomeIcon
            icon={faComment}
            className={styles.mobileBottomIcon}
          />
        </div>
      </MediaQuery>
      {/* <div className={styles.container}>
                
              </div> */}
    </div>
  );
};

export default React.memo(Navbar);
