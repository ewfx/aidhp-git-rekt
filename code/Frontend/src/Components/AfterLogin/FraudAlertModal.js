import styles from './Styles/Modal.module.css';

const FraudAlertModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Fraud Alert!</h2>
                <p>A fraudulent transaction has been detected.</p>
                <button onClick={onClose} className={styles.closeButton}>Close</button>
            </div>
        </div>
    );
};

export default FraudAlertModal;
