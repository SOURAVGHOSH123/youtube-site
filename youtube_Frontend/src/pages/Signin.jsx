import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from "react-spinners"
import { authAxios } from "../APIs/ApiInstances"
import { Input, Button } from '../component/index'
import { useState } from 'react'
import { toast } from 'react-toastify'

function Signin() {
   const primaryColor = '#ff4d2d'
   const hoverColor = '#e64323'
   const bgColor = 'fff9f6'
   const borderColor = '#ddd'

   const [info, setInfo] = useState({ email: "", password: "", username: "" })
   const [error, setError] = useState("")
   const [message, setMessage] = useState("")
   const navigate = useNavigate()
   const [loading, setLoading] = useState(false)

   const handleLogin = async (e) => {
      e.preventDefault();
      if ((!info.email && !info.username) || !info.password) {
         setError("All fields are required");
         return;
      }
      setLoading(true)

      try {
         // console.log(info);  // debug
         const res = await authAxios.post('/users/login', info,
            { withCredentials: true });
         setMessage(res.data.message);
         toast("login successfully")
         setError("");
         setInfo({ email: "", password: "", username: "" })
         window.location.href = "/"
      } catch (error) {
         setError(error.response?.data?.message || error.response?.data?.error ||
            error.response?.error || "Signin failed");
         setMessage("");
      } finally {
         setLoading(false)
      }
   };
   return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-400">
         <div className="bg-blue-200 shadow-xl rounded-xl p-10 w-full max-w-md">

            <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
               Welcome Back 👋
            </h1>

            {/* Error */}
            {error && (<p className="text-red-600 text-center mb-3 font-medium">
               {error}</p>)}

            {/* Message */}
            {message && (<p className="text-green-600 text-center mb-3 font-medium">
               {message}</p>)}

            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
               <Input
                  type="text"
                  value={info.username}
                  placeholder="Username or email"
                  style={{ border: `1px solid ${borderColor}` }}
                  onChange={(e) => setInfo({ ...info, username: e.target.value })}
                  className="bg-gray-200"
                  required={false}
               />

               <Input
                  type="email"
                  value={info.email}
                  placeholder="Email or username"
                  style={{ border: `1px solid ${borderColor}` }}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  className="bg-gray-200"
                  required={false}
               />

               <Input
                  type="password"
                  value={info.password}
                  style={{ border: `1px solid ${borderColor}` }}
                  placeholder="Password"
                  onChange={(e) => setInfo({ ...info, password: e.target.value })}
                  className="bg-gray-200"
               />
               <div>
                  <a href="/forgetPassword"
                     className="text-red-700 float-end font-semibold hover:text-red-500">
                     forget passsword ?
                  </a>
               </div>

               <Button
                  type="submit"
                  className={`w-full border justify-center gap-2 items-center transition
                     duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer`}>
                  {loading ? <ClipLoader size={20} color='white' /> : "Login Account"}
               </Button>

               <p className="text-center text-gray-600">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-red-700 font-semibold hover:underline">
                     SignUp
                  </a>
               </p>
            </form>
         </div>
      </div >
   )
}

export default Signin