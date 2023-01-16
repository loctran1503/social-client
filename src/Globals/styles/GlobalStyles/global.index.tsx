import  { ReactNode } from 'react'
import './reset.scss'
import './grid.scss'
import './base.scss'

import 'react-toastify/dist/ReactToastify.css';

const GlobalStyles = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
  };

export default GlobalStyles