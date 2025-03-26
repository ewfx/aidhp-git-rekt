import React from 'react';
import './Styles/Profile1.css'; // Adjust if you have specific CSS

function Profile() {
  const dummyProfile = {
    firstName: "John",
    lastName: "Doe",
    fatherName: "Richard Doe",
    dob: "01-01-1990",
    gender: "Male",
    accountNumber: "1234567890",
    balance: "₹10,000",
    email: "john.doe@example.com",
    phone: "9876543210",
    address: "123 Main Street, City",
    idProof: "ID12345678"
  };

  return (
    <div className="profile-container" style={{ display: "flex", padding: "20px", background: "#fff", borderRadius: "10px" }}>
      {/* Left Side */}
      <div className="left-section" style={{ flex: "1", textAlign: "center", background: "linear-gradient(135deg, #f857a6, #ff5858)", padding: "30px", borderRadius: "10px 0 0 10px" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
          alt="Profile"
          style={{ width: "100px", borderRadius: "50%", marginBottom: "10px" }}
        />
        <h3 style={{ color: "#fff" }}>{dummyProfile.firstName} {dummyProfile.lastName}</h3>
        <p style={{ color: "#fff" }}>@{dummyProfile.firstName.toLowerCase()}</p>
      </div>

      {/* Right Side */}
      <div className="right-section" style={{ flex: "2", padding: "30px" }}>
        <h4>Personal Details</h4>
        <p><strong>Name:</strong> {dummyProfile.firstName} {dummyProfile.lastName}</p>
        <p><strong>Father's Name:</strong> {dummyProfile.fatherName}</p>
        <p><strong>DOB:</strong> {dummyProfile.dob}</p>
        <p><strong>Gender:</strong> {dummyProfile.gender}</p>

        <h4 style={{ marginTop: "20px" }}>Bank Details</h4>
        <p><strong>Account Number:</strong> {dummyProfile.accountNumber}</p>
        <p><strong>Balance:</strong> {dummyProfile.balance}</p>

        <h4 style={{ marginTop: "20px" }}>Contact Details</h4>
        <p><strong>Email:</strong> {dummyProfile.email}</p>
        <p><strong>Phone:</strong> {dummyProfile.phone}</p>
        <p><strong>Address:</strong> {dummyProfile.address}</p>
        <p><strong>Identity Proof Number:</strong> {dummyProfile.idProof}</p>
      </div>
    </div>
  );
}

export default Profile;
