import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";

export default function Channel() {
   const { username } = useParams();
   const [data, setData] = useState();

   useEffect(() => {
      api.get(`/users/c/${username}`).then((res) => {
         setData(res.data.data[0]);
      });
   }, []);

   if (!data) return "Loading...";

   return (
      <div>
         <img src={data.coverImage} className="w-full h-60 object-cover" />
         <div className="p-6">
            <img src={data.avatar} className="h-24 w-24 rounded-full" />
            <h2 className="text-2xl">{data.fullname}</h2>
            <p>@{data.username}</p>
            <p>{data.subscribersCount} Subscribers</p>
            <p>{data.channelSubscribedToCount} Subscribed </p>
         </div>
      </div>
   );
}
