import styles from './ChatPlaceholder.module.css';

const ChatPlaceholder = () => {
    return (
        <div className={styles['chat-placeholder']}>
            <span className={styles.text}>Выберите чат или создайте новый</span>
        </div>
    )
};

export default ChatPlaceholder;