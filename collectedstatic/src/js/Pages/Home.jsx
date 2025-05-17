import { Link } from '@inertiajs/react'
import React from 'react'

export default function Home() {
  return (
    <main>
       <h1>Home Page</h1>
       <Link href="/contact">Contact</Link>
        <Link href="accounts/login/">Login</Link>
        <Link href="accounts/signup/">Sign Up</Link>
    </main>
  )
}
