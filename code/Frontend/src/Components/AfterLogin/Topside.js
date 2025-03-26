import React from 'react';
import decoration from './images/decoration.png'; // Import your image paths
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import "./Styles/Dashboard.css"

function TopSide() {
  return (
    <div className="top-side">
     
     <img alt=" " className="decoration" src={decoration}/>

    <div className="top-first">
      <div className="dollar-stats">
        {/* <p className="overall">Overall</p>
        <p className="price">₹12,577.00</p> */}
      </div>
    </div>

    <div className="top-second">
      {/* <div className="notification">
        <img alt=" " className="notification-icon" src={notification}/>
        <div className="notification-count"></div>
      </div> */}
      <div className="profile-div">
      <p className="lock-icon"  ><FontAwesomeIcon icon={faUser} /></p>
      </div>
    </div>
  </div>

    
  );
}

export default TopSide;
