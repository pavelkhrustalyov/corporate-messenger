import { forwardRef } from 'react';
import styles from './Input.module.css';
import cn from 'classnames';
import { MdAttachFile } from 'react-icons/md';

const Input = forwardRef<HTMLInputElement, IInputProps>(({ className, ...props }, ref) => {
    return (
        <>
            {
                props.type === 'file' ? (
                    <div className="file-container">
                        <input 
                            id='file'
                            className={cn(className, styles['input-file'], {})} 
                            ref={ref}
                            {...props}
                        />
                        <label htmlFor="file">
                            <MdAttachFile className={styles.file} />
                        </label>
                    </div>
                ) : (
                    <input
                        ref={ref}
                        className={cn(className, styles.input, {})}
                        {...props}
                    />
                )
            }
        </>
        
    ); 
});

export default Input;