import clsx from 'clsx';
import { Field, useField } from 'formik';
import styles from './styles.module.scss'
interface RadioCustomProps{
    label:string,
    name:string,
    type:string,
    value:string
}

const RadioCustom = ({ label, ...props } : RadioCustomProps) => {
    const [field, meta] = useField(props);
    
  return (
    <div >
        <label className={styles.labelRadioCustom}>
        <input  {...props} {...field} />
        {label}
        </label>
       
     
       
        {meta.touched && meta.error && <div className={styles.errorMessage}>{meta.error}</div>}
    </div>
  )
}

export default RadioCustom