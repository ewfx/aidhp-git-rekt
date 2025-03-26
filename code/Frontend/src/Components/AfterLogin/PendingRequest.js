import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function PendingRequest() {

    const [requests, setRequests] = useState([]);

    function getPengingRequest() {
        const jwttoken = localStorage.getItem('jsonwebtoken');
        console.log("token " + jwttoken)
        const config = {
            method: 'get',
            url: 'http://localhost:8080/api/pendingRequests',
            headers: {
                'Authorization': 'Bearer ' + jwttoken,
            }
        };

        axios.request(config).then(e => {
            console.log(e.data)
            setRequests(e.data);
        }).catch(e => {
            console.log(e.response)
        });
    }

    function acceptOrReject(val,accountNumer) {
        let url ='';
        if(val===true){
            url = 'http://localhost:8080/api/accept'
        }else{
            url = 'http://localhost:8080/api/reject'
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
            getPengingRequest();
        }).catch(e => {
            alert(e.response.data);
            console.log(e.response)
        });

    }

    function accept(accountNumber){
        acceptOrReject(true,accountNumber)
    }

    function reject(accountNumber){
        acceptOrReject(false,accountNumber)
    }


    useEffect(() => {
        getPengingRequest();
    }, []);


    return (
        <div>
            <div>
                <h2 style={{ color: "#3498db", paddingTop: "20px" }}>Netbanking Requests</h2>
                <br />
                <br />
                {requests.length>0?<div style={{ width: "50vw", marginTop: "20px" }}>
                    {requests.map((request, index) => (
                        <details key={index} style={{ marginBottom: "0px", marginTop: "0px", paddingBottom: "0px" }}>
                            <summary>
                                <div className="user-info-aa" style={{ marginBottom: "10px" }}>
                                    <div className="name-aa" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", justifyItems: "center" }}>
                                        <strong>{request.firstName} {request.lastName}</strong>
                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                            <button onClick={() => accept(request.accountNumber)} className="accept-button" style={{ marginRight: "10px", backgroundColor: "#44e40abe", height: "40px", width: "80px", fontWeight: "bold" }}>Accept</button>
                                            <button onClick={() => reject(request.accountNumber)} className="reject-button" style={{ backgroundColor: "#eb2828", height: "40px", width: "80px", fontWeight: "bold" }}>Reject</button>
                                        </div>
                                    </div>
                                    <div className="account-number">
                                        <p>Account Number: {request.accountNumber}</p>
                                    </div>
                                </div>
                            </summary>
                            <div>
                                <dl style={{ display: "flex", flexWrap: "wrap" }}>
                                    <div style={{ flex: "1", marginRight: "2px" }}>
                                        <dt>S/O:</dt>
                                        <dd>{request.fatherName}</dd>
                                    </div>
                                    <div style={{ flex: "1", marginRight: "2px" }}>
                                        <dt>Email:</dt>
                                        <dd>{request.email}</dd>
                                    </div>
                                    <div style={{ flex: "1", marginRight: "2px" }}>
                                        <dt>Contact:</dt>
                                        <dd>{request.contactNumber}</dd>
                                    </div>
                                    <div style={{ flex: "1", marginRight: "px" }}>
                                        <dt>DoB:</dt>
                                        <dd>{request.dob}</dd>
                                    </div>
                                </dl>
                            </div>
                        </details>
                    ))}
                </div>: <div><br/><br/><h4 style={{textAlign:"center"}}>No pending requests found.</h4></div>}
            </div>
        </div>
    );
}

export default PendingRequest;