import styles from './Form.module.css';
import { IPropsForm } from './IPropsForm';
import cn from 'classnames';

const Form = ({ children, className, ...props }: IPropsForm) => {
    return <form className={cn(className, styles.form)} {...props}>{children}</form>;
};

export default Form;