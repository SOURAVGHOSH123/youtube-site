import { useState, useRef, useEffect } from "react";
import {
   FaBars, FaYoutube, FaSearch, FaPlus, FaBell, FaUserCircle, FaVideo,
   FaBroadcastTower, FaPen, FaSignOutAlt, FaCog, FaQuestionCircle, FaCommentDots,
   FaMoon, FaGlobe, FaKeyboard, FaUser, FaExchangeAlt,
} from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { GoVideo, GoBroadcast } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { ImYoutube2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import useOutsideClick from "../hooks/UseOutsideClick";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slice/userSlice";
import authAuthorized from "../APIs/ApiInstances";
import { toast } from "react-toastify";

export default function Navbar({ toggle }) {
   const dispatch = useDispatch()
   const { user } = useSelector((state) => state.auth)
   // console.log(user, "user")
   const [showPlus, setShowPlus] = useState(false);
   const [showUser, setShowUser] = useState(false);
   const plusRef = useOutsideClick(() => setShowPlus(false));
   const userRef = useOutsideClick(() => setShowUser(false));

   const handlePlus = () => {
      setShowPlus(!showPlus);
      setShowUser(false);
   };

   const handleUser = () => {
      setShowUser(!showUser);
      setShowPlus(false);
   };

   const handleLogOut = async () => {
      const res = await authAuthorized.post("/users/logout", {},
         { withCredentials: true }
      );
      dispatch(logoutUser())
      localStorage.removeItem("persist:root");
      toast.success(res.data.message)
      window.location.href = "/signin"
   }

   const navigate = useNavigate()

   return (
      <>
         <div className="flex items-center justify-between px-4 py-3 shadow-md bg-white">
            {/* Left */}
            <div className="flex items-center gap-7">
               <FaBars className="text-xl cursor-pointer"
                  onClick={toggle} />
               <ImYoutube2 title="youtube home"
                  className="text-6xl text-red-600 cursor-pointer"
                  onClick={() => navigate("/")} />
            </div>

            {/* Search */}
            <div className="flex items-center w-1/2 border rounded-full overflow-hidden">
               <input
                  type="text"
                  title="write video name or description"
                  placeholder="Search"
                  className="flex-1 px-4 py-2 outline-none"
               />
               <button className="px-4 bg-gray-100">
                  <FaSearch title="search video" />
               </button>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6 pr-3">
               <p className="flex gap-2 items-center bg-gray-200 p-2 rounded-4xl"
                  onClick={handlePlus}>
                  <FiPlus className="cursor-pointer" size={25} />create
               </p>
               <FaBell className="cursor-pointer" title="notification" size={25} />

               <div onClick={handleUser} className="cursor-pointer">
                  {user?.avatar ?
                     <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover
                         border-green-500 shadow-md"
                     /> :
                     <div className="w-8 h-8 text-center rounded-full object-cover
                         bg-gray-900 shadow-md font-bold text-xl text-white">
                        {user?.fullname?.slice(0, 1).toUpperCase() || "U"}
                     </div>
                     // <FaUserCircle className="text-2xl cursor-pointer" />
                  }
               </div>
            </div>
         </div>

         {/* PLUS DROPDOWN */}
         {showPlus && (
            <div
               ref={plusRef}
               className="fixed top-15 right-15 w-50 bg-white shadow-lg 
                  rounded-lg p-4 z-50">
               <ul className="space-y-2">
                  <li className="cursor-pointer hover:bg-gray-100 rounded">
                     <MenuItem icon={<GoVideo size={25} />} text="Upload video" />
                  </li>
                  <li className="cursor-pointer hover:bg-gray-100 rounded">
                     <MenuItem icon={<GoBroadcast size={25} />} text="Go live" />
                  </li>
                  <li className="cursor-pointer hover:bg-gray-100 rounded">
                     <MenuItem icon={<IoCreateOutline size={25} />} text="Create post" />
                  </li>
               </ul>
            </div>
         )
         }

         {/* USER DROPDOWN */}
         {showUser && (
            <div className="absolute right-20 top-15 w-80 bg-white shadow-2xl
             rounded-lg max-h-[90vh] overflow-y-auto z-50" ref={userRef}>

               <div className="p-4 space-y-3">
                  {/* User Info */}
                  <div className="flex gap-3 items-center border-b pb-3">
                     <div className="cursor-pointer"
                        onClick={() => navigate(`/${user?.username}`)}>
                        {user.avatar ?
                           <img
                              src={user.avatar}
                              alt="avatar"
                              className="w-8 h-8 rounded-full object-cover border-1
                         border-green-500 shadow-md"
                           /> :
                           <div className="w-8 h-8 text-center rounded-full object-cover
                         bg-gray-900 shadow-md font-bold text-xl text-white">
                              {user.fullname.slice(0, 1).toUpperCase() || "U"}
                           </div>
                           // <FaUserCircle className="text-2xl cursor-pointer" />
                        }
                     </div>
                     <div>
                        <p className="font-semibold">{user.fullname || "full name"}</p>
                        <p className="text-gray-500">@{user?.username || "username123"}</p>
                        <p className="text-blue-600 cursor-pointer"
                           onClick={() => {
                              navigate(`/${user?.username}`)
                           }}
                        >View your channel
                        </p>
                     </div>
                  </div>

                  {/* Menu Items */}
                  <MenuItem icon={<FaUser />} text="Google Account" />
                  <MenuItem icon={<FaExchangeAlt />} text="Switch account" />
                  <MenuItem icon={<FaSignOutAlt />}
                     text="Sign out" onClick={handleLogOut} />
                  <MenuItem icon={<FaVideo />} text="YouTube Studio" />
                  <MenuItem icon={<FaYoutube />} text="Purchases and memberships" />
                  <MenuItem icon={<FaCog />} text="Your data in YouTube" />

                  <MenuItem icon={<FaMoon />}
                     text="Appearance: Device theme" />
                  <MenuItem icon={<FaGlobe />} text="Display language: English" />
                  <MenuItem icon={<FaCog />} text="Restricted Mode: Off" />
                  <MenuItem icon={<FaGlobe />} text="Location: India" />
                  <MenuItem icon={<FaKeyboard />} text="Keyboard shortcuts" />

                  <MenuItem icon={<FaCog />} text="Settings" />
                  <MenuItem icon={<FaQuestionCircle />} text="Help" />
                  <MenuItem icon={<FaCommentDots />} text="Send feedback" />
               </div>
            </div>
         )}
      </>
   );
}

function MenuItem({ icon, text, onClick }) {
   return (
      <div className="flex items-center gap-3 cursor-pointer
       hover:bg-gray-100 p-2 rounded" onClick={onClick}>
         {icon}
         <span>{text}</span>
      </div>
   );
}