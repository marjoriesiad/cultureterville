import { Croissant, ShoppingCart, User } from 'lucide-react'
import React from 'react'

const Header = () => {
  return (
    <header>
        <div className='flex justify-between items-center bg-pink-500 p-4'>
            <Croissant />
            <h2 className='text-lg uppercase font-bold'>Culture Pain Terville</h2>
            <div className='flex gap-3 items-center'>
                <ShoppingCart />
                <User />
            </div>
        </div>
        
    </header>
  )
}

export default Header