import styles from './Loader.module.css';
import cn from 'classnames';

interface IPropsLoader extends React.HtmlHTMLAttributes<HTMLDivElement>{

}

const Loader = ({ className, ...props }: IPropsLoader) => {
    return <div className={cn(styles.loader, className)} {...props}></div>
};

export default Loader;