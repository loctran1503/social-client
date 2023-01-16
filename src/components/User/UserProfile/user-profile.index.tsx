import React from "react";
import styles from "./styles.module.scss";
import avatar from "../../../assets/avatar.png";
import { useAppDispatch, useAppSelector } from "../../../storing/hook";
import { authSelector, userLogout } from "../../../storing/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { DefaultResponse } from "../../../types";
const UserProfile = () => {
  const { user } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(userLogout())
      .then((data) => {
        const result = data.payload as DefaultResponse;
        if (result.success) {
          navigate("/");
        } else {
          alert(result.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div className="grid wide">
        <div className="row">
          <div className="col l-12 m-12 c-12">
            {user && (
              <div className={styles.container}>
                <div className={styles.header}>
                  <div></div>
                  <div className={styles.avatar}>
                    <img src={user.avatar} alt="Avatar" />
                    <p>{user.name}</p>
                  </div>
                  <div className={styles.logout}>
                    <button onClick={handleLogout}>log out</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
