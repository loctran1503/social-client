import clsx from 'clsx';
import { useField } from 'formik';
import styles from './styles.module.scss'
interface InputCustomProps{
    label:string,
    name:string,
    type:string,
    placeholder:string,
    onChange?:(e: React.ChangeEvent<any>) => void
}

const InputCustom = ({ label, ...props } : InputCustomProps) => {
    const [field, meta] = useField(props);
    
  return (
    <div className={styles.inputContainer}>
        <label className={styles.labelCustom}>{label}</label>
        <input {...field} {...props} className={clsx(styles.inputCustom,meta.touched && meta.error && styles.inputError)} />
        {meta.touched && meta.error && <div className={styles.errorMessage}>{meta.error}</div>}
    </div>
  )
}

export default InputCustom