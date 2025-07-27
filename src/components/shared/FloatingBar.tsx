import React from 'react'

interface FloatingBarProps {  
  children: React.ReactNode;
}

export default function FloatingBar({ children }: FloatingBarProps) {
  return (
      <div className='absolute bottom-10 left-0 right-0 max-w-2xl mx-auto py-2 px-2 rounded-lg flex justify-between items-center bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 border'>
        {children}
      </div>
  )
}
