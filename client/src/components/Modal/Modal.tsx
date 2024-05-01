import React, { HtmlHTMLAttributes } from 'react';
import styles from './Modal.module.css';
import cn from 'classnames';

interface IModalProps extends HtmlHTMLAttributes<HTMLDivElement>{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children, className }: IModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={cn(styles['modal-overlay'], className)} onClick={onClose}>
            <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                { children }
            </div>
        </div>
    );
};

export default Modal;
