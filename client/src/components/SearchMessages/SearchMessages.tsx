import styles from './SearchMessages.module.css';
import Input from '../UI/Input/Input';
import { ChangeEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { updateMessages } from '../../store/messageSlice/messageSlice';

const SearchMessages = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const timeout = setTimeout(async () => {
            try {
                const response = await axios.get(`api/messages/66657ac6f9abbe5e3e1a038a/search?text=${searchValue}`);
                dispatch(updateMessages(response.data));
            } catch (error) {
                console.log(error);
            }
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchValue, dispatch]);


    return (
        <div className={classNames(styles['room-type'], {
            'isVisible': isVisible
        })}>
            <img 
                onClick={() => setIsVisible((prevState) => !prevState)} 
                className={styles.icon}
                src="../search.svg" 
                alt="Поиск"
            />
            <Input 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)} 
                value={searchValue} type="search" 
                className={classNames(styles["search__input"], {
                    [styles.isVisible]: isVisible
            })} placeholder='Поиск сообщений' />
            
        </div>
    );
}

export default SearchMessages;