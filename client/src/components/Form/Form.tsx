import styles from './Form.module.css';
import { IPropsForm } from './IPropsForm';
import cn from 'classnames';

const Form = ({ children, className}: IPropsForm) => {
    return <form className={cn(className, styles.form)}>{children}</form>;
};

export default Form;