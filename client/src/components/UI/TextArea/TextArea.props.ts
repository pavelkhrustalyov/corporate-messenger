import { TextareaHTMLAttributes } from "react";

export interface ITextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    type: 'text' | 'file' | 'image'
}