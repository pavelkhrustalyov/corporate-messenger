import React from 'react';
import styles from './Modal.module.css';

interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children }: IModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
