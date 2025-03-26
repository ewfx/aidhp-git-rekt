import { useState, useEffect } from "react";
import styles from './Styles/FundTransfer.module.css';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";

const FundTransfer = ({ value }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [storedUsername, setStoredUsername] = useState("");
    const [values, setValues] = useState({
        sender_first_name: "",
        sender_last_name: "",
        sender_acc_no: "",
        transaction_password: "",
        amount_to_send: "",
        transaction_type: "",
        category: "",
        purchase_date: "",
        payment_mode: "",
        merchant_vendor: "",
    });

    const [loading, setLoading] = useState(false);
    const [fraudAlert, setFraudAlert] = useState(null);
    const [successAlert, setSuccessAlert] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        setStoredUsername(username);

        if (value) {
            setValues({
                sender_first_name: value.firstName || "",
                sender_last_name: value.lastName || "",
                sender_acc_no: value.accountNumber || "",
                transaction_password: "",
                amount_to_send: value.Amount || "",
                transaction_type: value.Transaction_Type || "",
                category: value.Category || "",
                purchase_date: value.Purchase_Date || "",
                payment_mode: value.Payment_Mode || "",
                merchant_vendor: value.Merchant_Vendor || "",
            });
        }
    }, [value]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const transferData = {
            Amount: parseFloat(values.amount_to_send),
            customer_id: storedUsername,
            Transaction_Type: values.transaction_type,
            Category: values.category,
            Purchase_Date: values.purchase_date,
            Payment_Mode: values.payment_mode,
            Merchant_Vendor: values.merchant_vendor,
        };

        axios.post('http://localhost:8000/addTransaction', transferData)
            .then(res => {
                setLoading(false);
                console.log(res.data);

                if (res.data.is_fraudulent) {
                    setFraudAlert(res.data);
                } else {
                    setSuccessAlert(res.data);
                    // Clear all input fields (except customer_id)
                    setValues({
                        sender_first_name: "",
                        sender_last_name: "",
                        sender_acc_no: "",
                        transaction_password: "",
                        amount_to_send: "",
                        transaction_type: "",
                        category: "",
                        purchase_date: "",
                        payment_mode: "",
                        merchant_vendor: "",
                    });
                }
            })
            .catch(err => {
                setLoading(false);
                alert("Fund transfer failed!");
                console.log(err.response);
            });
    };

    return (
        <div id="particles-js">
            <div className={styles.formContainer}>
                <h1 className={styles.heading}>Fund Transfer</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Customer ID :</label>
                        <input type="text" name="customer_id" value={storedUsername} readOnly className={styles.inputLg} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Transaction Type :</label>
                        <input type="text" name="transaction_type" value={values.transaction_type} onChange={handleChange} className={styles.inputLg} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Category :</label>
                        <input type="text" name="category" value={values.category} onChange={handleChange} className={styles.inputLg} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Amount :</label>
                        <input type="text" name="amount_to_send" value={values.amount_to_send} onChange={handleChange} className={styles.inputLg} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Purchase Date :</label>
                        <input type="text" name="purchase_date" value={values.purchase_date} onChange={handleChange} className={styles.inputLg} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Payment Mode :</label>
                        <input type="text" name="payment_mode" value={values.payment_mode} onChange={handleChange} className={styles.inputLg} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Merchant/Vendor :</label>
                        <input type="text" name="merchant_vendor" value={values.merchant_vendor} onChange={handleChange} className={styles.inputLg} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Transaction Password :</label>
                        <input type="password" name="transaction_password" value={values.transaction_password} onChange={handleChange} className={styles.inputLg} required />
                    </div>

                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                        {loading ? <span className={styles.spinner}></span> : "Send"}
                    </button>
                </form>
            </div>

            {/* Fraud Alert Modal */}
            {fraudAlert && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={() => setFraudAlert(null)}>✖</button>
                        <h2 className={styles.modalTitle}>⚠ Fraudulent Transaction Detected</h2>
                        <p><strong>Risk Score:</strong> {fraudAlert.risk_score}</p>
                        <p><strong>Explanation:</strong> {fraudAlert.explanation}</p>
                        <p><strong>Recommended Action:</strong> {fraudAlert.recommended_action}</p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {successAlert && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent} style={{ border: "2px solid green" }}>
                        <button className={styles.closeButton} onClick={() => setSuccessAlert(null)}>✖</button>
                        <h2 className={styles.modalTitle} style={{ color: "green" }}>✅ Transaction Successful!</h2>
                        <FaCheckCircle size={50} color="green" style={{ display: "block", margin: "auto" }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FundTransfer;
