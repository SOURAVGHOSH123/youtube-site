import React, { useEffect, useState } from 'react'
import './App.css'
import { ToastContainer } from "react-toastify"
import { Routes, Route } from 'react-router-dom'
import { Home, Profile, Signin, Signup } from './pages/index'
import PrivateRoutes from './routes/PrivateRoutes.jsx'
import PublicRoutes from './routes/PublicRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { findUser } from './utils/userHelper.js'
import { setUser } from './redux/slice/userSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    findUser(dispatch);
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path='/' element={<Home />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/:username/edit" element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
