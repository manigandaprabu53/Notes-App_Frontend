import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar.jsx'
import {Link, useNavigate} from "react-router-dom"
import PasswordInput from '../../components/Input/PasswordInput.jsx'
import { validateEmail } from '../../utils/helper.js';
import api from "../../Service/ApiService.jsx"
import ApiRoutes from "../../utils/ApiRoutes.jsx";

function Login() {

  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Inside Handle Login");
    
    if(!validateEmail(email)) {
      console.log("Email Field")
      setError("Please enter a valid email");
      return;
    }
    
    if(!password) {
      console.log("Password Field")
      setError("Please enter the password");
      return;
    }

    setError("");

  // Login API
  try {
    
    const response = await api.post(ApiRoutes.Login.path, {email: email, password: password}, {authenticate: ApiRoutes.Login.authenticate});
    console.log(response);
    
    if(response.status === 200){
      localStorage.setItem("token", response.data.token)
      navigate("/")
    }

  } catch (error) {
    if(error.response && error.response.data && error.response.data.message){
      setError(error.response.data.message);
    }else{
      setError("An Unexpected error occured")
    }
  }
}

  return <>
    <Navbar />

    <div className='flex items-center justify-center mt-28'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
        <form onSubmit={handleLogin}>
          <h4 className='text-2xl mb-7'>Login</h4>

          <input type="text" placeholder='Email' value={email} className='input-box' onChange={(e)=>setEmail(e.target.value)}/>

          <PasswordInput value={password} onChange={(e)=>setPassword(e.target.value)}/>

          {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

          <button type='submit' className='btn-primary'>Login</button>

          <p className='text-sm text-center mt-4'>Not registered yet? <Link to="/signup" className="font-medium text-primary underline">Create an account</Link></p>
        </form>
      </div>
    </div>

  </>
}

export default Login