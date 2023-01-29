import  { ReactNode } from 'react'
import './reset.scss'
import './grid.scss'
import './base.scss'

import 'react-toastify/dist/ReactToastify.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const GlobalStyles = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
  };

export default GlobalStyles