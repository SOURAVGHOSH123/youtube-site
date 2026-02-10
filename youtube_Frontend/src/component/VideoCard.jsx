import { Link } from "react-router-dom";
import { formatViews, timeAgo } from "../utils/userHelper";

export default function VideoCard({ video }) {
   // console.log(video, "vd")
   return (
      <Link
         to={`/watch/${video._id}`}
         className="cursor-pointer block group"
      >
         {/* Thumbnail */}
         <div className="relative">
            <img
               src={video.thumbnail}
               alt="thumbnail"
               className="rounded-xl w-full h-48 object-cover group-hover:opacity-90 transition"
            />

            {/* Duration */}
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
               {new Date(video.duration * 1000).toISOString().substr(11, 8)}
            </span>
         </div>

         {/* Info */}
         <div className="flex gap-3 mt-3">
            <img
               src={video.owner?.avatar}
               alt="channel"
               className="rounded-full h-10 w-10 object-cover"
            />

            <div className="flex flex-col">
               <h3 className="font-semibold text-sm line-clamp-2 leading-5">
                  {video.title}
               </h3>

               <p className="text-xs text-gray-600 mt-1">
                  {video.owner?.fullname}
               </p>

               <p className="text-xs text-gray-500">
                  {formatViews(video.views)} views • {timeAgo(video.createdAt)}
               </p>
            </div>
         </div>
      </Link>
   );
}
