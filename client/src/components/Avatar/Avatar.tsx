import styles from './Avatar.module.css';
import { IAvatarProps } from './Avatar.props';
import cn from 'classnames';

const Avatar = ({ className, src, size, alt, ...props }: IAvatarProps) => {
    return (
        <img
            className={cn(className, styles.avatar, {
                [styles.small]: size === 'small',
                [styles.middle]: size === 'middle',
                [styles.large]: size === 'large',
            })}
            alt={alt}
            src={src}
            {...props}
        />
    )
};

export default Avatar;