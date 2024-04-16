import { IButtonProps } from "./IButtonProps";
import style from './Button.module.css';
import cn from "classnames";

const Button = ({ children, className, color, ...props }: IButtonProps) => {
    return (
        <button
            className={cn(className, style.button, {
                [style.primary]: color === 'primary',
                [style.danger]: color === 'danger',
                [style.transparent]: color === 'transparent',
            })}
            {...props}
            >
            {children}
        </button>
    )
};

export default Button;