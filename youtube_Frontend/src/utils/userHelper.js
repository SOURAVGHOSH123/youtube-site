import { data } from "react-router-dom";
import authAuthorized, { authAxios } from "../APIs/ApiInstances";
import { setUser, logoutUser } from "../redux/slice/userSlice";

const findUser = async (dispatch) => {
   try {
      const res = await authAuthorized.get("/users/profile");
      dispatch(setUser(res.data.data));
   } catch {
      dispatch(logoutUser());
      localStorage.removeItem("persist:root");
   }
};

const formatViews = (views) => {
   if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M";
   if (views >= 1_000) return (views / 1_000).toFixed(1) + "K";
   return views;
};

const timeAgo = (date) => {
   const seconds = Math.floor((new Date() - new Date(date)) / 1000);

   const intervals = [
      { label: "year", secs: 31536000 },
      { label: "month", secs: 2592000 },
      { label: "week", secs: 604800 },
      { label: "day", secs: 86400 },
      { label: "hour", secs: 3600 },
      { label: "minute", secs: 60 },
   ];

   for (const i of intervals) {
      const count = Math.floor(seconds / i.secs);
      if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
   }

   return "Just now";
};

const formatDuration = (totalSeconds = 0) => {
   const h = Math.floor(totalSeconds / 3600);
   const m = Math.floor((totalSeconds % 3600) / 60);
   const s = totalSeconds % 60;

   if (h > 0) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
   }

   if (m > 0) {
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
   }

   return `00:${String(s).padStart(2, "0")}`;
}

export { findUser, formatViews, timeAgo, formatDuration };

// const loginUser = async function () {
// try {
//    const response = await authAxios.post("/users/login", data)
//    return response.data;
// } catch (error) {
//    console.log(error?.message, "err-li")
//    return;
// }}

// const logoutUser = async function () {
//    try {
//       const response = await authAuthorized.get("/users/logout");
//       console.log(response.data)
//       return response.data
//    } catch (error) {
//       console.log(error?.message, "err-lo")
//       return;
//    }
// }

// async function findUser() {
//    try {
//       const userDeatils = await authAxios.get("/users/profile");
//       console.log(userDeatils.data, "udetails")
//       return userDeatils.data;
//    } catch (error) {
//       console.log(error.errors || error.message, "err-fu")
//       return;
//    }
// }