import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <div className='w-full py-4 px-20 shadow-md flex justify-between items-center'>
      <div>
        <h1 className='text-2xl font-bold'>SowSmart</h1>
      </div>
      <div className='flex gap-5 items-center'>
        <Link href='/' className='hover:underline'>Home</Link>
        <Link href='/about' className='hover:underline'>About</Link>
        <Link href='/contact' className='hover:underline'>Contact</Link>
        <SignedOut>
          <Button>
              <Link href='/login'>
                  Login
              </Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  )
}

export default Navbar
