import React from 'react';
import styles from './Headling.module.css';
import cn from 'classnames';

interface IPropsHeadling extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Headling = ({ children, className, element = "h1", ...props }: IPropsHeadling) => {
    const HeadingElement = element || 'h1';

    return React.createElement(
        HeadingElement,
        {
            className: cn(styles.heading, styles[element], className),
            ...props
        },
        children
    );
};

export default Headling;
