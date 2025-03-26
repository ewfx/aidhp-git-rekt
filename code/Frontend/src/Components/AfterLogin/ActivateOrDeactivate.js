import React, { useState,useEffect } from 'react';
import JsonData from './Assets/data.json';
import axios from 'axios';

function ActivateDeactivate() {
    var data = [];
    const [varJson, setVarJson] = useState(data);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('');

    const handleSort = () => {
        if (!sortField) return; // Don't sort if sortField is empty

        const sorted = [...varJson];

        if (sortOrder === 'asc') {
            sorted.sort((a, b) => {
                if (a[sortField] > b[sortField]) return 1;
                if (a[sortField] < b[sortField]) return -1;
                return 0;
            });
            setSortOrder('desc');
        } else {
            sorted.sort((a, b) => {
                if (a[sortField] < b[sortField]) return 1;
                if (a[sortField] > b[sortField]) return -1;
                return 0;
            });
            setSortOrder('asc');
        }

        setVarJson(sorted);
    };

    const handleSortFieldChange = (e) => {
        setSortField(e.target.value);
    };

    const handleChange = (e) => {
        var a = data.filter((word) =>
            word.firstName.toLowerCase().startsWith(e.target.value.toLowerCase()) ||
            word.accountNumber.toString().startsWith(e.target.value)
        );
        setVarJson(a);
    };

    function enableOrDisable(val,accountNumer) {
        let url ='';
        if(val===true){
            url = 'http://localhost:8080/api/activate'
        }else{
            url = 'http://localhost:8080/api/deactivate'
        }
        const data = {
            'accountNumber': accountNumer,
        }

        const jwttoken = localStorage.getItem('jsonwebtoken');
        console.log("token " + jwttoken)
        const config = {
            method: 'post',
            url: url,
            headers: {
                'Authorization': 'Bearer ' + jwttoken,
            },
            data: data
        };

        axios.request(config).then(e => {
            console.log(e.data)
            alert(e.data);
            fetchData();
        }).catch(e => {
            alert(e.response.data);
            console.log(e.response)
        });

    }

    function enable(accountNumber){
        enableOrDisable(true,accountNumber)
    }

    function disable(accountNumber){
        enableOrDisable(false,accountNumber)
    }

    const fetchData = () => {
        const jwttoken = localStorage.getItem('jsonwebtoken');
        console.log("token " + jwttoken)
        const config = {
            method: 'get',
            url: 'http://localhost:8080/api/profiles',
            headers: {
                'Authorization': 'Bearer ' + jwttoken,
            }
        };



        axios.request(config).then(e => {
            console.log(e.data)
            data = e.data;
            setVarJson(e.data);
        }).catch(e => {
            console.log(e.response)
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

   

    return (
        <div>
            <h1 style={{ color: "#3498db" }}>User Accounts</h1>
            <div style={{ paddingLeft: "150px", alignItems: "center", width: "800px", margin: "0 auto" }}>
                <input
                    type='text'
                    placeholder='Search User Name | Account Number'
                    onChange={handleChange}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        width: '300px',
                        paddingRight: "15px",
                        borderRadius: "5px",
                        margin: "15px",
                    }}
                />

                <select
                    onChange={handleSortFieldChange}
                    value={sortField}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: "5px",
                    }}
                >
                    <option value=''>Sort</option>
                    <option value='firstName'>First Name</option>
                    <option value='lastName'>Last Name</option>
                    <option value='balance'>Balance</option>
                    <option value='accountNumber'>Account Number</option>
                    <option value='dob'>Date of Birth</option>
                </select>
                <button
                    onClick={handleSort}
                    style={{
                        borderRadius: "5px",
                        marginLeft: "5px",
                        fontSize: "16px",
                        backgroundColor: "#ccc4c4",
                        border: "0",
                        cursor: "pointer",
                        width: "35px",
                        height: "40px"
                    }}
                >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
            </div>
            { varJson.length>0?<section>
                <div style={{ width: "55vw", marginTop: "20px" }}>
                    {varJson.map((transaction, index) => (
                        <details
                            key={index}
                            style={{
                                marginBottom: '0px',
                                marginTop: '0px',
                                paddingBottom: '0px',
                            }}
                        >
                            <summary style={{ paddingBottom: "0px", paddingTop: "0px" }}>
                                <div
                                    className="user-info"
                                    style={{
                                        marginBottom: '10px',
                                    }}
                                >
                                    <div
                                        className="name"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: "0px"
                                        }}
                                    >
                                        <strong>
                                            {transaction.firstName} {transaction.lastName}
                                        </strong>
                                        <div>
                                            {!transaction.active?<button 
                                                onClick={()=>enable(transaction.accountNumber)}
                                                className="accept-button"
                                                style={{
                                                    marginRight: '10px',
                                                    backgroundColor: '#44e40abe',
                                                    padding: '5px 10px',
                                                    fontSize: '14px',
                                                    width: '70px',
                                                    height: '30px',
                                                }}
                                            >

                                                Enable
                                            </button>:<div/>
                                            }
                                            {transaction.active?<button
                                             onClick={()=>disable(transaction.accountNumber)}
                                                className="reject-button"
                                                style={{
                                                    backgroundColor: '#eb2828',
                                                    padding: '5px 10px',
                                                    fontSize: '14px',
                                                    width: '70px',
                                                    height: '30px',
                                                }}
                                            >
                                                Disable
                                            </button>:<div/>
}
                                        </div>
                                    </div>
                                    <div
                                        className="name"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <p style={{ margin: "0px" }}>Account Number: {transaction.accountNumber}</p>
                                        <div>
                                            <p>₹ {transaction.balance}</p>
                                        </div>
                                    </div>
                                </div>
                            </summary>
                            <div style={{ height: '15vh' }}>
                                <dl>
                                    <div style={{ width: '33.33%' }}>
                                        <dt>S/O:</dt>
                                        <dd>{transaction.fatherName}</dd>
                                    </div>
                                    <div style={{ width: '33.33%' }}>
                                        <dt>Email:</dt>
                                        <dd>{transaction.email}</dd>
                                    </div>
                                    <div style={{ width: '33.33%' }}>
                                        <dt>Contact:</dt>
                                        <dd>{transaction.contactNumber}</dd>
                                    </div>
                                    <div style={{ width: '33.33%' }}>
                                        <dt>DoB:</dt>
                                        <dd>{transaction.dob}</dd>
                                    </div>
                                    <div style={{ width: '33.33%' }}>
                                        <dt>Aadhar:</dt>
                                        <dd>{transaction.identityProofNumber}</dd>
                                    </div>
                                    <div style={{ width: '33.33%' }}>
                                        <dt>Address:</dt>
                                        <dd>{transaction.address}</dd>
                                    </div>
                                </dl>
                            </div>
                        </details>
                    ))}
                </div>
            </section>:<div><br/><br/><h4 style={{textAlign:"center"}}>No accounts found.</h4></div>}
        </div>
    );
}

export default ActivateDeactivate;