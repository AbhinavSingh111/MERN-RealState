import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import {useDispatch, useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";


const SignIn = () => {
  const {loading , error} = useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const formData = {email:e.target[0].value,password:e.target[1].value}
    dispatch(signInStart());
    try {
      const res = await fetch('/api/auth/signin',{
        method: 'POST',
        headers:{'content-Type':'application/json'},
        body:JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success===false){
        dispatch(signInFailure(data.message))
        
        return
      }
      dispatch(signInSuccess(data))
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      
    }
    
    
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          className="border p-3 rounded-lg"
          placeholder="email"
          id="email"
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          id="password"
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to={"/signup"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignIn;
