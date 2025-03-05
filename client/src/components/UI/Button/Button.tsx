import { IButtonProps } from "./IButtonProps";
import style from './Button.module.css';
import cn from "classnames";
import { forwardRef } from "react";

const Button = forwardRef<HTMLButtonElement, IButtonProps>(({ children, className, color, form, ...props }, ref) => {
    return (
        <button
            className={cn(style.button, className, {
                [style.primary]: color === 'primary',
                [style.danger]: color === 'danger',
                [style.transparent]: color === 'transparent',
                [style.success]: color === 'success',
                [style.round]: form === 'round',
            })}
            ref={ref}
            {...props}
            >
            {children}
        </button>
    )
});

export default Button;