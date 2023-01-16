import React from "react";
import styles from "../styles.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik, FormikHelpers } from "formik";
import { loginSchema, signUpSchema } from "../../../../Globals/InputCustom/Schemas/schemas.index";
import { LoginByPassWord, SignUpByPassword, UserResponse } from "../../../../types/authenticate";
import InputCustom from "../../../../Globals/InputCustom/input-custom.index";
import clsx from "clsx";
import RadioCustom from "../../../../Globals/InputCustom/radio-custom.index";
import { useAppDispatch } from "../../../../storing/hook";
import { userSignup } from "../../../../storing/reducers/authSlice";

import { firebaseErrorCode } from "../../../../utils/api/firebase-error-code";
interface SignUpProps{
  closeModal : () => void
  onSuccess: (message: string) => void
}

const SignUp = ({closeModal,onSuccess} : SignUpProps) => {
  const initialValues: SignUpByPassword = { email: "", password: "",gender:"male",
name:"" };
const [errorMessage,setErrorMessage] = React.useState<string | null>(null)
const dispatch = useAppDispatch()

  const handleSubmit = (values : SignUpByPassword,actions : FormikHelpers<SignUpByPassword>) =>{
  
  
    dispatch(userSignup(values))
    .then((data) => {
      if (data.payload) {
        const reduxResult = data.payload as UserResponse;
        if (reduxResult.success) {
          actions.resetForm()
          closeModal();
          onSuccess("sign up successfully")
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
        sign up
        </h2>
       
      </div>
      <Formik
          initialValues={initialValues}
          validationSchema={signUpSchema}
          onSubmit={(values, actions) => {
            handleSubmit(values, actions);
          }}
         
          
        >
          {({isSubmitting,handleChange}) => (<Form className={styles.form}>
            <h3 className={clsx('errorMessage',!errorMessage && 'hidden')}>{errorMessage}</h3>
            <InputCustom
                  type="text"
                  label="Username"
                  placeholder="Enter your name..."
                  name="name"
                  onChange={(e) =>{
                    if(errorMessage){
                      setErrorMessage(null)
                    }
                    
                    handleChange(e)
                  }}
                />
                <h3 className={styles.genderTitle}>Gender</h3>
            <div className={styles.genderContainer}>
              
            <RadioCustom
                  type="radio"
                  label="Male"
                  value="male"
                  name="gender"
                />
                <RadioCustom
                  type="radio"
                  label="Female"
                  value="female"
                  name="gender"
                />
            </div>
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
                  {isSubmitting ? 'Loading...' : 'sign up'}
                </button>
          </Form>)}
        </Formik>
        
    </div>
  );
};

export default SignUp;
