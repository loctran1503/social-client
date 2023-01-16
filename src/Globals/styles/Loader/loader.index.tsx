import React, { ReactNode } from "react";
import { useAppSelector } from "../../../storing/hook";
import { authSelector } from "../../../storing/reducers/authSlice";
import styles from "./styles.module.scss";

const Loader = () => {
  const { isLoading } = useAppSelector(authSelector);
  return (
    <>
      {isLoading && (
        <div className={styles.overlay}>
          <div className={styles.loader}>
            Loading...
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
