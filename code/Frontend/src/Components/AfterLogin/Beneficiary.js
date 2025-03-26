import style from './Styles/Beneficiary.module.css';
import { useNavigate } from 'react-router-dom';
import React,{ useState, useEffect } from 'react';
import axios from 'axios';

const Beneficiary = ({onAddBeneficiaryAddClick,sendMoney}) => {

    const navigate = useNavigate();

    const handleAddBeneficiary = () => {
        onAddBeneficiaryAddClick();
    }

    

    const handlesendmoney = (value) => {
        sendMoney(value)
       // navigate('/FundTransfer', { state: { value } });
    }

    const [json, setJson] = useState([]);

      const jwttoken=localStorage.getItem('jsonwebtoken');
        console.log("token "+jwttoken)
        const config={
          method : 'get',
          url : 'http://localhost:8080/api/beneficiaries',
          headers : {
            'Authorization' : 'Bearer '+jwttoken,
          }
        };  
        useEffect(()=>{
          axios.request(config).then(e=>{
            console.log(e.data)
            setJson(e.data,[])
          }).catch(e=>{
            alert(e.response.data)
            console.log(e.response)
          });
        },[]);

    return (
        <div className={style.container}>
            <div>
                <h1>Beneficiary</h1>

            </div>
            <div>
                {json.length>0?<table className={style.mytable}>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Account Number</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {json.map((value, key) => (
                            <tr key={key}>
                                <td>{value.firstName}</td>
                                <td>{value.lastName}</td>
                                <td>{value.accountNumber}</td>
                                <td><button onClick={() => handlesendmoney(value)} className={style.btn}>Send Money</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>:<h4>No beneficiaries found!</h4>}
            </div>

            <div className={style.buttonContainer}>
                <button onClick={handleAddBeneficiary} className={style.addBeneficiary}>Add Beneficiary</button>
            </div>
        </div>
    );
}
export default Beneficiary;