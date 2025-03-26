import {useNavigate} from 'react-router-dom';
const Dashboard=()=>{
  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem('jsonwebtoken');
    navigate('/');
  }
  
  const handleFundTransfer=()=>{
    navigate('/Dashboard/FundTransfer')
  }

  return(
    <div>
  <h1>Welcome to the Dashboard</h1>
  <button type="button" onClick={handleFundTransfer}>Fund Transfer</button>
   <button type="button" onClick={handleLogout}>Logout</button>
   </div>
  );
}
export default Dashboard;