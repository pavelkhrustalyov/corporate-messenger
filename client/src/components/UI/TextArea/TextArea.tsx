import { forwardRef } from 'react';
import styles from './TextArea.module.css';
import { ITextAreaProps } from './TextArea.props';
import cn from 'classnames';

const TextArea = forwardRef<HTMLTextAreaElement, ITextAreaProps>(({ className, type, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn(className, styles.textarea, {})}
            {...props}
        >
        </textarea>
    );
});

export default TextArea;