import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import api from "../../Service/ApiService";
import ApiRoutes from "../../utils/ApiRoutes";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e)=>{
    e.preventDefault();

    if(!name) {
      setError("Please enter your name");
      return;
    }

    if(!validateEmail(email)) {
      setError("Please enter valid email");
      return;
    }

    if(!password) {
      setError("Please enter password");
      return;
    }

    setError("");

    try {
    
      const response = await api.post(ApiRoutes.SignUp.path, {name: name, email: email, password: password}, {authenticate: ApiRoutes.SignUp.authenticate});
      console.log(response);
      
      if(response.status === 201){
        navigate("/login")
      }else{
        setError("response.data.message")
      }
  
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("An Unexpected error occured")
      }
    }
  }

  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignup}>
            <h4 className='text-2xl mb-7'>SignUp</h4>

            <input type="text" placeholder='Name' value={name} className='input-box' onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder='Email' value={email} className='input-box' onChange={(e)=>setEmail(e.target.value)}/>
            <PasswordInput value={password} onChange={(e)=>setPassword(e.target.value)}/>

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type='submit' className='btn-primary'>SignUp</button>

            <p className='text-sm text-center mt-4'>Already have an account? <Link to="/login" className="font-medium text-primary underline">Login</Link></p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup