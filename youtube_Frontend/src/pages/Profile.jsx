import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import authAuthorized from "../APIs/ApiInstances";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { setUser } from "../redux/slice/userSlice";
import { timeAgo } from "../utils/userHelper";
import { VideoCard } from "../component";

export default function Profile() {
   const { username } = useParams()
   const { user } = useSelector((s) => s.auth);
   const isMyChannel = user?.username === username;
   const [channelDatas, setChannelDatas] = useState([]);
   const [videos, setVideos] = useState([]);
   const [isEdit, setIsEdit] = useState(false);
   const [showVideo, setShowVideo] = useState(true);
   const [showAbout, setShowAbout] = useState(false);
   const navigate = useNavigate()
   const dispatch = useDispatch();

   // ---------------- Fetch Channel Data ----------------
   useEffect(() => {
      fetchChannelData();
   }, [username]);

   const fetchChannelData = async () => {
      try {
         const [channelData] = await Promise.all([
            // authAuthorized.get(`/videos?userId=${channelDatas[0]?._id}`),
            authAuthorized.get(`/users/channel/${username}`),
         ]);

         setChannelDatas(channelData.data.data);
         // console.log(channelData.data.data, "channledata");
      } catch (err) {
         toast.error("Failed to load channel data");
      }
   };

   useEffect(() => {
      if (channelDatas[0]?._id) {
         authAuthorized
            .get("/videos", {
               params: { userId: channelDatas[0]._id },
            })
            .then((res) => setVideos(res.data.data.docs));
      }
   }, [channelDatas]);

   console.log(videos, "videos")
   const handleVideo = () => {
      setShowVideo(true)
      setShowAbout(false)
   }
   const handleAbout = () => {
      setShowVideo(false)
      setShowAbout(true)
   }

   // ---------------- Update Profile ---------------
   // const updateDetails = async () => {
   //    if (!fullname || !email) {
   //       toast.error("Full name and email required");
   //       return;
   //    }
   //    const res = await authAuthorized.patch("/users/edit-profile",
   //       { fullname, email }, { withCredentials: true });
   //    toast.success(res.data?.message);
   //    dispatch(setUser(res.data?.data))
   //    // window.location.href = "/profile"
   // };

   // const updateAvatar = async (file) => {
   //    const fd = new FormData();
   //    fd.append("avatar", file);

   //    const res = await authAuthorized.patch("/users/avatar", fd, {
   //       headers: { "Content-Type": "multipart/form-data" },
   //       withCredentials: true
   //    })
   //    toast.success(res.data?.message);
   //    dispatch(setUser(res.data?.data))
   //    // window.location.href = "/profile"
   // };

   // const updateCover = async (file) => {
   //    const fd = new FormData();
   //    fd.append("coverImage", file);
   //    const res = await authAuthorized.patch("/users/cover-image", fd, {
   //       headers: { "Content-Type": "multipart/form-data" },
   //       withCredentials: true
   //    });
   //    toast.success(res.data?.message);
   //    dispatch(setUser(res.data?.data))
   //    // window.location.href = "/profile"
   // };

   // ---------------- UI ---------------
   return (
      // <div className="md:p-6 p-2 bg-gray-50 min-h-screen grid grid-cols-1 
      // md:gap-8 gap-4">

      //    {/* LEFT SECTION */}
      //    <div className="space-y-6 bg-white py-2 md:px-4 rounded-xl shadow">
      //       <img
      //          src={channelDatas[0]?.coverImage}
      //          alt="cover"
      //          className="w-full h-50 px-3 object-fit rounded-lg"
      //       />

      //       <div className="flex items-center gap-4">
      //          <img
      //             src={channelDatas[0]?.avatar}
      //             alt="avatar"
      //             className="w-30 h-30 rounded-full border-4 border-white shadow"
      //          />

      //          <div className="flex flex-col gap-2 w-full">
      //             {/* <input
      //                value={channelDatas[0]?.fullname}
      //                disabled={!isEdit}
      //                onChange={(e) => setFullname(e.target.value)}
      //                className={`input border p-2 rounded ${!isEdit && "bg-gray-100 cursor-not-allowed"
      //                   }`}
      //             /> */}
      //             <p className="text-4xl font-bold">{channelDatas[0]?.fullname}</p>
      //             <p className="text-md">@{channelDatas[0]?.username}</p>
      //             <p className="text-md">{channelDatas[0]?.email}</p>

      //             {/* <input
      //                value={email}
      //                disabled={!isEdit}
      //                onChange={(e) => setEmail(e.target.value)}
      //                className={`input border p-2 rounded ${!isEdit && "bg-gray-100 cursor-not-allowed"
      //                   }`}
      //             /> */}
      //          </div>
      //       </div>

      //       {/* Buttons */}
      //       {/* <div className="flex gap-3">
      //          {!isEdit ? (
      //             <button
      //                onClick={() => setIsEdit(true)}
      //                className="px-4 py-2 bg-yellow-400 rounded"
      //             >
      //                Edit Details
      //             </button>
      //          ) : (
      //             <>
      //                <button
      //                   onClick={() => {
      //                      updateDetails();
      //                      setIsEdit(false);
      //                   }}
      //                   className="px-4 py-2 bg-blue-500 text-white rounded"
      //                >Save</button>
      //                <button
      //                   onClick={() => {
      //                      setIsEdit(false);
      //                      setFullname(channelDatas[0]?.fullname);
      //                      setEmail(channelDatas[0]?.email);
      //                   }}
      //                   className="px-4 py-2 bg-gray-300 rounded"
      //                >Cancel</button>
      //             </>
      //          )}
      //       </div> */}

      //       {/* Image updates */}
      //       {/* <div className="pt-4 border-t space-y-3">
      //          <div>
      //             <p className="text-sm font-medium">Update Avatar</p>
      //             <input type="file" onChange={(e) => updateAvatar(e.target.files[0])} />
      //          </div>

      //          <div>
      //             <p className="text-sm font-medium">Update Cover</p>
      //             <input type="file" onChange={(e) => updateCover(e.target.files[0])} />
      //          </div>
      //       </div> */}
      //    </div>

      //    {/* RIGHT SECTION */}
      //    <div className="bg-white p-6 rounded-xl shadow">
      //       <h3 className="text-xl font-semibold mb-4">Channel Statistics</h3>

      //       <div className="grid grid-cols-2 gap-4 mb-6">
      //          <StatBox label="Subscribers" value={channelDatas[0]?.subscribersCount} />
      //          <StatBox label="Total Videos" value={channelDatas[0]?.channelSubscribedToCount} />
      //          {/* <StatBox label="Total Views" value={stats.totalViews} />
      //          <StatBox label="Total Likes" value={stats.totalLikes} /> */}
      //       </div>

      //       <h3 className="text-xl font-semibold mb-3">Videos</h3>
      //       {/* 
      //       <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      //          {videos.map((vid) => (
      //             <div key={vid._id} className="flex gap-3 border p-2 rounded">
      //                <img
      //                   src={vid.thumbnail}
      //                   alt=""
      //                   className="w-32 h-20 object-cover rounded"
      //                />
      //                <div>
      //                   <p className="font-semibold">{vid.title}</p>
      //                   <p className="font-semibold">{vid.description}</p>
      //                   <p className="text-sm text-gray-500">
      //                      {vid.views} views
      //                   </p>
      //                   <p className="text-sm text-gray-500">
      //                      {timeAgo(vid.createdAt)}
      //                   </p>

      //                </div>
      //             </div>
      //          ))}
      //       </div> */}

      //       <div className="border-2 w-full gap-4">
      //          <div className="flex">
      //             <span>published</span>
      //             <span>private</span>
      //          </div>
      //          <div></div>
      //       </div>
      //    </div>

      // </div>


      <div className="w-full bg-white min-h-screen space-y-4 gap-4 pb-6">
         {/* COVER */}
         <div className="w-full h-60">
            <img
               src={channelDatas[0]?.coverImage}
               className="w-full h-full object-fit py-3"
            />
         </div>

         {/* CHANNEL HEADER */}
         <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-6 -mt-12">

               {/* AVATAR */}
               <img
                  src={channelDatas[0]?.avatar}
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
               />

               {/* INFO */}
               <div className="flex-1">
                  <h1 className="text-3xl font-bold">
                     {channelDatas[0]?.fullname}
                  </h1>

                  <p className="text-gray-600">
                     <span>@{channelDatas[0]?.username} </span>
                     <span className="px-2">
                        •{" "} {channelDatas[0]?.subscribersCount} subscribers
                     </span>
                     <span className="px-2">
                        •{" "} {channelDatas[0]?.videoCount} videos
                     </span>
                  </p>

                  <p className="text-sm text-gray-500 m-2 ">
                     Welcome to my channel. Here you will find amazing content
                     You can see more ....
                     <span className="bg-gray-200 p-1 text-md font-bold rounded-full">
                        more</span>
                  </p>

                  {/* BUTTON SECTION */}
                  <p>
                     {isMyChannel ? (
                        <span className="flex gap-3">
                           <button
                              onClick={() =>
                                 navigate(`/${channelDatas[0]?.username}/edit`)}
                              className="px-4 py-2 bg-gray-200 rounded-full font-semibold"
                           >
                              Customize Channel
                           </button>
                           <button
                              onClick={() => navigate("/studio/videos")}
                              className="px-4 py-2 bg-black text-white rounded-full font-semibold"
                           >
                              Manage Videos
                           </button>
                        </span>
                     ) : (
                        <button className="px-6 py-2 bg-black text-white rounded-full font-semibold">
                           Subscribe
                        </button>
                     )}
                  </p>
               </div>
            </div>
         </div>

         <div className="border-b mt-8 px-4">
            <div className="max-w-6xl mx-auto px-4 flex gap-8 text-lg">
               <button className={`py-3 text-gray-500 ${showVideo && `
               border-b-2 border-black font-semibold`}`}
                  onClick={handleVideo}>
                  Videos
               </button>
               <button className={`py-3 text-gray-500 ${showAbout && `
               border-b-2 border-black font-semibold`}`}
                  onClick={handleAbout}>
                  About</button>
            </div>
         </div>

         {/* channel videos */}
         {showVideo &&
            <div className="max-w-6xl mx-auto px-4 mt-6 grid
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

               {videos.map((video) => {
                  // If other user's channel → show only published
                  if (!isMyChannel && !video.isPublished) return null;

                  return (
                     <div key={video._id} className="relative">
                        <VideoCard video={video} />

                        {/* Badge for owner */}
                        {isMyChannel && !video.isPublished && (
                           <span className="absolute top-2 left-2 bg-red-600
                           text-white text-xs px-2 py-1 rounded">
                              Private
                           </span>
                        )}
                     </div>
                  );
               })}
            </div>
         }

      </div >

   );
}

function StatBox({ label, value }) {
   return (
      <div className="p-4 bg-gray-100 rounded text-center shadow">
         <p className="text-lg font-bold">{value || 0}</p>
         <p className="text-sm text-gray-600">{label}</p>
      </div>
   );
}
