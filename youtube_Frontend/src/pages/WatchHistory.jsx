import api from "../api/axios";
import { useEffect, useState } from "react";

export default function WatchHistory() {
   const [videos, setVideos] = useState([]);

   useEffect(() => {
      api.get("/users/history").then((res) => {
         setVideos(res.data.data);
      });
   }, []);

   return (
      <div className="grid grid-cols-4 gap-4 p-4">
         {videos.map((v) => (
            <div key={v._id}>
               <img src={v.thumbnail} />
               <h4>{v.title}</h4>
               <p>{v.owner.fullname}</p>
            </div>
         ))}
      </div>
   );
}
