import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import style from './Styles/ForgotPassword.css';
import background from './Assets/img1.jpg';
import axios from 'axios';

function ForgotUsername() {

  const [values, setValues] = useState({
    accountNumber: "",
    aadharNumber: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      'accountNumber': parseInt( values.accountNumber),
      'aadharNumber':values.aadharNumber,
    }
    console.log({ data });

    const config = {
      method: 'post',
      url: 'http://localhost:8080/api/username',
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

  return (
    <div className='BodyContainer' style={{
      backgroundImage: `url(${background})`, height: '100vh',


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
        <p className="lock-icon"  ><FontAwesomeIcon icon={faUser} /></p>
        <h2 style={style.h2}>Username Recovery</h2>
        <p style={{ color: "white", textAlign: "center" }}>Find your ID</p>
        <form onSubmit={handleSubmit}>
          <input name='accountNumber' onChange={handleChange} value={values.accountNumber} type="text" className="passInput" style={style.passInput} placeholder="Account Number" />
          <input name='aadharNumber' onChange={handleChange} value={values.aadharNumber} type="text" className="passInput" style={style.passInput} placeholder="Aadhar Number" />
          <button type='submit' className='PasswordButton' style={style.PasswordButton}>Get UserID</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotUsername;