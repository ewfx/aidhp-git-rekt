

import React, { useState } from 'react';
import styles from './Styles/Register.module.css';
import Image from './Assets/img1.jpg';
import axios from 'axios'

function CreateAccount() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [fatherName, setfatherName] = useState('');
    const [mobileNumber, setmobileNumber] = useState('');
    const [email, setemail] = useState('');
    const [aadharNumber, setaadharNumber] = useState('');
    const [dob,setdob] = useState('');
    const [gender,setgender] = useState('');
    const [address,setaddress] = useState('');
    const [redirectURL, setRedirectURL] = useState('')

    const openPopup = (message) => {
      setPopupMessage(message);
      setShowPopup(true);
    };

    const handleRedirect = () => {
      window.location.href = redirectURL; // Redirect to the specified URL
    };
    
  const handleSubmit = (e) => {
    e.preventDefault();
    // setShowOTPForm(true);
    console.log(firstName);
    console.log(lastName);
    console.log(fatherName);
    console.log(mobileNumber);
    console.log(email);
    console.log(aadharNumber);
    console.log(dob);
    console.log(gender);
    console.log(address);
    if(firstName.length===0){
      openPopup("First Name can't be empty");
    }
    else if(lastName.length===0){
      openPopup("Last Name can't be empty");
    }
    else if(fatherName.length===0){
      openPopup("Father's Name can't be empty");
    }
    else if(mobileNumber.length===0){
      openPopup("Mobile Number can't be empty");
    }
    else if(mobileNumber.length!==10){
      openPopup("Invalid phone number");
    }
    else if(email.length===0){
      openPopup("Email can't be empty");
    }
    else if(aadharNumber.length===0){
      openPopup("Aadhar Number can't be empty");
    }
    else if(aadharNumber.length!==12){
      openPopup("Invalid Aadhar Number");
    }
    else if(address.length===0){
      openPopup("Aadhar Number can't be empty");
    }
    else if(gender!=="Male"&&gender!=="Female"&&gender!=="female"&&gender!=="male" && gender!=="Other"){
      openPopup("Please enter Gender in Male, Female or Other");
    }
    else{
      const myData = {
        'firstName': firstName,
        'lastName':lastName,
        'fatherName':fatherName,
        'contactNumber':mobileNumber,
        'email':email,
        'identityProofNumber':aadharNumber,
        'dob':dob,
        'gender':gender,
        'address':address
      }
      axios.post('http://localhost:8080/api/createAccount', myData)
      .then((e)=>{
        console.log(e.data)
       openPopup("Welcome " + e.data.name +", \n \n Your Account Number is :" + e.data.accountNumber);
       setRedirectURL('./Register');
      })
      .catch((e)=>{
        alert(e.response.data)
        console.log(e.response);
      })
    }

  };

  

  return (
    <div id="particles-js" className={styles.registerContainer}>
      <div className={styles.imageContainer}>
        <img src={Image} alt="User Registration" />
      </div>
      
      {showPopup && (
  <div className={styles.popup}>
    <p>{popupMessage}</p>
    <button onClick={() => setShowPopup(false)}>Close</button>
    <button style={{margin: "10px"}} onClick={handleRedirect}>Activate Online Banking</button>
    
    
  </div>)}

      <div className={styles.formContainer}>
        <h1 className={styles.heading}>Create New Account</h1>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter First Name"
              onChange={(e)=>{
                setfirstName(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter Last Name"
              onChange={(e)=>{
                setlastName(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="fatherName">Father's Name:</label>
            <input
              type="text"
              id="fatherName"
              placeholder="Enter Father's Name"
              onChange={(e)=>{
                setfatherName(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input
              type="text"
              id="mobileNumber"
              placeholder="Enter Mobile Number"
              onChange={(e)=>{
                setmobileNumber(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email ID:</label>
            <input
              type="text"
              id="email"
              placeholder="Enter Email ID"
              onChange={(e)=>{
                setemail(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              placeholder="Enter Address"
              onChange={(e)=>{
                setaddress(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="gender">Gender:</label>
            <input
              type="text"
              id="gender"
              placeholder="Mention your Gender"
              onChange={(e)=>{
                setgender(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="aadharNumber">Aadhar Number:</label>
            <input
              type="text"
              id="aadharNumber"
              placeholder="Enter Aadhar Number"
              onChange={(e)=>{
                setaadharNumber(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
             
              onChange={(e)=>{
                setdob(e.target.value);
              }}
              className={styles.inputLg}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit" className={styles.btnPrimary}>Submit</button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
