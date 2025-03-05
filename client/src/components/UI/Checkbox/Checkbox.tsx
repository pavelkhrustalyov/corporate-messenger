import { Theme } from '../../../types/types';
import styles from './Checkbox.module.css';
import cn from 'classnames';

interface IPropsCheckbox extends React.HTMLAttributes<HTMLInputElement>{
    theme: Theme
}

const Checkbox = ({ theme, ...props }: IPropsCheckbox) => {
    return (
        <label className={cn(styles['label-checked'], {
        [styles['dark']]: theme === 'dark',
        [styles['light']]: theme === 'light'
    })} htmlFor="theme">
        <div className={styles["round"]}></div>
        <input
            id="theme"
            className={styles.checkbox}
            name="theme"
            type="checkbox"
            checked={theme === 'dark'}
            {...props}
        />
        </label>
    )
};

export default Checkbox;
