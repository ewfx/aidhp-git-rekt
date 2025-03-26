// Register.js

import React, { useState } from 'react';
import styles from './Styles/Register.module.css';
import Image from './Assets/img1.jpg';
import axios from 'axios'
import JwtLogin from './JwtLogin';

function Register() {
  JwtLogin();
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [confirmLoginPassword, setConfirmLoginPassword] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [confirmTransactionPassword, setConfirmTransactionPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [popupMessage, setPopupMessage] = useState(''); // Define popup message state
  const [showPopup, setShowPopup] = useState(false); // Define popup visibility state
  const [redirectURL, setRedirectURL] = useState(''); // Define redirect URL state

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(accountNumber);
    console.log(userName);
    console.log(loginPassword);
    console.log(confirmLoginPassword);
    console.log(transactionPassword);
    console.log(confirmTransactionPassword);
    console.log(phoneNumber);
    if (userName.length === 0) {
      setPopupMessage("Username can't be empty");
      setShowPopup(true);
    } else if (accountNumber.length === 0) {
      setPopupMessage("Account number can't be empty");
      setShowPopup(true);
    } else if (loginPassword !== confirmLoginPassword) {
      setPopupMessage("Invalid login password");
      setShowPopup(true);
    } else if (transactionPassword !== confirmTransactionPassword) {
      setPopupMessage("Invalid transaction password");
      setShowPopup(true);
    } else if (phoneNumber.length !== 10) {
      setPopupMessage("Invalid phone number");
      setShowPopup(true);
    } else {
      const myData = {
        username: userName,
        accountNumber: accountNumber,
        accountPassword: loginPassword,
        transactionPassword: transactionPassword,
        phoneNumber: phoneNumber,
      };
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/api/enableNetBanking',
        data: myData,
      };
      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          setPopupMessage(
            'Your Online Banking Account Is Officially Activated And Ready To Go'
          );
          setShowPopup(true);
          setRedirectURL('./Login'); // Set the redirect URL
        })
        .catch((error) => {
          alert(error.response.data)
          console.log(error.response);
        });
    }
  };

  const handleRedirect = () => {
    window.location.href = redirectURL; // Redirect to the specified URL
  };

  

  return (
    <div id="particles-js" className={styles.registerContainer}>
      <div className={styles.imageContainer}>
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" alt="User Registration" />
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <p>{popupMessage}</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
          <button style={{ margin: '10px' }} onClick={handleRedirect}>
            Login
          </button>
        </div>
      )}
    
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>User Registration</h1>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="accountNumber">Account Number:</label>
            <input
              type="text"
              id="accountNumber"
              placeholder="Enter Account Number"
              onChange={(e)=>{
                setAccountNumber(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              onChange={(e)=>{
                setUserName(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="loginPassword">Set Login Password:</label>
            <input
              type="password"
              id="loginPassword"
              placeholder="Set Login Password"
              onChange={(e)=>{
                setLoginPassword(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmLoginPassword">Confirm Login Password:</label>
            <input
              type="password"
              id="confirmLoginPassword"
              placeholder="Confirm Login Password"
              onChange={(e)=>{
                setConfirmLoginPassword(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="transactionPassword">Set Transaction Password:</label>
            <input
              type="password"
              id="transactionPassword"
              placeholder="Set Transaction Password"
              onChange={(e)=>{
                setTransactionPassword(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmTransactionPassword">Confirm Transaction Password:</label>
            <input
              type="password"
              id="confirmTransactionPassword"
              placeholder="Confirm Transaction Password"
              onChange={(e)=>{
                setConfirmTransactionPassword(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          {!showOTPForm && (
            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="Enter Phone Number"
                onChange={(e)=>{
                  setPhoneNumber(e.target.value);
                }}
                className={styles.inputLg}
                required
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <button type="submit" className={styles.btnPrimary}>Submit</button>
          </div>
   
        </form>
      </div>
    </div>


  );
}

export default Register;
