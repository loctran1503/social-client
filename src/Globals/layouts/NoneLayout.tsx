import { ReactNode } from "react";
import Loader from "../styles/Loader/loader.index";


const NoneLayout = ({ children }: { children: ReactNode }) => {
    return (
      <>
        {children}
   
        <Loader/>
      </>
    );
  };
  
  export default NoneLayout;
  