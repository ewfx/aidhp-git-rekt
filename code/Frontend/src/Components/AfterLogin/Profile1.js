import React, { useState } from 'react';
import './Styles/Profile1.css';
import search from './icons/sr.png';

function Profile() {
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    // Dummy data directly here
    const [data, setData] = useState({
        firstName: storedName,
        lastName: "Doe",
        username: storedName,
        fatherName: "Richard Doe",
        dob: "01-01-1990",
        gender: "Female",
        accountNumber: "1234567890",
        balance: "₹10,000",
        email: storedName+"@gmail.com",
        contactNumber: "9876543210",
        address: "123 Main Street, City",
        identityProofNumber: "ID12345678"
    });


    const [accountNumber, setAccountNumber] = useState('');
    const [admin, setAdmin] = useState(false); // Dummy admin flag

    const handleChange = (e) => {
        setAccountNumber(e.target.value);
 
    };

    const onSearch = () => {
        alert(`Search clicked! Account Number: ${accountNumber}`);
        // You can set data dynamically if needed
    };

    return (
        <div id='parent'>

            {/* Admin Search Bar */}
            {admin === true ? (
                <div id='search-bar'>
                    <input
                        id="account_number"
                        type="text"
                        name="account_number"
                        required
                        placeholder="Account Number"
                        className='inputLg'
                        onChange={handleChange}
                    />
                    <div className="search-circle" onClick={onSearch}>
                        <a href="#" className="icon-link">
                            <img alt=" " className="logout-icon" src={search} />
                        </a>
                    </div>
                </div>
            ) : <div />}

            <br /><br />

            {/* Profile Info */}
            <div id='info-box'>
                <div id='left'>
                    <img src="https://img.icons8.com/bubbles/100/000000/user.png" className="img-radius" alt="User-Profile-Image" />
                    <p className='left-text'>{data.firstName + " " + data.lastName}</p>
                    <p className='left-text'>{storedUsername}</p>
                </div>

                <div id='right'>

                    <p className='right-title'>Personal details</p>
                    <div className='devider'></div>

                    <div className='info-container'>
                        <div className='profile-info'>
                            <p className='right-title'>Name</p>
                            <p className='info-text'>{data.firstName + " " + data.lastName}</p>
                        </div>

                        <div className='profile-info'>
                            <p className='right-title'>Father's name</p>
                            <p className='info-text'>{data.fatherName}</p>
                        </div>
                    </div>

                    <div className='info-container'>
                        <div className='profile-info'>
                            <p className='right-title'>DOB</p>
                            <p className='info-text'>{data.dob}</p>
                        </div>

                        <div className='profile-info'>
                            <p className='right-title'>Gender</p>
                            <p className='info-text'>{data.gender}</p>
                        </div>
                    </div>

                    <br />

                    <p className='right-title'>Bank details</p>
                    <div className='devider'></div>

                    <div className='info-container'>
                        <div className='profile-info'>
                            <p className='right-title'>Account Number</p>
                            <p className='info-text'>{data.accountNumber}</p>
                        </div>

                        <div className='profile-info'>
                            <p className='right-title'>Balance</p>
                            <p className='info-text'>{data.balance}</p>
                        </div>
                    </div>

                    <br />

                    <p className='right-title'>Contact details</p>
                    <div className='devider'></div>

                    <div className='info-container'>
                        <div className='profile-info'>
                            <p className='right-title'>Email</p>
                            <p className='info-text'>{data.email}</p>
                        </div>

                        <div className='profile-info'>
                            <p className='right-title'>Phone</p>
                            <p className='info-text'>{data.contactNumber}</p>
                        </div>
                    </div>

                    <div className='info-container'>
                        <div className='profile-info'>
                            <p className='right-title'>Address</p>
                            <p className='info-text'>{data.address}</p>
                        </div>

                        <div className='profile-info'>
                            <p className='right-title'>Identity Proof Number</p>
                            <p className='info-text'>{data.identityProofNumber}</p>
                        </div>
                    </div>

                    <br />
                </div>
            </div>
            <br /><br />
        </div>
    );
}

export default Profile;
