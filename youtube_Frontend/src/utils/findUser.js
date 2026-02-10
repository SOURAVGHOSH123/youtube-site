import { authAxios } from "../APIs/ApiInstances";

async function findUser() {
   const userDeatils = await authAxios.get("/users/profile");
   console.log(userDeatils, "udetails")
}

export default findUser;