import React from "react";
import styles from "../styles.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik, FormikHelpers } from "formik";
import { loginSchema } from "../../../../Globals/InputCustom/Schemas/schemas.index";
import { LoginByPassWord, UserResponse } from "../../../../types/authenticate";
import InputCustom from "../../../../Globals/InputCustom/input-custom.index";
import clsx from "clsx";
import { useAppDispatch } from "../../../../storing/hook";
import { userLogin } from "../../../../storing/reducers/authSlice";
import { firebaseErrorCode } from "../../../../utils/api/firebase-error-code";

interface LoginProps{
  closeModal : () => void
  onSuccess: (message: string) => void
}

const Login = ({closeModal,onSuccess} : LoginProps) => {
  const initialValues: LoginByPassWord = { email: "", password: "" };
  const dispatch = useAppDispatch()
  const [errorMessage,setErrorMessage] = React.useState<string | null>(null)

  const handleSubmit = (values : LoginByPassWord,actions : FormikHelpers<LoginByPassWord>) =>{
  
    dispatch(userLogin(values))
    .then((data) => {
      if (data.payload) {
        const reduxResult = data.payload as UserResponse;
        if (reduxResult.success) {
          actions.resetForm()
          closeModal();
          onSuccess("login successfully")
        }else{
          switch (reduxResult.message) {
            case firebaseErrorCode.EMAIL_ALREADY_EXIST.code:
              setErrorMessage(firebaseErrorCode.EMAIL_ALREADY_EXIST.vi)
              break;
          
            default:
              setErrorMessage(reduxResult.message || "")
              break;
          }
          
        }
        actions.setSubmitting(false)
      }
    })
    .catch((err) => {
      setErrorMessage(JSON.stringify(err))
      console.log(err);
    });

  }
  return (
    <div>
      <div className={styles.closeContainer}>
        <FontAwesomeIcon icon={faXmark} className={styles.closeIcon} onClick={closeModal} />
      </div>
      <div className={styles.header}>

        <h2>
        log in
        </h2>
       
      </div>
      <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={(values, actions) => {
            handleSubmit(values, actions);
          }}
        >
          {({isSubmitting,handleChange}) => (<Form className={styles.form}>
            <h3 className={clsx('errorMessage',!errorMessage && 'hidden')}>{errorMessage}</h3>
            <InputCustom
                  type="text"
                  label="Email"
                  placeholder="Enter your email address..."
                  name="email"
                  onChange={(e) =>{
                    if(errorMessage){
                      setErrorMessage(null)
                    }
                    
                    handleChange(e)
                  }}
                />
                <InputCustom
                  type="password"
                  name="password"
                  placeholder="Enter your password..."
                  label="Password"
                  onChange={(e) =>{
                    if(errorMessage){
                      setErrorMessage(null)
                    }
                    
                    handleChange(e)
                  }}
                />
                <button
                  className={clsx(styles.btnSubmit)}
                  type="submit"
                  disabled={isSubmitting}
                 
                >
                  {isSubmitting ? 'Loading...' : 'log in'}
                </button>
          </Form>)}
        </Formik>
    </div>
  );
};

export default Login;


