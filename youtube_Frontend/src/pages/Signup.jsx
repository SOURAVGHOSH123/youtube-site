import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoEye, IoEyeOff, IoCamera } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'
import { Input, Button } from '../component';
import { authAxios } from '../APIs/ApiInstances';
import { toast } from 'react-toastify';
const defaultAvatar =
   "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function Signup() {
   const primaryColor = '#ff4d2d'
   const hoverColor = '#e64323'
   const bgColor = 'fff9f6'
   const borderColor = '#ddd'

   const [information, setInformation] = useState({
      username: "", email: "", fullname: "", password: ""
   })
   const [loading, setLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const [error, setError] = useState("");
   const [message, setMessage] = useState("");
   const [preview, setPreview] = useState(defaultAvatar);
   const [avatar, setAvatar] = useState(null);
   // const [coverImage, setCoverImage] = useState(null);
   const navigate = useNavigate()
   // const dispatch = useDispatch()

   const handleAvatar = (e) => {
      const file = e.target.files[0];
      console.log(file, "file")
      if (file) {
         setAvatar(file);
         setPreview(URL.createObjectURL(file));
      }
   };

   async function handleSubmit(e) {
      e.preventDefault();
      setLoading(true);

      try {
         const data = new FormData();

         Object.keys(information).forEach((key) => {
            data.append(key, information[key]);
         });

         if (!avatar) {
            setError("avatar is required")
            return;
         }
         data.append("avatar", avatar)
         // if (coverImage) data.append("coverImage", coverImage)

         console.log(data, "data")
         const res = await authAxios.post("/users/register", data, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
         });

         setMessage(res.data.message);
         toast("register successfully")
         setError("");
         navigate("/signin");
         setPreview(defaultAvatar)
         setAvatar(null)
      } catch (err) {
         const data = err.response?.data;

         if (data?.errors?.length) {
            // multiple validation errors
            setError(data.errors.join(", "));
         } else if (data?.message) {
            // single error message
            setError(data.message);
         } else {
            setError("Something went wrong");
         }

         setMessage("");
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className='min-h-screen flex items-center justify-center w-full p-4' style={{ backgroundColor: bgColor }}>
         <div className={`w-full mx-auto max-w-md shadow-lg rounded-xl mb-5 p-8 border-[ipx] border-block/10 bg-white`}
            style={{ border: `1px solid ${borderColor}` }}>

            {/* Avatar Section */}
            <div className="flex justify-center mb-6 relative">
               <label className="cursor-pointer">
                  <img
                     src={preview}
                     alt="avatar"
                     className="w-28 h-28 rounded-full object-cover border-4 border-green-500 shadow-md"
                  />
                  <div className="absolute bottom-1 right-[42%] bg-green-600 text-white p-2 rounded-full">
                     <IoCamera />
                  </div>
                  <input
                     type="file"
                     accept="image/*"
                     hidden required
                     onChange={handleAvatar}
                  />
               </label>
            </div>


            <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
               Create Your Account ✨
            </h1>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            {message && <p className="text-green-600 text-center mb-4">{message}</p>}

            <form onSubmit={handleSubmit}>
               <div className='space-y-5'>

                  {/* full name */}
                  <Input
                     label="Full name: "
                     type="text"
                     style={{ border: `1px solid ${borderColor}` }}
                     placeholder="Enter your full name"
                     onChange={(e) =>
                        setInformation({ ...information, fullname: e.target.value })}
                     value={information.fullname}
                  />

                  {/* username name */}
                  <Input
                     label="Username: "
                     type="text"
                     style={{ border: `1px solid ${borderColor}` }}
                     placeholder="Enter your full name"
                     onChange={(e) =>
                        setInformation({ ...information, username: e.target.value })}
                     value={information.username}
                  />

                  {/* email */}
                  <Input
                     type="email"
                     label="Email: "
                     placeholder="Enter your email"
                     style={{ border: `1px solid ${borderColor}` }}
                     onChange={(e) =>
                        setInformation({ ...information, email: e.target.value })}
                     value={information.email}
                  />

                  {/* password */}
                  <div className='w-full mb-4'>
                     <label
                        className={`inline-block text-gray-600 font-medium mb-1 ml-1 pl-1`}
                        htmlFor="password">Password: </label>
                     <div className='relative'>
                        <input
                           type={`${showPassword ? "text" : "password"}`}
                           placeholder='Enter your password'
                           style={{ border: `1px solid ${borderColor}` }}
                           className={`w-full px-3 py-2 text-block rounded-lg duration-200 border 
                           focus:border-orange-400 outline-none focus:outline-none`}
                           onChange={(e) =>
                              setInformation({ ...information, password: e.target.value })}
                           value={information.password}
                        />
                        <button
                           type="button"
                           className='absolute cursor-pointer right-3 top-3 text-gray-500'
                           onClick={() => { setShowPassword((prev) => !prev) }}>
                           {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                     </div>
                  </div>

                  {/* 
                  <Input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
                   */}

                  <Button
                     type="submit"
                     className={`w-full border justify-center gap-2 items-center transition
                     duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer`}
                     disabled={loading}>
                     {loading ? <ClipLoader size={20} color='white' /> : "Create Account"}
                  </Button>
               </div>
            </form>
            <p className='text-center m-3 text-xl w-full text-gray-900'>or</p>

            <p className='text-center mt-4 cursor-pointer'
               onClick={() => navigate('/signin')}>Already have an Account ?
               <span className='text-[#ff4d2d]'> Signin</span></p>
         </div>
      </div>
   )
}

export default Signup;