import { useEffect, useState } from "react";
import { CategoryBar, Layout, VideoCard } from "../component/index"
import authAuthorized from "../APIs/ApiInstances";

export default function Home() {
   const [videos, setVideos] = useState([])
   const [filter, setFilter] = useState("all")

   useEffect(() => {
      const findUser = async () => {
         const res = await authAuthorized.get("/videos", {
            params: {
               filter: filter,
            },
            withCredentials: true
         });
         console.log(res.data.data.docs)
         setVideos(res.data.data.docs);
      };

      findUser();
   }, [filter]);

   return (
      <>
         <CategoryBar setFilter={setFilter} />
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
            lg:grid-cols-4 gap-6 mt-4">
            {videos?.map((v) => (
               <VideoCard key={v._id} video={v} />
            ))}
         </div>
      </>
   );
}
