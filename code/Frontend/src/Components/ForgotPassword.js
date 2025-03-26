import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import style from './Styles/ForgotPassword.css';
import background from './Assets/img1.jpg';
import axios from 'axios';

function ForgotPassword() {
  const [values, setValues] = useState({
    userID: "",
    accountNumber: "",
    aadharNumber: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.newPassword.length < 4)
      alert("Password should be atleast 4 characters")
    else {
      if (values.newPassword != values.confirmNewPassword)
        alert("New Password and Confirm Password should match!")
      else {
        const data = {
          'userId': values.userID,
          'accountNumber': parseInt(values.accountNumber),
          'aadharNumber': values.aadharNumber,
          'newPassword': values.newPassword,
        }
        console.log({ data });

        const config = {
          method: 'post',
          url: 'http://localhost:8080/api/forgotPassword',
          data: data
        };

        axios.request(config).then(e => {
          console.log(e.data)
          alert(e.data);
        }).catch(e => {
          alert(e.response.data);
          console.log(e.response)
        });
      }
    }
  }

  return (
    <div className='BodyContainer' style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="card" style={style.card}>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
            integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
            crossorigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <p className="lock-icon"  ><FontAwesomeIcon icon={faLock} /></p>
        <h2 style={style.h2}>Lost your key?</h2>
        <p style={{ color: "#0f3c4c", textAlign: "center" }}>You can reset your Password here</p>
        <form onSubmit={handleSubmit}>
          <input name='userID' onChange={handleChange} value={values.userID} type="text" className="passInput" style={style.passInput} placeholder="User ID" />
          <input name='accountNumber' onChange={handleChange} value={values.accountNumber} type="text" className="passInput" style={style.passInput} placeholder="Account Number" />
          <input name='aadharNumber' onChange={handleChange} value={values.aadharNumber} type="text" className="passInput" style={style.passInput} placeholder="Aadhar Number" />
          <input name='newPassword' onChange={handleChange} value={values.newPassword} type="text" className="passInput" style={style.passInput} placeholder="New Password" />
          <input name='confirmNewPassword' onChange={handleChange} value={values.confirmNewPassword} type="text" className="passInput" style={style.passInput} placeholder="Confirm New Password" />
          <button type='submit' className='PasswordButton' style={style.PasswordButton}>Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;