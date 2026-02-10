import React from 'react'
import { useSelector } from "react-redux"
import { Navigate, Outlet } from 'react-router-dom'
import { Layout } from '../component'

function PrivateRoutes() {
  const user = useSelector((state) => state.auth.user)
  // console.log(user, "u")
  return (
    <Layout>
      {user ? <Outlet /> : <Navigate to={"/signin"} />}
    </Layout>
  )
}

export default PrivateRoutes