import { FormHTMLAttributes, ReactNode } from "react";

export interface IPropsForm extends FormHTMLAttributes<HTMLFormElement> {
    children: ReactNode,
}