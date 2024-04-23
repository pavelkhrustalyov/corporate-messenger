import { forwardRef } from 'react';
import styles from './Input.module.css';
import cn from 'classnames';
import { MdAttachFile } from 'react-icons/md';

const Input = forwardRef<HTMLInputElement, IInputProps>(({ className, ...props }, ref) => {
    return (
        <>
            {
                props.type === 'file' ? (
                    <div className={styles['file-container']}>
                        <input 
                            id='file'
                            className={cn(styles['input-file'], className, {})} 
                            ref={ref}
                            {...props}
                        />
                        <label htmlFor="file">
                            <img className={styles.file} src="file.svg" alt="Smile" />
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