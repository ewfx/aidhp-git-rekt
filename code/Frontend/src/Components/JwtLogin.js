import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const JwtLogin=()=>{
    const navigate=useNavigate();
    const jwttoken=localStorage.getItem('jsonwebtoken');
    if(jwttoken==null){
      return;
    }
    console.log("token "+jwttoken)
    const config={
      method : 'get',
      url : 'http://localhost:8080/api/auth/validation',
      headers : {
        'Authorization' : 'Bearer '+jwttoken,
      }
    };
  
    axios.request(config).then(e=>{
        console.log(e.data)
        navigate('/Dashboard')
      }).catch(e=>{
        console.log(e.response)
      });
};
export default JwtLogin;