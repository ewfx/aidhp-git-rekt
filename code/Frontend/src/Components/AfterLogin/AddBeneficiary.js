import styles from './Styles/FundTransfer.module.css';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import React,{ useEffect } from 'react';

const AddBeneficiary=()=>{
    const navigate = useNavigate();
    
    const [values,setValue] = useState({
     sender_first_name : "",
     sender_last_name : "",
     sender_acc_no : "",
    })

    const handleChange = (e)=>{
        const {name,value} = e.target;
        setValue({...values, [name] : value});
    }

    const handlelogout=()=>{
        localStorage.removeItem('jsonwebtoken');
        navigate('/');
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(values);

        // if(values.sender_acc_no.length!=10)
        // alert("Please enter 10 digit account number")

           

    const data={
        'firstName' : values.sender_first_name,
        'lastName' : values.sender_last_name,
        'accountNumber' : parseInt(values.sender_acc_no)
    }

    const jwttoken=localStorage.getItem('jsonwebtoken');
    console.log("token "+jwttoken)
    const config={
      method : 'post',
      url : 'http://localhost:8080/api/addBeneficiary',
      headers : {
        'Authorization' : 'Bearer '+jwttoken,
      },
      data : data
    };
  
    axios.request(config).then(e=>{
        console.log(e.data)
        alert("Beneficiary is added successfully");
      }).catch(e=>{
        console.log(e.response)
        alert(e.response.data);
      });

    console.log({data});

}

    return (
        <div id="particles-js" className={styles.registerContainer}>

        <div className={styles.formContainer}>
        <h1 className={styles.heading}>Add Beneficiary</h1>
            <form className={styles.registerForm} onSubmit={handleSubmit}>

                <div className={styles.formGroup}>
                <label htmlFor="name" className="styles.formGroup">First Name :</label>
                <input
                id="name"
                type="text"
                name="sender_first_name"
                value={values.sender_first_name}
                required
                placeholder="First Name"
                onChange={handleChange}
                className={styles.inputLg}
                />
                </div>

                <div className={styles.formGroup}>
                <label htmlFor="name" className="styles.formGroup">Last Name :</label>
                <input
                id="name"
                type="text"
                name="sender_last_name"
                value={values.sender_last_name}
                required
                placeholder="Last Name"
                onChange={handleChange}
                className={styles.inputLg}
                />
                </div>

                <div className={styles.formGroup}>
                <label htmlFor="name">Sender Account Number :</label>
                <input
                id="name"
                type="text"
            
                name="sender_acc_no"
                value={values.sender_acc_no}
                required
                onChange={handleChange}
                className={styles.inputLg}
                placeholder="Enter Sender Account Number"
                />
                </div>

                <button type="submit" className={styles.btnPrimary}>Add</button>
            </form>
        </div>
        
        </div>
    )


}
export default AddBeneficiary;