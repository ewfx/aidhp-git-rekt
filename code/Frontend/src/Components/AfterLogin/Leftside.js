import React, { useEffect, useState } from 'react';
import logo from './icons/logo.png';
import Home from './icons/Home.png';
import wallet from './icons/wallet.png';
import profile from './icons/profile.png';
import transactionicon from './icons/transfer-icon.png';
import power from './icons/power.png';

import activateDeactivateIcon from './icons/transaction-icon.png';
import pigicon from './icons/pig-icon.png';
import billsicon from './icons/bill-icon.png';
import cashicon from './icons/cash-icon.png';
import withdrawicon from './icons/withdraw-icon.png';
import crediticon from './icons/credit-icon.png';
import beneficiaryicon from './icons/beneficiary-icon.png';
import add from './icons/add.png';
import axios from "axios";

function LeftSide({ onClickTab, beneficiarieClick, sendMoneyClick }) {

  const [response, setJson] = useState([]);

  const jwttoken = localStorage.getItem('jsonwebtoken');
  console.log("token " + jwttoken)
  const config = {
    method: 'get',
    url: 'http://localhost:8080/api/account',
    headers: {
      'Authorization': 'Bearer ' + jwttoken,
    }
  };

  useEffect(() => {
    axios.request(config).then(e => {
      console.log(e.data)
      setJson(e.data, [])
    }).catch(e => {
      console.log(e.response)
    });
  }, []);

  const [active, setActive] = useState('userDetails');

  var isAdmin = true;

  function handleAddBenificiaryClickFromParent() {
    handleAddBenificiaryClick();

  }

  function handleSendClickFromParent(data) {
    handleTransferClick();

  }

  useEffect(() => {
    beneficiarieClick(() => handleAddBenificiaryClickFromParent);
  }, [])

  useEffect(() => {
    sendMoneyClick(() => handleSendClickFromParent);
  }, [])


  function handleHomeClick() {
    setActive('home');
    onClickTab('home');
  }

  function handleTransferClick() {
    setActive('transfer');
    onClickTab('transfer');
  }

  function handleTransactionHistoryClick() {
    setActive('transactionHistory');
    onClickTab('transactionHistory');
  }

  function handleAccountStatementClick() {
    setActive('accountStatement');
    onClickTab('accountStatement');
  }

  function handleUserDetailsClick() {
    setActive('userDetails');
    onClickTab('userDetails');
  }

  function handleBenificiaryClick() {
    setActive('beneficiary');
    onClickTab('beneficiary');
  }

  function handleDepositClick() {
    setActive('deposit')
    onClickTab('deposit');
  }

  function handleWithdrawClick() {
    setActive('withdraw')
    onClickTab('withdraw');
  }

  function handleAddBenificiaryClick() {
    setActive('addBenificiary')
    onClickTab('addBenificiary');
  }

  function handleUpdatePassClick() {
    setActive('updatePassword')
    onClickTab('updatePassword');
  }

  function handleLogout() {
    setActive('logout')
    onClickTab('logout');
  }

  function pendingRequests() {
    setActive('pendingRequests')
    onClickTab('pendingRequests');
  }

  function adAccounts(){
    setActive('adAccounts')
    onClickTab('adAccounts');
  }

  return (

    <div className="left-side">
      <div className="left-top">
        <div className="logo">
          <div className="logo-div">
            <a href="#" className="logo-link">
              <img alt=" " className="logo-icon" src={logo} />
            </a>
          </div>
          <a href="#" className="logo-name">NovaBank</a>
        </div>

        <div className="balance">
          <div className="balance-heading">
            <p className="balance-text">Balance</p>
            <p className="balance-text">{'₹ ' + 10000}</p>
          </div>
          {/* <div className="dots">
            <div className="div-circle"></div>
            <div className="div-circle"></div>
            <div className="div-circle"></div>
          </div> */}
        </div>

        <br/>

        <div className="home-menu">
          {/* <div onClick={handleHomeClick} className={active === 'home' ? "icons-list-selected" : "icons-list"}>
            <div className="icons-circle">
              <a href="#" className="icon-link">
                <img alt=" " className="icons" src={Home} />
              </a>
            </div>
            <a href="#" className="home">Home</a>
          </div> */}

          {
            response.admin === true ?
              <div onClick={pendingRequests} className={active === 'pendingRequests' ? "icons-list-selected" : "icons-list"}>
                <div className="icons-circle">
                  <a href="#" className="icon-link">
                    <img alt=" " className="icons" src={wallet} />
                  </a>
                </div>
                <a href="#" className="home">Pending Requests</a>
              </div> : <div />
          }
          {
            response.admin === true ?
              <div onClick={adAccounts} className={active === 'adAccounts' ? "icons-list-selected" : "icons-list"}>
                <div className="icons-circle">
                  <a href="#" className="icon-link">
                    <img alt=" " className="icons" src={activateDeactivateIcon} />
                  </a>
                </div>
                <a href="#" className="home">Activate/Decativate users</a>
              </div> : <div />
          }



          <div onClick={handleUserDetailsClick} className={active === 'userDetails' ? "icons-list-selected" : "icons-list"}>
            <div className="icons-circle">
              <a href="#" className="icon-link">
                <img alt=" " className="icons" src={profile} />
              </a>
            </div>
            <a href="#" className="home">User Details</a>
          </div>

          <div onClick={handleTransferClick} className={active === 'transfer' ? "icons-list-selected" : "icons-list"}  >
            <div className="icons-circle">
              <a href="#" className="icon-link">
                <img alt=" " className="icons" src={transactionicon} />
              </a>
            </div>
            <a href="#" className="home">Transfer Funds</a>
          </div>

          <div onClick={handleTransactionHistoryClick} className={active === 'transactionHistory' ? "icons-list-selected" : "icons-list"} >
            <div className="icons-circle">
              <a href="#" className="icon-link">
                <img alt=" " className="icons" src={billsicon} />
              </a>
            </div>
            <a href="#" className="home">Transaction history</a>
          </div>

          <div onClick={handleBenificiaryClick} className={active === 'beneficiary' ? "icons-list-selected" : "icons-list"} >
            <div className="icons-circle">
              <a href="#" className="icon-link">
                <img alt=" " className="icons" src={beneficiaryicon} />
              </a>
            </div>
            <a href="#" className="home">Beneficiary</a>
          </div>

          <div onClick={handleAddBenificiaryClick} className={active === 'addBenificiary' ? "icons-list-selected" : "icons-list"} >
            <div className="icons-circle">
              <a href="#" className="icon-link">
                <img alt=" " className="icons" src={add} />
              </a>
            </div>
            <a href="#" className="home">Add Beneficiary</a>
          </div>


          {
            response.admin ? <div onClick={handleDepositClick} className={active === 'deposit' ? "icons-list-selected" : "icons-list"} >
              <div className="icons-circle">
                <a href="#" className="icon-link">
                  <img alt=" " className="icons" src={pigicon} />
                </a>
              </div>
              <a href="#" className="home">Deposit</a>
            </div> : <div />
          }

          {
            response.admin ? <div onClick={handleWithdrawClick} className={active === 'withdraw' ? "icons-list-selected" : "icons-list"} >
              <div className="icons-circle">
                <a href="#" className="icon-link">
                  <img alt=" " className="icons" src={withdrawicon} />
                </a>
              </div>
              <a href="#" className="home">Withdraw</a>
            </div> : <div />
          }

          <div onClick={handleUpdatePassClick} className={active === 'updatePassword' ? "icons-list-selected" : "icons-list"} >
            <div className="icons-circle">
              <a href="#" className="icon-link">
                <img alt=" " className="icons" src={crediticon} />
              </a>
            </div>
            <a href="#" className="home">Update Password</a>
          </div>

          <div onClick={() => { setActive('Offers'); onClickTab('Offers'); }} className={active === 'Offers' ? "icons-list-selected" : "icons-list"}>
  <div className="icons-circle">
    <a href="#" className="icon-link">
      <img alt=" " className="icons" src={wallet} /> {/* Replace with another icon if desired */}
    </a>
  </div>
  <a href="#" className="home">Recommendations</a>
</div>

<div onClick={() => { setActive('Recommendations'); onClickTab('Recommendations'); }} className={active === 'Recommendations' ? "icons-list-selected" : "icons-list"}>
  <div className="icons-circle">
    <a href="#" className="icon-link">
      <img alt=" " className="icons" src={wallet} /> {/* Replace with another icon */}
    </a>
  </div>
  <a href="#" className="home">Offers</a>
</div>

<div onClick={() => { setActive('BankingAssistant'); onClickTab('BankingAssistant'); }} className={active === 'BankingAssistant' ? "icons-list-selected" : "icons-list"}>
  <div className="icons-circle">
    <a href="#" className="icon-link">
      <img alt=" " className="icons" src={wallet} /> {/* Replace with another icon */}
    </a>
  </div>
  <a href="#" className="home">Banking Trivia</a>
</div>





        </div>


        <div className="logouta" onClick={handleLogout}>
          <div className="logout-circle">
            <a href="#" className="icon-link">
              <img alt=" " className="logout-icon" src={power} />
            </a>
          </div>
          <a href="#" className="home">Logout</a>
        </div>

      </div>
    </div>
  )
}

export default LeftSide;