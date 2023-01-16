import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import Navbar from "../../components/Navbar/navbar.index";
import Loader from "../styles/Loader/loader.index";
import styles from "./styles.module.scss";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  
  return (
    <>
   <Navbar/>

      <div className={styles.wrapper}>{children}</div>
    </>
  );
};

export default DefaultLayout;
