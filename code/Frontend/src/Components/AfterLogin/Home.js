import React from 'react';
import './Styles/Dashboard.css'; // Import your CSS file
import wallet from './icons/wallet.png';
import pigicon from './icons/pig-icon.png';
import transfericon from './icons/transfer-icon.png';
import billsicon from './icons/bill-icon.png';
import cashicon from './icons/cash-icon.png';
import withdrawicon from './icons/withdraw-icon.png';
import crediticon from './icons/credit-icon.png';
import transactionicon from './icons/transaction-icon.png';
import beneficiaryicon from './icons/beneficiary-icon.png';


function Home() {
    
    return (

        <div>
            <div className="bottom-side">
                <div className="bottom-right">
                    <p className="history">History</p>

                    <div className="history-cards">
                        <div className="history-card-one">
                            <a href="#" className="card-link">
                                <img src={wallet} alt=" " />
                                <p className="wallet-card">Account Details</p>
                            </a>
                        </div>

                        <div className="history-card-one">
                            <a href="./FundTransfer" className="card-link">
                                <img src={transfericon} alt=" " />
                                <p className="wallet-card">Transfer Funds</p>
                            </a>
                        </div>

                        <div className="history-card-one">
                            <a href="#" className="card-link">
                                <img src={withdrawicon} alt=" " />
                                <p className="wallet-card">Withdraw</p>
                            </a>
                        </div>

                        <div className="history-card-one">
                            <a href="#" className="card-link">
                                <img src={cashicon} alt=" " />
                                <p className="wallet-card">Account Balance</p>
                            </a>
                        </div>

                        <div className="history-card-one">
                            <a href="#" className="card-link">
                                <img src={billsicon} alt=" " />
                                <p className="wallet-card">Account Statement</p>
                            </a>
                        </div>

                        <div className="history-card-one">
                            <a href="#" className="card-link">
                                <img src={pigicon} alt=" " />
                                <p className="wallet-card">Save Online</p>
                            </a>
                        </div>

                        <div className="history-card-one">
                            <a href="#" className="card-link">
                                <img src={crediticon} alt=" " />
                                <p className="wallet-card">Credit Card</p>
                            </a>
                        </div>

                        <div className="history-card-one">
                            <a href="#" className="card-link">
                                <img src={transactionicon} alt=" " />
                                <p className="wallet-card">Transaction report</p>
                            </a>
                        </div>

                        <div className="history-card-one">
                            <a href="#" className="card-link">
                                <img src={beneficiaryicon} alt=" " />
                                <p className="wallet-card">Beneficiary</p>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Home;
