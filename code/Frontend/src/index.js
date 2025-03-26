import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './Components/Login';
import Register from './Components/Register'
import CreateAccount from './Components/CreateAccount';
import ForgotUsername from './Components/ForgotUsername';
import Contact from './Components/Contact';
import ForgotPassword from './Components/ForgotPassword';
import Dashboard from './Components/AfterLogin/Dashboard';
import JwtLogin from './Components/JwtLogin'
import FundTransfer from './Components/AfterLogin/FundTransfer';
import LatestTransactions from './Components/AfterLogin/LatestTransactions';

import Dashboard1 from './Components/AfterLogin/Dashboard1';
import Beneficiary from './Components/AfterLogin/Beneficiary';
import AddBeneficiary from './Components/AfterLogin/AddBeneficiary';
import Deposit from './Components/AfterLogin/Deposit';
import WithDrawal from './Components/AfterLogin/WithDrawal'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
   
    
  },
  {
    path: "/Deposit",
    element: <Deposit />,
   
    
  },
  {
    path: "/WithDrawal",
    element: <WithDrawal />,
   
    
  },
  {
    path: "/JwtLOGIN",
    element: <JwtLogin />,
   
    
  },
  {
    path: "/Beneficiary",
    element: <Beneficiary />,
    
    
  },
  {
    path: "/AddBeneficiary",
    element: <AddBeneficiary />,
   
    
  },
  {
    path: "/LatestTransactions",
    element: <LatestTransactions/>,
   
    
  },
  {
    path: "/Login",
    element: <Login />,
   
    
  },
  {
  path: "/Dashboard",
  element: <Dashboard/>,
 
  
  },
  {
    path: "/FundTransfer",
    element: <FundTransfer />,
   
    
    },
  {
    path: "/Register",
    element: <Register />,
   
    
  },
  {
    path: "/CreateAccount",
    element: <CreateAccount />,
  }
  ,
  {
    path: "/ForgotUsername",
    element: <ForgotUsername />,
   
    
  }
  ,
  {
    path: "/ForgotPassword",
    element: <ForgotPassword />,
   
    
  },
  {
    path: "/Contact",
    element: <Contact />,
   
    
  },
 
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

