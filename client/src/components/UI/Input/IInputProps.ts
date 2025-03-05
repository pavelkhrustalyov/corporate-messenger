import { ReactNode } from "react";

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string | ReactNode;
    icon?: boolean;
}