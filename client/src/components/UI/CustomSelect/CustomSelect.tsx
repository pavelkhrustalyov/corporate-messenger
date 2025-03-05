import { SelectType } from '../../../types/types';
import styles from './CustomSelect.module.css';
import cn from 'classnames';

interface ISelectProps extends React.HTMLAttributes<HTMLSelectElement> {
    data: SelectType[];
    selectHandler: (el: any) => void;
    value?: string
}

const CustomSelect = ({ className, data, selectHandler, value, ...otherProps }: ISelectProps) => {
    return (
        <select
            value={value}
            onChange={(e) => selectHandler(e.target.value)}
            className={cn(styles.select, className, {})} 
            {...otherProps}>
            {
                data.map(item => {
                    return <option key={item.field} value={item.field}>{item.title}</option>
                })
            }
        </select>
    );
};

export default CustomSelect;
