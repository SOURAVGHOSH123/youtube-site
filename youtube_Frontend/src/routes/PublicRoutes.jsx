import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function PublicRoutes() {
   const { user } = useSelector((state) => state.auth)
   // console.log(user, "u")

   return (
      <div>
         {!user ? <Outlet /> : <Navigate to={"/"} />}
      </div>
   )
}

export default PublicRoutes;