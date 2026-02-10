import { FaHome, FaVideo, FaTwitter, FaYoutube, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import authAuthorized from "../APIs/ApiInstances";
import { useSelector } from "react-redux";


export default function Sidebar({ collapsed }) {
   const { user } = useSelector(s => s.auth)
   const [subscribedChannels, setSubscribedChannels] = useState([])
   useEffect(() => {
      (async () => {
         const res = await authAuthorized.get(`/subscriptions/u/${user._id}`)
         console.log(res.data?.data, "subscr")
         setSubscribedChannels(res.data?.data)
      })()
   }, [user])
   const navigate = useNavigate()
   return (
      <div className={`bg-white shadow-md sm:p-4 p-2 transition-all duration-300
         ${collapsed ? "sm:w-15 w-10" : "sm:w-60 w-33"}`}>
         <ul className="space-y-6">
            <li className="flex items-center gap-3 cursor-pointer"
               onClick={() => navigate("/")}>
               <FaHome className="text-xl" title="home" />
               {!collapsed && <span>Home</span>}
            </li>
            <li className="flex items-center gap-3 cursor-pointer"
               onClick={() => navigate("/videos")}>
               <FaVideo className="text-xl" title="video" />
               {!collapsed && <span>Videos</span>}
            </li>
            <li className="flex items-center gap-3 cursor-pointer"
               onClick={() => navigate("/tweets")}>
               <FaTwitter className="text-xl" title="twitter" />
               {!collapsed && <span>Twitter</span>}
            </li>
            <li className="flex items-center gap-3 cursor-pointer"
               onClick={() => navigate("/subscriptions")}>
               <FaYoutube className="text-xl" title="subscription" />
               {!collapsed && <span>Subscriptions</span>}
            </li>

            {collapsed &&
               <li className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/${user?.username}`)}>
                  <FaUserCircle className="text-xl" />
               </li>
            }

         </ul>
         {!collapsed && (
            <div className="space-y-3 pt-5">
               <p className="flex text-gray-900 text-sm bg-gray-200 py-3 gap-2">
                  Subscribed Channels <IoIosArrowForward size={20} />
               </p>
               {subscribedChannels?.map((s) => (
                  <li className="flex px-2 items-center cursor-pointer" key={s._id}
                     onClick={() => navigate(`/${s?.username}`)}>
                     <span className="pr-3">
                        <img src={s?.avatar} alt=""
                           className="w-8 h-8 rounded-full object-cover
                         border-green-500 shadow-md" />
                     </span>
                     <span>{s?.fullname}</span>
                  </li>
               ))}
               {/* <li className="flex items-center cursor-pointer">Channel 2</li> */}
            </div>
         )}
      </div>
   );
}
