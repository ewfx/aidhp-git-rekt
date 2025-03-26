import React, { useState } from 'react';
import styles from './Styles/Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    if (username.length === 0) {
        setErrorMessage("Please enter your username.");
        return;  // Stop execution
    } 
    
    if (password.length < 4) {
        setErrorMessage("Invalid password. Please try again.");
        return;  // Stop execution
    }

    const transferData = {
        name: username,
        password: password
    };

    axios.post('http://localhost:8000/login', transferData)
    .then(res => {
        console.log(res.data);
        if (res.data.status === false) {
            setErrorMessage("Invalid credentials. Please try again.");
        } else {
            navigate('/Dashboard');
            localStorage.setItem('username', res.data.Customer_Id);
            localStorage.setItem('name', transferData.name);
        }
    })
    .catch(err => {
        alert("Login failed!");
        console.log(err.response);
    });
};


  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageContainer}>
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Login"
        />
      </div>
      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <div className={styles.container}>
            <div className={styles.loginContainerWrapper}>
              <div className={styles.welcome}>
                <strong>Let's get you logged in!</strong>
              </div>
              <form onSubmit={handleOnSubmit}>
                <div className={styles.formGroup}>
                  <input
                    id="login_username"
                    className={styles.inputLg}
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    id="login_password"
                    className={styles.inputLg}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  {errorMessage && <p className={styles.errorText}>{errorMessage}</p>} {/* Show error message */}
                </div>
                <div className={styles.formGroup}>
                  <button type='submit' className={styles.btnPrimary}>Login</button>
                </div>
              </form>
              <div className={styles.forgotLinks}>
                <a href="./ForgotUsername" className={styles.forgotUsername}>
                  Forgot Username?
                </a>
                <span className={styles.divider}>|</span>
                <a href="./ForgotPassword" className={styles.forgotPassword}>
                  Forgot Password?
                </a>
              </div>
              <div className={styles.registerLink}>
                <p>
                  New to the world of online banking? Let's get you started –{' '}
                  <a href="./Register">Register now!</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
