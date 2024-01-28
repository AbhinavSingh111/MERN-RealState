import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
const SignUp = () => {
  const [error , setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const formData = {username:e.target[0].value,email:e.target[1].value,password:e.target[2].value}
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup',{
        method: 'POST',
        headers:{'content-Type':'application/json'},
        body:JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success===false){
        setLoading(false)
        setError(data.message)
        
        return
      }
      setLoading(false)
      setError(null)
      navigate('/signin');
    } catch (error) {
      setLoading(false)
      setError(error.message)
      
    }
    
    
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-3 rounded-lg"
          placeholder="username"
          id="username"
        />
        <input
          className="border p-3 rounded-lg"
          placeholder="email"
          id="email"
        />
        <input
          className="border p-3 rounded-lg"
          placeholder="password"
          id="password"
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
