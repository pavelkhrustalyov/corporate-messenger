import styles from './CustomSelect.module.css';
import cn from 'classnames';

interface ISelectProps extends React.HTMLAttributes<HTMLSelectElement> {
    data: string[];
    selectHandler: (el: string) => void;
}

const CustomSelect = ({ className, data, selectHandler, ...otherProps }: ISelectProps) => {
    return (
        <select onChange={(e) => selectHandler(e.target.value)} className={cn(styles.select, className, {})} {...otherProps} >
            {
                data.map(item => {
                    return <option key={item} value={item}>{item}</option>
                })
            }
        </select>
    );
};

export default CustomSelect;