import React from 'react'
import { Outlet } from 'react-router'
import NavBar from './Components/NavBar'


export default function App() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}
