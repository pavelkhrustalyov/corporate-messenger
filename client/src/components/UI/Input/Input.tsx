import { forwardRef } from 'react';
import styles from './Input.module.css';
import cn from 'classnames';
import { IInputProps } from './IInputProps';

const Input = forwardRef<HTMLInputElement, IInputProps>(({ className, label, id, icon, ...props }, ref) => {
    return (
        <>
            {
                props.type === 'file' ? (
                    <div className={styles['file-container']}>
                        
                        <label className={styles.label} htmlFor={id}>
                            <input 
                                id={id}
                                className={cn(styles['input-file'], className, {})} 
                                ref={ref}
                                {...props}
                            />
                            { label && <span className={styles['label-text']}>{label}</span> }
                            { icon && <img className={styles.file} src="../file.svg" alt="Smile" /> }
                        </label>
                    </div>
                ) : (
                    <input
                        ref={ref}
                        className={cn(styles.input, className, {})}
                        {...props}
                    />
                )
            }
        </>
        
    ); 
});

export default Input;